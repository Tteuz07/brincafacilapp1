// Cliente da API da Kirvano para verificação direta de compras
// Este arquivo implementa consulta direta sem necessidade de webhooks

// Configurações da API da Kirvano
const KIRVANO_API_URL = import.meta.env.VITE_KIRVANO_API_URL || 'https://api.kirvano.com'
const KIRVANO_API_KEY = import.meta.env.VITE_KIRVANO_API_KEY
const KIRVANO_PRODUCT_ID = import.meta.env.VITE_KIRVANO_PRODUCT_ID || 'brincafacil-premium'

// Cache local para evitar consultas desnecessárias
const CACHE_KEY = 'brincafacil-kirvano-cache'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 horas em millisegundos

/**
 * Verifica se um email tem compra aprovada na Kirvano
 * @param {string} email - Email do cliente
 * @returns {Promise<{hasAccess: boolean, purchaseData?: object, source: string}>}
 */
export const checkPurchaseAccess = async (email) => {
  console.log('🔍 Verificando acesso na Kirvano para:', email)
  
  try {
    // 1. Verificar cache local primeiro
    const cachedResult = getLocalPurchaseAccess(email)
    if (cachedResult) {
      console.log('💾 Usando cache local:', cachedResult)
      return cachedResult
    }

    // 2. Se não tem API key configurada, usar modo demo
    if (!KIRVANO_API_KEY || KIRVANO_API_KEY === '12345') {
      console.log('🔧 Modo demo - API key não configurada')
      return checkDemoAccess(email)
    }

    // 3. Consultar API da Kirvano diretamente
    console.log('📡 Consultando API da Kirvano...')
    const result = await queryKirvanoAPI(email)
    
    // 4. Salvar resultado no cache
    if (result.hasAccess) {
      saveLocalPurchaseAccess(email, result)
    }
    
    return result

  } catch (error) {
    console.error('❌ Erro ao verificar compra na Kirvano:', error)
    
    // Fallback: verificar cache ou modo demo
    const cachedResult = getLocalPurchaseAccess(email)
    if (cachedResult) {
      console.log('🔄 Usando cache como fallback')
      return cachedResult
    }
    
    console.log('🔄 Usando modo demo como fallback')
    return checkDemoAccess(email)
  }
}

/**
 * Consulta a API da Kirvano diretamente
 * @param {string} email - Email do cliente
 * @returns {Promise<{hasAccess: boolean, purchaseData?: object, source: string}>}
 */
