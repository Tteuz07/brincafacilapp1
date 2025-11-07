// Sistema de autenticação simplificado usando apenas localStorage
// Sem dependência do Supabase

// Lista de emails autorizados (pode ser modificada conforme necessário)
const getAuthorizedEmails = () => {
  const stored = localStorage.getItem('brincafacil-authorized-emails')
  if (stored) {
    return JSON.parse(stored)
  }
  // Emails padrão de teste
  return ['teste@exemplo.com', 'admin@brincafacil.com']
}

// Função para verificar se usuário tem acesso aprovado
export const checkUserAccess = async (email) => {
  try {
    console.log('🔍 VERIFICANDO ACESSO PARA:', email)
    
    const authorizedEmails = getAuthorizedEmails()
    const hasAccess = authorizedEmails.includes(email.toLowerCase())
    
    console.log('✅ ACESSO VERIFICADO:', hasAccess)
    return hasAccess
  } catch (error) {
    console.error('❌ ERRO AO VERIFICAR ACESSO:', error)
    return false
  }
}

// Função para verificar status do usuário (approved/pending)
export const getUserStatus = async (email) => {
  try {
    console.log('📊 VERIFICANDO STATUS PARA:', email)
    
    // 1. PRIORIDADE: Consulta direta na API da Kirvano (se configurado)
    console.log('🔍 Consultando Kirvano diretamente...')
    try {
      const { checkPurchaseAccess } = await import('./kirvano.js')
      const kirvanoResult = await checkPurchaseAccess(email)
      
      if (kirvanoResult.hasAccess) {
        console.log('✅ ACESSO APROVADO VIA KIRVANO:', kirvanoResult)
        return {
          status: 'approved',
          source: kirvanoResult.source,
          created_at: kirvanoResult.purchaseData?.purchase_date,
          purchase_data: kirvanoResult.purchaseData
        }
      } else {
        console.log('❌ SEM ACESSO NA KIRVANO:', kirvanoResult)
      }
    } catch (kirvanoError) {
      console.warn('⚠️ Erro ao consultar Kirvano:', kirvanoError)
    }
    
    // 2. Verificar emails autorizados localmente
    const authorizedEmails = getAuthorizedEmails()
    const isAuthorized = authorizedEmails.includes(email.toLowerCase())
    
    const result = isAuthorized 
      ? { 
          status: 'approved', 
          source: 'authorized_emails',
          created_at: new Date().toISOString()
        } 
      : { 
          status: 'not_found', 
          source: 'not_found' 
        }
    
    console.log('✅ STATUS VIA EMAILS AUTORIZADOS:', result)
    return result
    
  } catch (error) {
    console.error('❌ ERRO AO VERIFICAR STATUS:', error)
    return { status: 'error', source: 'error', error: error.message }
  }
}

// Função simples para login (sem Supabase)
export const signInWithEmail = async (email) => {
  try {
    console.warn('Usando sistema de autenticação local (sem Supabase)')
    
    const hasAccess = await checkUserAccess(email)
    
    if (!hasAccess) {
      throw new Error('Email não autorizado para acesso')
    }
    
    const user = { 
      id: 'user-' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10),
      email: email,
      created_at: new Date().toISOString()
    }
    
    return { 
      data: { 
        user: user,
        session: {
          access_token: 'local-token',
          refresh_token: 'local-refresh',
          expires_in: 3600,
          user: user
        }
      }, 
      error: null 
    }
  } catch (error) {
    return { data: null, error }
  }
}

// Exportar null para manter compatibilidade com código existente
export const supabase = null

export default supabase
