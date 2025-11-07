// Cliente da API da Hotmart para verificação direta de compras
// Este arquivo implementa consulta direta sem necessidade de webhooks

// Configurações da API da Hotmart
const HOTMART_API_URL = import.meta.env.VITE_HOTMART_API_URL || 'https://developers.hotmart.com/payments/api/v1'
const HOTMART_CLIENT_ID = import.meta.env.VITE_HOTMART_CLIENT_ID
const HOTMART_CLIENT_SECRET = import.meta.env.VITE_HOTMART_CLIENT_SECRET
const HOTMART_BASIC_AUTH = import.meta.env.VITE_HOTMART_BASIC_AUTH // Base64 de CLIENT_ID:CLIENT_SECRET
const HOTMART_PRODUCT_ID = import.meta.env.VITE_HOTMART_PRODUCT_ID || 'brincafacil-premium'

// Cache local para evitar consultas desnecessárias
const CACHE_KEY = 'brincafacil-hotmart-cache'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 horas em millisegundos
const TOKEN_CACHE_KEY = 'brincafacil-hotmart-token'

/**
 * Obtém token de acesso da Hotmart
 * @returns {Promise<string>} - Token de acesso
 */
const getAccessToken = async () => {
  try {
    // Verificar cache do token
    const cachedToken = sessionStorage.getItem(TOKEN_CACHE_KEY)
    if (cachedToken) {
      const tokenData = JSON.parse(cachedToken)
      const isExpired = Date.now() >= tokenData.expires_at
      if (!isExpired) {
        console.log('🔑 Usando token em cache')
        return tokenData.access_token
      }
    }

    console.log('🔑 Solicitando novo token de acesso...')
    
    // Solicitar novo token
    const response = await fetch('https://api-sec-vlc.hotmart.com/security/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${HOTMART_BASIC_AUTH}`
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: HOTMART_CLIENT_ID,
        client_secret: HOTMART_CLIENT_SECRET
      })
    })

    if (!response.ok) {
      throw new Error(`Erro ao obter token: ${response.status}`)
    }

    const data = await response.json()
    
    // Salvar token no cache com tempo de expiração
    const tokenData = {
      access_token: data.access_token,
      expires_at: Date.now() + (data.expires_in * 1000) - 60000 // 1 minuto antes de expirar
    }
    sessionStorage.setItem(TOKEN_CACHE_KEY, JSON.stringify(tokenData))
    
    console.log('✅ Token obtido com sucesso')
    return data.access_token

  } catch (error) {
    console.error('❌ Erro ao obter token:', error)
    throw error
  }
}

/**
 * Verifica se um email tem compra aprovada na Hotmart
 * @param {string} email - Email do cliente
 * @returns {Promise<{hasAccess: boolean, purchaseData?: object, source: string}>}
 */