const queryKirvanoAPI = async (email) => {
  const response = await fetch(`${KIRVANO_API_URL}/purchases/check`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${KIRVANO_API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      product_id: KIRVANO_PRODUCT_ID
    }),
    timeout: 10000 // 10 segundos de timeout
  })

  if (!response.ok) {
    throw new Error(`Erro na API da Kirvano: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  
  console.log('📊 Resposta da API Kirvano:', data)

  // Interpretar resposta da Kirvano
  const hasAccess = data.status === 'paid' || data.status === 'completed' || data.paid === true
  
  return {
    hasAccess,
    purchaseData: {
      email: email,
      status: data.status,
      purchase_id: data.purchase_id || data.id,
      amount: data.amount,
      currency: data.currency || 'BRL',
      purchase_date: data.created_at || data.purchase_date,
      product_id: KIRVANO_PRODUCT_ID,
      expires_at: data.expires_at
    },
    source: 'kirvano_api'
  }
}

/**
 * Modo demo para testes (quando API não está configurada)
 * @param {string} email - Email do cliente
 * @returns {{hasAccess: boolean, purchaseData?: object, source: string}}
 */
const checkDemoAccess = (email) => {
  const demoEmails = [
    'demo@brincafacil.com',
    'teste@exemplo.com', 
    'admin@brincafacil.com',
    'mateus@kirvano.com',
    'ericvalani@gmail.com' // Email do teste atual
  ]
  
  const hasAccess = demoEmails.includes(email.toLowerCase())
  
  if (hasAccess) {
    return {
      hasAccess: true,
      purchaseData: {
        email: email,
        status: 'paid',
        purchase_id: `demo-${Date.now()}`,
        amount: 29.90,
        currency: 'BRL',
        purchase_date: new Date().toISOString(),
        product_id: KIRVANO_PRODUCT_ID
      },
      source: 'demo'
    }
  }
  
  return {
    hasAccess: false,
    source: 'demo'
  }
}

/**
 * Salva resultado no cache local
 * @param {string} email - Email do cliente
 * @param {object} result - Resultado da verificação
 */
export const saveLocalPurchaseAccess = (email, result) => {
  try {
    const cache = getCache()
    cache[email.toLowerCase()] = {
      ...result,
      cached_at: Date.now()
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
    console.log('💾 Cache salvo para:', email)
  } catch (error) {
    console.warn('⚠️ Erro ao salvar cache:', error)
  }
}

/**
 * Recupera resultado do cache local
 * @param {string} email - Email do cliente
 * @returns {object|null} - Resultado em cache ou null
 */
export const getLocalPurchaseAccess = (email) => {
  try {
    const cache = getCache()
    const cached = cache[email.toLowerCase()]
    
    if (cached) {
      // Verificar se cache ainda é válido (24 horas)
      const isExpired = (Date.now() - cached.cached_at) > CACHE_DURATION
      
      if (!isExpired) {
        console.log('💾 Cache válido encontrado para:', email)
        return {
          hasAccess: cached.hasAccess,
          purchaseData: cached.purchaseData,
          source: `${cached.source}_cached`
        }
      } else {
        console.log('⏰ Cache expirado para:', email)
        // Remove cache expirado
        delete cache[email.toLowerCase()]
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
      }
    }
    
    return null
  } catch (error) {
    console.warn('⚠️ Erro ao ler cache:', error)
    return null
  }
}

/**
 * Limpa cache local
 * @param {string} email - Email específico ou undefined para limpar tudo
 */
export const clearLocalPurchaseAccess = (email = null) => {
  try {
    if (email) {
      const cache = getCache()
      delete cache[email.toLowerCase()]
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
      console.log('🗑️ Cache removido para:', email)
    } else {
      localStorage.removeItem(CACHE_KEY)
      console.log('🗑️ Todo cache removido')
    }
  } catch (error) {
    console.warn('⚠️ Erro ao limpar cache:', error)
  }
}

/**
 * Recupera cache do localStorage
 * @returns {object} - Objeto do cache
 */
const getCache = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    return cached ? JSON.parse(cached) : {}
  } catch (error) {
    console.warn('⚠️ Erro ao parsear cache:', error)
    return {}
  }
}

/**
 * Processa webhook da Kirvano (mantido para compatibilidade)
 * @param {object} webhookData - Dados do webhook
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const processPurchaseWebhook = async (webhookData) => {
  console.log('📡 Processando webhook da Kirvano:', webhookData)
  
  try {
    const email = webhookData.data?.email || webhookData.email
    const status = webhookData.data?.status || webhookData.status
    
    if (!email) {
      throw new Error('Email não encontrado no webhook')
    }
    
    // Limpar cache para forçar nova verificação
    clearLocalPurchaseAccess(email)
    
    // Se pagamento aprovado, salvar no cache
    if (status === 'completed' || status === 'paid') {
      const result = {
        hasAccess: true,
        purchaseData: {
          email: email,
          status: status,
          purchase_id: webhookData.data?.purchase_id || webhookData.purchase_id,
          amount: webhookData.data?.amount || webhookData.amount,
          currency: webhookData.data?.currency || 'BRL',
          purchase_date: webhookData.data?.created_at || new Date().toISOString(),
          product_id: KIRVANO_PRODUCT_ID
        },
        source: 'webhook'
      }
      
      saveLocalPurchaseAccess(email, result)
    }
    
    return {
      success: true,
      message: 'Webhook processado com sucesso'
    }
    
  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error)
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * Verifica configuração da API da Kirvano
 * @returns {{configured: boolean, api_url: string, has_api_key: boolean, product_id: string}}
 */
export const checkKirvanoConfig = () => {
  return {
    configured: !!(KIRVANO_API_KEY && KIRVANO_API_KEY !== '12345'),
    api_url: KIRVANO_API_URL,
    has_api_key: !!(KIRVANO_API_KEY && KIRVANO_API_KEY !== '12345'),
    product_id: KIRVANO_PRODUCT_ID,
    mode: (KIRVANO_API_KEY && KIRVANO_API_KEY !== '12345') ? 'production' : 'demo'
  }
}

// Log da configuração ao carregar
console.log('🔧 Configuração da Kirvano:', checkKirvanoConfig())

