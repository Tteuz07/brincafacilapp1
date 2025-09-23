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

// Função simples para verificar se email tem acesso
export const checkEmailAccess = async (email) => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('authorized_emails')
        .select('email')
        .eq('email', email)
        .eq('active', true)
        .single()
      
      if (error && error.code !== 'PGRST116') {
        throw error
      }
      
      return !!data
    }
    
    // Se não tiver Supabase, aceita alguns emails de teste
    const testEmails = ['demo@brincafacil.com', 'teste@exemplo.com', 'admin@brincafacil.com']
    return testEmails.includes(email.toLowerCase())
  } catch (error) {
    console.error('Erro ao verificar acesso do email:', error)
    return false
  }
}

// Função simples para login
export const signInWithEmail = async (email) => {
  if (!supabase) {
    console.warn('Supabase não configurado - modo demonstração')
    
    const hasAccess = await checkEmailAccess(email)
    
    if (!hasAccess) {
      throw new Error('Email não autorizado para acesso')
    }
    
    return { 
      data: { 
        user: { 
          id: 'demo-user-' + Date.now(), 
          email: email,
          created_at: new Date().toISOString()
        } 
      }, 
      error: null 
    }
  }
  
  try {
    const hasAccess = await checkEmailAccess(email)
    
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