export const checkPurchaseAccess = async (email) => {
  console.log('🔍 Verificando acesso na Hotmart para:', email)
  
  try {
    // 1. Verificar cache local primeiro
    const cachedResult = getLocalPurchaseAccess(email)
    if (cachedResult) {
      console.log('💾 Usando cache local:', cachedResult)
      return cachedResult
    }

    // 2. Se não tem credenciais configuradas, usar modo demo
    if (!HOTMART_CLIENT_ID || !HOTMART_CLIENT_SECRET || !HOTMART_BASIC_AUTH) {
      console.log('🔧 Modo demo - Credenciais da Hotmart não configuradas')
      return checkDemoAccess(email)
    }

    // 3. Consultar API da Hotmart diretamente
    console.log('📡 Consultando API da Hotmart...')
    const result = await queryHotmartAPI(email)
    
    // 4. Salvar resultado no cache
    if (result.hasAccess) {
      saveLocalPurchaseAccess(email, result)
    }
    
    return result

  } catch (error) {
    console.error('❌ Erro ao verificar compra na Hotmart:', error)
    
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
 * Consulta a API da Hotmart diretamente
 * @param {string} email - Email do cliente
 * @returns {Promise<{hasAccess: boolean, purchaseData?: object, source: string}>}
 */
const queryHotmartAPI = async (email) => {
  try {
    // Obter token de acesso
    const token = await getAccessToken()

    // Buscar transações por email
    const url = new URL(`${HOTMART_API_URL}/subscriptions/summary`)
    url.searchParams.append('subscriber_email', email)
    if (HOTMART_PRODUCT_ID) {
      url.searchParams.append('product_id', HOTMART_PRODUCT_ID)
    }

    console.log('📡 URL de consulta:', url.toString())

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Erro na API da Hotmart:', response.status, errorText)
      throw new Error(`Erro na API da Hotmart: ${response.status}`)
    }

    const data = await response.json()
    
    console.log('📊 Resposta da API Hotmart:', data)

    // Verificar se há assinaturas ativas ou compras aprovadas
    let hasAccess = false
    let purchaseData = null

    if (data.items && data.items.length > 0) {
      // Procurar por transações aprovadas/ativas
      const activePurchase = data.items.find(item => 
        item.status === 'ACTIVE' || 
        item.status === 'APPROVED' ||
        item.status === 'COMPLETE' ||
        item.subscription_status === 'ACTIVE'
      )

      if (activePurchase) {
        hasAccess = true
        purchaseData = {
          email: email,
          status: activePurchase.status || activePurchase.subscription_status,
          purchase_id: activePurchase.purchase?.transaction || activePurchase.subscription_id,
          amount: activePurchase.purchase?.price?.value || activePurchase.subscription?.price,
          currency: activePurchase.purchase?.price?.currency_code || 'BRL',
          purchase_date: activePurchase.purchase?.approved_date || activePurchase.subscription?.date_created,
          product_id: activePurchase.product?.id || HOTMART_PRODUCT_ID,
          product_name: activePurchase.product?.name,
          customer_name: activePurchase.buyer?.name,
          expires_at: activePurchase.subscription?.date_next_charge
        }
      }
    }

    if (!hasAccess) {
      // Tentar buscar por histórico de vendas
      const salesUrl = new URL('https://developers.hotmart.com/payments/api/v1/sales/history')
      salesUrl.searchParams.append('buyer_email', email)
      if (HOTMART_PRODUCT_ID) {
        salesUrl.searchParams.append('product_id', HOTMART_PRODUCT_ID)
      }
      salesUrl.searchParams.append('transaction_status', 'APPROVED')

      const salesResponse = await fetch(salesUrl.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (salesResponse.ok) {
        const salesData = await salesResponse.json()
        console.log('📊 Histórico de vendas:', salesData)

        if (salesData.items && salesData.items.length > 0) {
          const approvedSale = salesData.items[0]
          hasAccess = true
          purchaseData = {
            email: email,
            status: approvedSale.status,
            purchase_id: approvedSale.transaction,
            amount: approvedSale.purchase?.price?.value,
            currency: approvedSale.purchase?.price?.currency_code || 'BRL',
            purchase_date: approvedSale.purchase?.approved_date,
            product_id: approvedSale.product?.id || HOTMART_PRODUCT_ID,
            product_name: approvedSale.product?.name,
            customer_name: approvedSale.buyer?.name
          }
        }
      }
    }
  
    return {
      hasAccess,
      purchaseData,
      source: 'hotmart_api'
    }

  } catch (error) {
    console.error('❌ Erro ao consultar Hotmart:', error)
    throw error
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
    'ericvalani@gmail.com'
  ]
  
  const hasAccess = demoEmails.includes(email.toLowerCase())
  
  if (hasAccess) {
    return {
      hasAccess: true,
      purchaseData: {
        email: email,
        status: 'APPROVED',
        purchase_id: `demo-${Date.now()}`,
        amount: 29.90,
        currency: 'BRL',
        purchase_date: new Date().toISOString(),
        product_id: HOTMART_PRODUCT_ID,
        product_name: 'BrincaFácil Premium (Demo)'
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
      sessionStorage.removeItem(TOKEN_CACHE_KEY)
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
 * Processa webhook da Hotmart (mantido para compatibilidade)
 * @param {object} webhookData - Dados do webhook
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const processPurchaseWebhook = async (webhookData) => {
  console.log('📡 Processando webhook da Hotmart:', webhookData)
  
  try {
    const email = webhookData.data?.buyer?.email || webhookData.buyer?.email
    const status = webhookData.data?.status || webhookData.status
    
    if (!email) {
      throw new Error('Email não encontrado no webhook')
    }
    
    // Limpar cache para forçar nova verificação
    clearLocalPurchaseAccess(email)
    
    // Se pagamento aprovado, salvar no cache
    if (status === 'APPROVED' || status === 'COMPLETE' || status === 'ACTIVE') {
      const result = {
        hasAccess: true,
        purchaseData: {
          email: email,
          status: status,
          purchase_id: webhookData.data?.purchase?.transaction || webhookData.transaction,
          amount: webhookData.data?.purchase?.price?.value || webhookData.purchase?.price?.value,
          currency: webhookData.data?.purchase?.price?.currency_code || 'BRL',
          purchase_date: webhookData.data?.purchase?.approved_date || new Date().toISOString(),
          product_id: webhookData.data?.product?.id || HOTMART_PRODUCT_ID,
          product_name: webhookData.data?.product?.name,
          customer_name: webhookData.data?.buyer?.name || webhookData.buyer?.name
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
 * Verifica configuração da API da Hotmart
 * @returns {{configured: boolean, has_credentials: boolean, product_id: string}}
 */
export const checkHotmartConfig = () => {
  const hasCredentials = !!(HOTMART_CLIENT_ID && HOTMART_CLIENT_SECRET && HOTMART_BASIC_AUTH)
  
  return {
    configured: hasCredentials,
    has_credentials: hasCredentials,
    product_id: HOTMART_PRODUCT_ID,
    mode: hasCredentials ? 'production' : 'demo'
  }
}

// Log da configuração ao carregar
console.log('🔧 Configuração da Hotmart:', checkHotmartConfig())


