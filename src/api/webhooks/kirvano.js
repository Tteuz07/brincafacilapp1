// Webhook endpoint para receber notificações da Kirvano
// Este arquivo deve ser servido como uma API route

import { processPurchaseWebhook, validateWebhook } from '../../lib/kirvano.js'

// Função para processar webhook da Kirvano
export async function handleKirvanoWebhook(req, res) {
  try {
    // Verificar método HTTP
    if (req.method !== 'POST') {
      return res.status(405).json({ 
        error: 'Método não permitido',
        allowed: ['POST']
      })
    }

    // Extrair dados do webhook
    const { body, headers } = req
    
    // Verificar se é um webhook válido da Kirvano
    const signature = headers['x-kirvano-signature'] || headers['x-webhook-signature']
    
    if (!signature) {
      console.warn('Webhook sem assinatura recebido')
      return res.status(400).json({ 
        error: 'Assinatura do webhook não fornecida' 
      })
    }

    // Validar assinatura do webhook
    const isValid = validateWebhook(JSON.stringify(body), signature)
    
    if (!isValid) {
      console.warn('Webhook com assinatura inválida recebido')
      return res.status(401).json({ 
        error: 'Assinatura do webhook inválida' 
      })
    }

    // Processar o webhook
    const result = await processPurchaseWebhook(body)
    
    if (result.success) {
      console.log('Webhook processado com sucesso:', result)
      
      // Retornar sucesso
      return res.status(200).json({
        success: true,
        message: result.message,
        data: {
          email: result.email,
          purchase_id: result.purchase_id,
          processed_at: new Date().toISOString()
        }
      })
    } else {
      console.log('Webhook não processado:', result)
      
      // Retornar que foi recebido mas não processado
      return res.status(200).json({
        success: false,
        message: result.message,
        event_type: result.event_type,
        received_at: new Date().toISOString()
      })
    }

  } catch (error) {
    console.error('Erro ao processar webhook da Kirvano:', error)
    
    // Retornar erro interno
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message,
      timestamp: new Date().toISOString()
    })
  }
}

// Função para testar o webhook (desenvolvimento)
export async function testKirvanoWebhook(req, res) {
  try {
    // Simular dados de webhook para teste
    const testWebhookData = {
      event_type: 'purchase.completed',
      data: {
        email: 'teste@exemplo.com',
        product_id: 'brincafacil-premium',
        purchase_id: 'test-purchase-123',
        amount: 29.90,
        currency: 'BRL',
        status: 'completed',
        created_at: new Date().toISOString()
      }
    }

    // Processar webhook de teste
    const result = await processPurchaseWebhook(testWebhookData)
    
    return res.status(200).json({
      success: true,
      message: 'Webhook de teste processado',
      test_data: testWebhookData,
      result: result
    })

  } catch (error) {
    console.error('Erro ao testar webhook:', error)
    
    return res.status(500).json({
      error: 'Erro ao testar webhook',
      message: error.message
    })
  }
}

// Função para verificar status de um email específico
export async function checkEmailStatus(req, res) {
  try {
    const { email } = req.query
    
    if (!email) {
      return res.status(400).json({
        error: 'Email não fornecido',
        usage: 'GET /api/webhooks/kirvano/check?email=exemplo@email.com'
      })
    }

    // Importar função de verificação
    const { checkPurchaseAccess } = await import('../../lib/kirvano.js')
    
    // Verificar status do email
    const result = await checkPurchaseAccess(email)
    
    return res.status(200).json({
      success: true,
      email: email,
      has_access: result.hasAccess,
      purchase_data: result.purchaseData,
      checked_at: new Date().toISOString()
    })

  } catch (error) {
    console.error('Erro ao verificar status do email:', error)
    
    return res.status(500).json({
      error: 'Erro ao verificar status',
      message: error.message
    })
  }
}

// Função para listar todos os acessos ativos (desenvolvimento)
export async function listActiveAccesses(req, res) {
  try {
    // Esta função seria implementada para listar todos os usuários
    // com acesso ativo baseado em compras da Kirvano
    
    // Por enquanto, retorna uma mensagem informativa
    return res.status(200).json({
      success: true,
      message: 'Funcionalidade de listagem em desenvolvimento',
      note: 'Esta função listará todos os usuários com acesso ativo via Kirvano',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Erro ao listar acessos ativos:', error)
    
    return res.status(500).json({
      error: 'Erro ao listar acessos',
      message: error.message
    })
  }
}

// Exportar todas as funções
export default {
  handleKirvanoWebhook,
  testKirvanoWebhook,
  checkEmailStatus,
  listActiveAccesses
}

