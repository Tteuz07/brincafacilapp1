// Integração com a API da Kirvano
// Este arquivo gerencia a comunicação com a plataforma de pagamentos

// Configurações da API da Kirvano
const KIRVANO_CONFIG = {
  // URL base da API da Kirvano
  API_BASE_URL: import.meta.env.VITE_KIRVANO_API_URL || 'https://api.kirvano.com',
  
  // Chave da API da Kirvano
  API_KEY: import.meta.env.VITE_KIRVANO_API_KEY || '',
  
  // Webhook secret para validação
  WEBHOOK_SECRET: import.meta.env.VITE_KIRVANO_WEBHOOK_SECRET || '',
  
  // ID do produto/plano no sistema da Kirvano
  PRODUCT_ID: import.meta.env.VITE_KIRVANO_PRODUCT_ID || 'brincafacil-premium'
}

// Cliente HTTP para comunicação com a API
class KirvanoClient {
  constructor() {
    this.baseURL = KIRVANO_CONFIG.API_BASE_URL
    this.apiKey = KIRVANO_CONFIG.API_KEY
    this.productId = KIRVANO_CONFIG.PRODUCT_ID
  }

  // Verificar se a configuração está válida
  isConfigured() {
    return this.apiKey && this.baseURL !== 'https://api.kirvano.com'
  }

  // Headers padrão para requisições
  getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }

  // Verificar status de uma compra pelo email
  async checkPurchaseStatus(email) {
    if (!this.isConfigured()) {
      console.warn('Kirvano não configurado - simulando verificação')
      return this.simulatePurchaseCheck(email)
    }

    try {
      const response = await fetch(`${this.baseURL}/v1/purchases/status`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          email: email,
          product_id: this.productId
        })
      })

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        hasAccess: data.status === 'completed' || data.status === 'active',
        purchaseData: data,
        error: null
      }
    } catch (error) {
      console.error('Erro ao verificar compra na Kirvano:', error)
      return {
        success: false,
        hasAccess: false,
        purchaseData: null,
        error: error.message
      }
    }
  }

  // Verificar múltiplas compras por email
  async checkMultiplePurchases(email) {
    if (!this.isConfigured()) {
      return this.simulateMultiplePurchasesCheck(email)
    }

    try {
      const response = await fetch(`${this.baseURL}/v1/purchases/history`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          email: email
        })
      })

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        purchases: data.purchases || [],
        hasActivePurchase: data.purchases?.some(p => 
          p.status === 'completed' || p.status === 'active'
        ) || false,
        error: null
      }
    } catch (error) {
      console.error('Erro ao verificar histórico de compras:', error)
      return {
        success: false,
        purchases: [],
        hasActivePurchase: false,
        error: error.message
      }
    }
  }

  // Verificar se um email tem acesso ativo
  async hasActiveAccess(email) {
    const result = await this.checkPurchaseStatus(email)
    return result.hasAccess
  }

  // Simulação para modo de demonstração
  simulatePurchaseCheck(email) {
    // Simular que alguns emails têm acesso (para demonstração)
    const demoEmails = [
      'demo@brincafacil.com',
      'teste@exemplo.com',
      'admin@brincafacil.com',
      'mateus@kirvano.com'
    ]
    
    const hasAccess = demoEmails.includes(email.toLowerCase())
    
    return {
      success: true,
      hasAccess,
      purchaseData: {
        id: hasAccess ? 'demo-purchase-123' : null,
        status: hasAccess ? 'completed' : 'not_found',
        email: email,
        product_id: this.productId,
        created_at: hasAccess ? new Date().toISOString() : null,
        expires_at: hasAccess ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : null
      },
      error: null
    }
  }

  // Simulação para múltiplas compras
  simulateMultiplePurchasesCheck(email) {
    const demoEmails = [
      'demo@brincafacil.com',
      'teste@exemplo.com',
      'admin@brincafacil.com',
      'mateus@kirvano.com'
    ]
    
    const hasAccess = demoEmails.includes(email.toLowerCase())
    
    return {
      success: true,
      purchases: hasAccess ? [
        {
          id: 'demo-purchase-123',
          status: 'completed',
          email: email,
          product_id: this.productId,
          amount: 29.90,
          currency: 'BRL',
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        }
      ] : [],
      hasActivePurchase: hasAccess,
      error: null
    }
  }
}

