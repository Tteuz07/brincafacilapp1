// Cliente REAL da API da Kirvano - SEM SUPABASE, SEM WEBHOOK, SEM DEMO
// Apenas consulta direta na API da Kirvano

// CONFIGURAÇÃO REAL DA KIRVANO
const KIRVANO_CONFIG = {
  // Você precisa pegar essas informações no painel da Kirvano
  API_URL: 'https://api.kirvano.com/v1',
  API_KEY: 'SUA_CHAVE_API_REAL_AQUI', // Pegar no painel da Kirvano
  PRODUCT_ID: 'brincafacil-premium', // ID do seu produto na Kirvano
  
  // Endpoints da API da Kirvano
  ENDPOINTS: {
    CHECK_PURCHASE: '/purchases/check',
    GET_CUSTOMER: '/customers/by-email',
    VERIFY_PAYMENT: '/payments/verify'
  }
}

/**
 * Verifica se um email tem compra aprovada na Kirvano
 * CONSULTA DIRETA - SEM CACHE, SEM FALLBACK, SEM DEMO
 */
export const checkKirvanoPurchase = async (email) => {
  console.log('🔍 VERIFICANDO COMPRA REAL NA KIRVANO:', email)
  
  if (!email || !email.includes('@')) {
    throw new Error('Email inválido')
  }

  // Verificar se API key está configurada
  if (!KIRVANO_CONFIG.API_KEY || KIRVANO_CONFIG.API_KEY === 'SUA_CHAVE_API_REAL_AQUI') {
    throw new Error('API Key da Kirvano não configurada. Configure em src/lib/kirvano-real.js')
  }

  try {
    console.log('📡 Consultando API da Kirvano...')
    
    // Consulta direta na API da Kirvano
    const response = await fetch(`${KIRVANO_CONFIG.API_URL}${KIRVANO_CONFIG.ENDPOINTS.CHECK_PURCHASE}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KIRVANO_CONFIG.API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        product_id: KIRVANO_CONFIG.PRODUCT_ID
      })
    })

    console.log('📊 Status da resposta:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Erro na API da Kirvano:', response.status, errorText)
      throw new Error(`Erro na API da Kirvano: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('📋 Resposta da Kirvano:', data)

    // Verificar se tem compra aprovada
    const hasValidPurchase = data.status === 'paid' || 
                            data.status === 'completed' || 
                            data.status === 'approved' ||
                            data.paid === true ||
                            data.active === true

    if (hasValidPurchase) {
      console.log('✅ COMPRA CONFIRMADA NA KIRVANO!')
      return {
        hasAccess: true,
        purchaseData: {
          email: email,
          status: data.status,
          purchase_id: data.purchase_id || data.id || data.transaction_id,
          amount: data.amount || data.price,
          currency: data.currency || 'BRL',
          purchase_date: data.created_at || data.purchase_date || data.date,
          product_id: KIRVANO_CONFIG.PRODUCT_ID,
          customer_name: data.customer_name || data.name,
          expires_at: data.expires_at
        },
        source: 'kirvano_api_real'
      }
    } else {
      console.log('❌ SEM COMPRA CONFIRMADA NA KIRVANO')
      return {
        hasAccess: false,
        source: 'kirvano_api_real',
        message: 'Nenhuma compra encontrada para este email'
      }
    }

  } catch (error) {
    console.error('❌ ERRO AO CONSULTAR KIRVANO:', error)
    throw error
  }
}

/**
 * Configurar API Key da Kirvano
 */
export const setKirvanoApiKey = (apiKey) => {
  KIRVANO_CONFIG.API_KEY = apiKey
  console.log('🔑 API Key da Kirvano configurada')
}

/**
 * Configurar Product ID
 */
export const setKirvanoProductId = (productId) => {
  KIRVANO_CONFIG.PRODUCT_ID = productId
  console.log('📦 Product ID configurado:', productId)
}

/**
 * Verificar configuração
 */
export const checkKirvanoConfig = () => {
  const isConfigured = KIRVANO_CONFIG.API_KEY && 
                      KIRVANO_CONFIG.API_KEY !== 'SUA_CHAVE_API_REAL_AQUI' &&
                      KIRVANO_CONFIG.PRODUCT_ID

  return {
    configured: isConfigured,
    api_url: KIRVANO_CONFIG.API_URL,
    has_api_key: !!(KIRVANO_CONFIG.API_KEY && KIRVANO_CONFIG.API_KEY !== 'SUA_CHAVE_API_REAL_AQUI'),
    product_id: KIRVANO_CONFIG.PRODUCT_ID,
    status: isConfigured ? 'READY' : 'NEEDS_CONFIGURATION'
  }
}

/**
 * Testar conexão com a API da Kirvano
 */
export const testKirvanoConnection = async () => {
  try {
    const response = await fetch(`${KIRVANO_CONFIG.API_URL}/health`, {
      headers: {
        'Authorization': `Bearer ${KIRVANO_CONFIG.API_KEY}`
      }
    })
    
    return {
      success: response.ok,
      status: response.status,
      message: response.ok ? 'Conexão OK' : 'Erro na conexão'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Log da configuração
console.log('🔧 Kirvano Real Config:', checkKirvanoConfig())

