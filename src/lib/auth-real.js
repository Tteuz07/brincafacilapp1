// Sistema de Autenticação REAL - SEM SUPABASE
// Apenas consulta direta na Kirvano

import { checkKirvanoPurchase } from './kirvano-real.js'

/**
 * Verificar status do usuário - APENAS KIRVANO
 */
export const getUserStatus = async (email) => {
  console.log('📊 VERIFICANDO STATUS REAL PARA:', email)
  
  try {
    // ÚNICA FONTE: API da Kirvano
    const result = await checkKirvanoPurchase(email)
    
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
        message: result.message || 'Nenhuma compra encontrada'
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
 * Login simples - SEM SUPABASE
 */
export const signInWithEmail = async (email) => {
  console.log('🔐 FAZENDO LOGIN REAL COM:', email)
  
  try {
    // Verificar se tem acesso via Kirvano
    const status = await getUserStatus(email)
    
    if (status.status !== 'approved') {
      throw new Error('Este email não possui compra confirmada na Kirvano')
    }
    
    // Criar sessão local simples
    const user = {
      id: 'user-' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10),
      email: email,
      created_at: new Date().toISOString(),
      purchase_data: status.purchase_data
    }
    
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
 * Verificar se usuário tem acesso - APENAS KIRVANO
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

