// Sistema de Autenticação usando Hotmart
// Consulta direta na API da Hotmart para verificar compras

import { checkPurchaseAccess } from './hotmart.js'

/**
 * Verificar status do usuário na Hotmart
 * @param {string} email - Email do cliente
 * @returns {Promise<object>} - Status do usuário
 */
export const getUserStatus = async (email) => {
  console.log('📊 VERIFICANDO STATUS NA HOTMART PARA:', email)
  
  try {
    // Consultar API da Hotmart
    const result = await checkPurchaseAccess(email)
    
    if (result.hasAccess) {
      return {
        status: 'approved',
        source: result.source,
        created_at: result.purchaseData?.purchase_date,
        purchase_data: result.purchaseData
      }
    } else {
      return {
        status: 'not_found',
        source: result.source,
        message: 'Nenhuma compra encontrada na Hotmart'
      }
    }
    
  } catch (error) {
    console.error('❌ ERRO AO VERIFICAR STATUS:', error)
    return {
      status: 'error',
      source: 'error',
      error: error.message
    }
  }
}

/**
 * Login com email usando Hotmart
 * @param {string} email - Email do cliente
 * @returns {Promise<{data: object, error: object}>}
 */
export const signInWithEmail = async (email) => {
  console.log('🔐 FAZENDO LOGIN COM HOTMART:', email)
  
  try {
    // Validar email
    if (!email || !email.includes('@')) {
      throw new Error('Email inválido')
    }

    // Verificar se tem acesso via Hotmart
    const status = await getUserStatus(email)
    
    if (status.status !== 'approved') {
      throw new Error('Este email não possui compra confirmada na Hotmart')
    }
    
    // Criar sessão local simples
    const user = {
      id: 'user-' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10),
      email: email,
      created_at: new Date().toISOString(),
      purchase_data: status.purchase_data,
      source: status.source
    }
    
    // Salvar sessão no localStorage
    localStorage.setItem('brincafacil-user', JSON.stringify(user))
    
    console.log('✅ LOGIN APROVADO:', user)
    
    return {
      data: {
        user: user,
        session: {
          access_token: 'local-token-' + Date.now(),
          user: user
        }
      },
      error: null
    }
    
  } catch (error) {
    console.error('❌ ERRO NO LOGIN:', error)
    return {
      data: null,
      error: error
    }
  }
}

/**
 * Verificar se usuário tem acesso
 * @param {string} email - Email do cliente
 * @returns {Promise<boolean>}
 */
export const checkUserAccess = async (email) => {
  try {
    const status = await getUserStatus(email)
    return status.status === 'approved'
  } catch (error) {
    console.error('❌ ERRO AO VERIFICAR ACESSO:', error)
    return false
  }
}

/**
 * Obter sessão atual do usuário
 * @returns {Promise<{data: {session: object}}>}
 */
export const getSession = async () => {
  try {
    const userStr = localStorage.getItem('brincafacil-user')
    if (!userStr) {
      return { data: { session: null } }
    }

    const user = JSON.parse(userStr)
    
    // Verificar se a sessão ainda é válida (verificar na Hotmart)
    const hasAccess = await checkUserAccess(user.email)
    
    if (!hasAccess) {
      // Sessão inválida, remover
      localStorage.removeItem('brincafacil-user')
      return { data: { session: null } }
    }

    return {
      data: {
        session: {
          user: user,
          access_token: 'local-token'
        }
      }
    }
  } catch (error) {
    console.error('❌ Erro ao obter sessão:', error)
    return { data: { session: null } }
  }
}

/**
 * Logout do usuário
 * @returns {Promise<{error: null}>}
 */
export const signOut = async () => {
  try {
    localStorage.removeItem('brincafacil-user')
    console.log('👋 Logout realizado')
    return { error: null }
  } catch (error) {
    console.error('❌ Erro ao fazer logout:', error)
    return { error: error }
  }
}

/**
 * Listener de mudanças de autenticação
 * @param {Function} callback - Função callback
 * @returns {{data: {subscription: {unsubscribe: Function}}}}
 */
export const onAuthStateChange = (callback) => {
  // Verificar sessão atual
  getSession().then(({ data }) => {
    callback('SIGNED_IN', data.session)
  })

  // Retornar um objeto de subscription
  return {
    data: {
      subscription: {
        unsubscribe: () => {
          console.log('👋 Unsubscribed de auth state changes')
        }
      }
    }
  }
}