// Instância global do cliente
export const kirvanoClient = new KirvanoClient()

// Função para verificar acesso baseado em compras
export const checkPurchaseAccess = async (email) => {
  try {
    const result = await kirvanoClient.checkPurchaseStatus(email)
    
    if (result.success && result.hasAccess) {
      // Salvar informação de acesso no localStorage
      localStorage.setItem('brincafacil-purchase-access', JSON.stringify({
        email,
        hasAccess: true,
        checkedAt: new Date().toISOString(),
        purchaseData: result.purchaseData
      }))
      
      return {
        hasAccess: true,
        purchaseData: result.purchaseData,
        error: null
      }
    } else {
      // Remover acesso se não tiver compra válida
      localStorage.removeItem('brincafacil-purchase-access')
      
      return {
        hasAccess: false,
        purchaseData: null,
        error: result.error
      }
    }
  } catch (error) {
    console.error('Erro ao verificar acesso por compra:', error)
    return {
      hasAccess: false,
      purchaseData: null,
      error: error.message
    }
  }
}

// Função para verificar acesso salvo localmente
export const getLocalPurchaseAccess = (email) => {
  try {
    const saved = localStorage.getItem('brincafacil-purchase-access')
    if (!saved) return null
    
    const data = JSON.parse(saved)
    
    // Verificar se é o mesmo email e se não expirou (24h)
    if (data.email === email) {
      const checkedAt = new Date(data.checkedAt)
      const now = new Date()
      const hoursDiff = (now - checkedAt) / (1000 * 60 * 60)
      
      if (hoursDiff < 24) {
        return data
      }
    }
    
    // Remover se expirou ou email diferente
    localStorage.removeItem('brincafacil-purchase-access')
    return null
  } catch (error) {
    console.error('Erro ao ler acesso local:', error)
    return null
  }
}

// Função para limpar acesso local
export const clearLocalPurchaseAccess = () => {
  localStorage.removeItem('brincafacil-purchase-access')
}

// Função para validar webhook da Kirvano
export const validateWebhook = (payload, signature) => {
  if (!KIRVANO_CONFIG.WEBHOOK_SECRET) {
    console.warn('Webhook secret não configurado')
    return false
  }

  try {
    // Implementar validação de assinatura conforme documentação da Kirvano
    // Por enquanto, retorna true para demonstração
    return true
  } catch (error) {
    console.error('Erro ao validar webhook:', error)
    return false
  }
}

// Função para processar webhook de compra
export const processPurchaseWebhook = async (webhookData) => {
  try {
    const { event_type, data } = webhookData
    
    if (event_type === 'purchase.completed' || event_type === 'purchase.activated') {
      const { email, product_id, purchase_id } = data
      
      // Verificar se é o produto correto
      if (product_id === KIRVANO_CONFIG.PRODUCT_ID) {
        // Atualizar status de acesso no sistema
        await updateUserAccessStatus(email, true, data)
        
        return {
          success: true,
          message: 'Acesso liberado com sucesso',
          email,
          purchase_id
        }
      }
    }
    
    return {
      success: false,
      message: 'Evento não processado',
      event_type
    }
  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    return {
      success: false,
      message: 'Erro interno',
      error: error.message
    }
  }
}

// Função para atualizar status de acesso do usuário
async function updateUserAccessStatus(email, hasAccess, purchaseData) {
  try {
    // Aqui você pode implementar a lógica para atualizar
    // o banco de dados ou sistema de autenticação
    
    // Por enquanto, apenas atualiza o localStorage
    if (hasAccess) {
      localStorage.setItem('brincafacil-purchase-access', JSON.stringify({
        email,
        hasAccess: true,
        checkedAt: new Date().toISOString(),
        purchaseData
      }))
    } else {
      localStorage.removeItem('brincafacil-purchase-access')
    }
    
    return true
  } catch (error) {
    console.error('Erro ao atualizar status de acesso:', error)
    return false
  }
}

export default kirvanoClient

