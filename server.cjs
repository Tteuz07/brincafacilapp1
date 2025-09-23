const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

// Importar funções de webhook da Kirvano
const { 
  handleKirvanoWebhook, 
  testKirvanoWebhook, 
  checkEmailStatus, 
  listActiveAccesses 
} = require('./src/api/webhooks/kirvano.js')

// Importar APIs do sistema
const usersAPI = require('./src/api/users.js')
const childrenAPI = require('./src/api/children.js')
const activitiesAPI = require('./src/api/activities.js')
const analyticsAPI = require('./src/api/analytics.js')

// Rotas da API
app.post('/api/webhooks/kirvano', handleKirvanoWebhook)
app.get('/api/webhooks/kirvano/test', testKirvanoWebhook)
app.get('/api/webhooks/kirvano/check', checkEmailStatus)
app.get('/api/webhooks/kirvano/list', listActiveAccesses)

// Rota para verificar status de um email específico
app.get('/api/kirvano/status/:email', async (req, res) => {
  try {
    const { email } = req.params
    
    // Importar função de verificação
    const { checkPurchaseAccess } = require('./src/lib/kirvano.js')
    
    // Verificar status do email
    const result = await checkPurchaseAccess(email)
    
    res.json({
      success: true,
      email: email,
      has_access: result.hasAccess,
      purchase_data: result.purchaseData,
      checked_at: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Erro ao verificar status do email:', error)
    
    res.status(500).json({
      error: 'Erro ao verificar status',
      message: error.message
    })
  }
})

// Rota para simular webhook da Kirvano (desenvolvimento)
app.post('/api/kirvano/simulate-webhook', async (req, res) => {
  try {
    const { email, product_id, purchase_id, amount } = req.body
    
    if (!email || !product_id) {
      return res.status(400).json({
        error: 'Email e product_id são obrigatórios'
      })
    }
    
    // Simular dados de webhook
    const webhookData = {
      event_type: 'purchase.completed',
      data: {
        email: email,
        product_id: product_id,
        purchase_id: purchase_id || `sim-${Date.now()}`,
        amount: amount || 29.90,
        currency: 'BRL',
        status: 'completed',
        created_at: new Date().toISOString()
      }
    }
    
    // Processar webhook
    const { processPurchaseWebhook } = require('./src/lib/kirvano.js')
    const result = await processPurchaseWebhook(webhookData)
    
    res.json({
      success: true,
      message: 'Webhook simulado com sucesso',
      webhook_data: webhookData,
      result: result
    })
    
  } catch (error) {
    console.error('Erro ao simular webhook:', error)
    
    res.status(500).json({
      error: 'Erro ao simular webhook',
      message: error.message
    })
  }
})

// Rota para listar todos os acessos ativos
app.get('/api/kirvano/accesses', async (req, res) => {
  try {
    // Esta rota seria implementada para listar todos os usuários
    // com acesso ativo baseado em compras da Kirvano
    
    res.json({
      success: true,
      message: 'Funcionalidade de listagem em desenvolvimento',
      note: 'Esta rota listará todos os usuários com acesso ativo via Kirvano',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Erro ao listar acessos ativos:', error)
    
    res.status(500).json({
      error: 'Erro ao listar acessos',
      message: error.message
    })
  }
})

// Rota para verificar configuração da Kirvano
app.get('/api/kirvano/config', (req, res) => {
  try {
    const { kirvanoClient } = require('./src/lib/kirvano.js')
    
    res.json({
      success: true,
      configured: kirvanoClient.isConfigured(),
      base_url: kirvanoClient.baseURL,
      product_id: kirvanoClient.productId,
      has_api_key: !!kirvanoClient.apiKey
    })
    
  } catch (error) {
    console.error('Erro ao verificar configuração:', error)
    
    res.status(500).json({
      error: 'Erro ao verificar configuração',
      message: error.message
    })
  }
})

// Rota para limpar cache de acesso
app.post('/api/kirvano/clear-cache', async (req, res) => {
  try {
    const { clearLocalPurchaseAccess } = require('./src/lib/kirvano.js')
    
    // Limpar cache local
    clearLocalPurchaseAccess()
    
    res.json({
      success: true,
      message: 'Cache limpo com sucesso',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Erro ao limpar cache:', error)
    
    res.status(500).json({
      error: 'Erro ao limpar cache',
      message: error.message
    })
  }
})

// ===== ROTAS DE USUÁRIOS =====

// Criar ou atualizar usuário
app.post('/api/users', async (req, res) => {
  try {
    const result = await usersAPI.createOrUpdateUser(req.body)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    console.error('Erro na API de usuários:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Buscar usuário por email
app.get('/api/users/email/:email', async (req, res) => {
  try {
    const { email } = req.params
    const result = await usersAPI.getUserByEmail(email)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(404).json(result)
    }
  } catch (error) {
    console.error('Erro na API de usuários:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Atualizar usuário
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await usersAPI.updateUser(id, req.body)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    console.error('Erro na API de usuários:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Estatísticas de usuários
app.get('/api/users/stats', async (req, res) => {
  try {
    const result = await usersAPI.getUserStats()
    res.json(result)
  } catch (error) {
    console.error('Erro na API de usuários:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// ===== ROTAS DE CRIANÇAS =====

// Criar criança
app.post('/api/children', async (req, res) => {
  try {
    const result = await childrenAPI.createChild(req.body)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    console.error('Erro na API de crianças:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Buscar crianças de um usuário
app.get('/api/children/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const result = await childrenAPI.getChildrenByUser(userId)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(404).json(result)
    }
  } catch (error) {
    console.error('Erro na API de crianças:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Buscar criança por ID
app.get('/api/children/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await childrenAPI.getChildById(id)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(404).json(result)
    }
  } catch (error) {
    console.error('Erro na API de crianças:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Atualizar criança
app.put('/api/children/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await childrenAPI.updateChild(id, req.body)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    console.error('Erro na API de crianças:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// ===== ROTAS DE ATIVIDADES =====

// Buscar atividades
app.get('/api/activities', async (req, res) => {
  try {
    const result = await activitiesAPI.getActivities(req.query)
    res.json(result)
  } catch (error) {
    console.error('Erro na API de atividades:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Buscar atividade por ID
app.get('/api/activities/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await activitiesAPI.getActivityById(id)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(404).json(result)
    }
  } catch (error) {
    console.error('Erro na API de atividades:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Registrar atividade realizada
app.post('/api/activities/record', async (req, res) => {
  try {
    const result = await activitiesAPI.recordChildActivity(req.body)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    console.error('Erro na API de atividades:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Buscar atividades de uma criança
app.get('/api/activities/child/:childId', async (req, res) => {
  try {
    const { childId } = req.params
    const result = await activitiesAPI.getChildActivities(childId, req.query)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(404).json(result)
    }
  } catch (error) {
    console.error('Erro na API de atividades:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Adicionar aos favoritos
app.post('/api/activities/favorites', async (req, res) => {
  try {
    const { childId, activityId } = req.body
    const result = await activitiesAPI.addToFavorites(childId, activityId)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    console.error('Erro na API de atividades:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Remover dos favoritos
app.delete('/api/activities/favorites', async (req, res) => {
  try {
    const { childId, activityId } = req.body
    const result = await activitiesAPI.removeFromFavorites(childId, activityId)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    console.error('Erro na API de atividades:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Buscar favoritos de uma criança
app.get('/api/activities/favorites/:childId', async (req, res) => {
  try {
    const { childId } = req.params
    const result = await activitiesAPI.getChildFavorites(childId)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(404).json(result)
    }
  } catch (error) {
    console.error('Erro na API de atividades:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Estatísticas de atividades de uma criança
app.get('/api/activities/stats/:childId', async (req, res) => {
  try {
    const { childId } = req.params
    const { period = '30' } = req.query
    const result = await activitiesAPI.getChildActivityStats(childId, period)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(404).json(result)
    }
  } catch (error) {
    console.error('Erro na API de atividades:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Atividades recomendadas
app.get('/api/activities/recommended/:childId', async (req, res) => {
  try {
    const { childId } = req.params
    const { limit = 10 } = req.query
    const result = await activitiesAPI.getRecommendedActivities(childId, limit)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(404).json(result)
    }
  } catch (error) {
    console.error('Erro na API de atividades:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// ===== ROTAS DE ANALYTICS =====

// Gerar relatório de desenvolvimento
app.post('/api/analytics/report/:childId', async (req, res) => {
  try {
    const { childId } = req.params
    const { reportDate } = req.body
    const result = await analyticsAPI.generateDevelopmentReport(childId, reportDate)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    console.error('Erro na API de analytics:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Buscar relatórios de uma criança
app.get('/api/analytics/reports/:childId', async (req, res) => {
  try {
    const { childId } = req.params
    const { limit = 10 } = req.query
    const result = await analyticsAPI.getChildReports(childId, limit)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(404).json(result)
    }
  } catch (error) {
    console.error('Erro na API de analytics:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Estatísticas gerais do app
app.get('/api/analytics/stats', async (req, res) => {
  try {
    const result = await analyticsAPI.getAppStats()
    res.json(result)
  } catch (error) {
    console.error('Erro na API de analytics:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Estatísticas de uso por período
app.get('/api/analytics/usage', async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate e endDate são obrigatórios' })
    }
    
    const result = await analyticsAPI.getUsageStats(startDate, endDate)
    res.json(result)
  } catch (error) {
    console.error('Erro na API de analytics:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Rota para servir o PWA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
  console.log(`📡 API disponível em http://localhost:${PORT}/api`)
  console.log(`🌐 PWA disponível em http://localhost:${PORT}`)
  console.log(``)
  console.log(`🔗 WEBHOOKS:`)
  console.log(`   • Kirvano: http://localhost:${PORT}/api/webhooks/kirvano`)
  console.log(`   • Teste: http://localhost:${PORT}/api/webhooks/kirvano/test`)
  console.log(``)
  console.log(`👥 USUÁRIOS:`)
  console.log(`   • Criar/Atualizar: POST http://localhost:${PORT}/api/users`)
  console.log(`   • Buscar por email: GET http://localhost:${PORT}/api/users/email/:email`)
  console.log(`   • Estatísticas: GET http://localhost:${PORT}/api/users/stats`)
  console.log(``)
  console.log(`👶 CRIANÇAS:`)
  console.log(`   • Criar: POST http://localhost:${PORT}/api/children`)
  console.log(`   • Listar por usuário: GET http://localhost:${PORT}/api/children/user/:userId`)
  console.log(`   • Buscar por ID: GET http://localhost:${PORT}/api/children/:id`)
  console.log(``)
  console.log(`🎯 ATIVIDADES:`)
  console.log(`   • Listar: GET http://localhost:${PORT}/api/activities`)
  console.log(`   • Registrar: POST http://localhost:${PORT}/api/activities/record`)
  console.log(`   • Favoritos: GET http://localhost:${PORT}/api/activities/favorites/:childId`)
  console.log(`   • Recomendadas: GET http://localhost:${PORT}/api/activities/recommended/:childId`)
  console.log(``)
  console.log(`📊 ANALYTICS:`)
  console.log(`   • Relatório: POST http://localhost:${PORT}/api/analytics/report/:childId`)
  console.log(`   • Estatísticas: GET http://localhost:${PORT}/api/analytics/stats`)
  console.log(`   • Uso por período: GET http://localhost:${PORT}/api/analytics/usage`)
  console.log(``)
  console.log(`🧪 TESTES:`)
  console.log(`   • Verificar email: http://localhost:${PORT}/api/kirvano/status/email@exemplo.com`)
  console.log(`   • Simular webhook: POST http://localhost:${PORT}/api/kirvano/simulate-webhook`)
})

module.exports = app

