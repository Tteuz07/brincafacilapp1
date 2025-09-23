import { createClient } from '@supabase/supabase-js'
import { checkPurchaseAccess, getLocalPurchaseAccess } from './kirvano.js'

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

// Verificar se o email tem acesso baseado em compras da Kirvano
export const checkEmailAccess = async (email) => {
  try {
    // Primeiro verificar se tem acesso por compras da Kirvano
    const kirvanoAccess = await checkPurchaseAccessByKirvano(email)
    if (kirvanoAccess) {
      return true
    }
    
    // Se não tiver acesso por compras, verificar na tabela de emails autorizados (apenas se Supabase estiver configurado)
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
    
    // Se não tiver Supabase configurado, apenas verificar Kirvano
    return false
  } catch (error) {
    console.error('Erro ao verificar acesso do email:', error)
    return false
  }
}

// Verificar acesso baseado em compras da Kirvano
async function checkPurchaseAccessByKirvano(email) {
  try {
    // Primeiro verificar se já temos informação local válida
    const localAccess = getLocalPurchaseAccess(email)
    if (localAccess && localAccess.hasAccess) {
      console.log('Acesso confirmado localmente para:', email)
      return true
    }
    
    // Se não tiver informação local válida, verificar na API da Kirvano
    const result = await checkPurchaseAccess(email)
    
    if (result.hasAccess) {
      console.log('Acesso confirmado via Kirvano para:', email)
      return true
    }
    
    console.log('Email sem acesso confirmado:', email)
    return false
  } catch (error) {
    console.error('Erro ao verificar acesso via Kirvano:', error)
    return false
  }
}

// Função para login direto sem email
export const signInWithEmail = async (email) => {
  if (!supabase) {
    console.warn('Supabase não configurado - simulando login para demonstração')
    
    // Verificar se o email tem acesso mesmo em modo demo
    const hasAccess = await checkEmailAccess(email)
    
    if (!hasAccess) {
      throw new Error('Email não autorizado para acesso')
    }
    
    // Simular um usuário logado para demonstração
    return { 
      data: { 
        user: { 
          id: 'demo-user-' + Date.now(), 
          email: email,
          created_at: new Date().toISOString(),
          access_type: 'demo'
        } 
      }, 
      error: null 
    }
  }
  
  try {
    // Primeiro verifica se o email tem acesso
    const hasAccess = await checkEmailAccess(email)
    
    if (!hasAccess) {
      throw new Error('Email não autorizado para acesso')
    }
    
    // Verificar se o acesso é via compra da Kirvano
    const localAccess = getLocalPurchaseAccess(email)
    const accessType = localAccess ? 'purchase' : 'authorized'
    
    // Login direto sem envio de email - criar sessão diretamente
    // Simular um usuário autenticado para emails autorizados
    const simulatedUser = {
      id: 'user-' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10),
      email: email,
      created_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(),
      app_metadata: {
        access_type: accessType,
        purchase_data: localAccess?.purchaseData || null
      },
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
