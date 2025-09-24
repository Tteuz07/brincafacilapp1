import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'

// Verificar se as credenciais são válidas
const hasValidCredentials = supabaseUrl !== 'https://placeholder.supabase.co' && 
                           supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'

export const supabase = hasValidCredentials ? createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
}) : null

// Função para verificar se usuário tem acesso aprovado
export const checkUserAccess = async (email) => {
  try {
    if (supabase) {
      // Primeiro tenta verificar na tabela authorized_emails
      const { data: authorizedEmail, error: authError } = await supabase
        .from('authorized_emails')
        .select('email, active')
        .eq('email', email)
        .eq('active', true)
        .single()
      
      if (authorizedEmail) {
        return true
      }
      
      // Se não encontrou na tabela authorized_emails, tenta na tabela users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('status')
        .eq('email', email)
        .single()
      
      if (userError && userError.code !== 'PGRST116') {
        console.warn('Erro ao verificar usuário:', userError)
      }
      
      return userData?.status === 'approved'
    }
    
    // Se não tiver Supabase, aceita alguns emails de teste
    const testEmails = ['teste@exemplo.com', 'admin@brincafacil.com']
    return testEmails.includes(email.toLowerCase())
  } catch (error) {
    console.error('Erro ao verificar acesso do usuário:', error)
    // Em caso de erro, aceita emails de teste como fallback
    const testEmails = ['teste@exemplo.com', 'admin@brincafacil.com']
    return testEmails.includes(email.toLowerCase())
  }
}

// Função para verificar status do usuário (approved/pending)
export const getUserStatus = async (email) => {
  try {
    if (supabase) {
      // Primeiro tenta verificar na tabela authorized_emails
      const { data: authorizedEmail, error: authError } = await supabase
        .from('authorized_emails')
        .select('email, active, created_at')
        .eq('email', email)
        .eq('active', true)
        .single()
      
      if (authorizedEmail) {
        return { 
          status: 'approved',
          source: 'authorized_emails',
          created_at: authorizedEmail.created_at
        }
      }
      
      // Se não encontrou na tabela authorized_emails, tenta na tabela users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('status, created_at, updated_at')
        .eq('email', email)
        .single()
      
      if (userError && userError.code !== 'PGRST116') {
        console.warn('Erro ao verificar usuário:', userError)
      }
      
      return userData || { status: 'not_found' }
    }
    
    // Se não tiver Supabase, simula usuário aprovado
    const testEmails = ['teste@exemplo.com', 'admin@brincafacil.com']
    return testEmails.includes(email.toLowerCase()) 
      ? { status: 'approved', source: 'test' } 
      : { status: 'not_found' }
  } catch (error) {
    console.error('Erro ao verificar status do usuário:', error)
    // Em caso de erro, verifica se é email de teste
    const testEmails = ['teste@exemplo.com', 'admin@brincafacil.com']
    return testEmails.includes(email.toLowerCase()) 
      ? { status: 'approved', source: 'test_fallback' } 
      : { status: 'error' }
  }
}

// Função simples para login
export const signInWithEmail = async (email) => {
  if (!supabase) {
    console.warn('Supabase não configurado - usando dados locais')
    
    const hasAccess = await checkUserAccess(email)
    
    if (!hasAccess) {
      throw new Error('Email não autorizado para acesso')
    }
    
    return { 
      data: { 
        user: { 
          id: 'user-' + Date.now(), 
          email: email,
          created_at: new Date().toISOString()
        } 
      }, 
      error: null 
    }
  }
  
  try {
    const hasAccess = await checkUserAccess(email)
    
    if (!hasAccess) {
      throw new Error('Email não autorizado para acesso')
    }
    
    // Login direto sem envio de email
    const simulatedUser = {
      id: 'user-' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10),
      email: email,
      created_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(),
      user_metadata: {}
    }
    
    return { 
      data: { 
        user: simulatedUser,
        session: {
          access_token: 'simulated-token',
          refresh_token: 'simulated-refresh',
          expires_in: 3600,
          user: simulatedUser
        }
      }, 
      error: null 
    }
  } catch (error) {
    return { data: null, error }
  }
}

export default supabase