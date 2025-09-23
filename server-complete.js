import express from 'express'
const app = express()
app.use(express.json())

// Rota de teste
app.get('/api/test', (req, res) => res.json({message: 'OK'}))

// Rota de estatísticas (simulada)
app.get('/api/analytics/stats', (req, res) => res.json({
  success: true,
  data: {
    users: { total: 0, today: 0 },
    children: { total: 0 },
    activities: { total: 0, today: 0, categoryDistribution: {}, averageRating: 0 }
  }
}))

// Rota de atividades (simulada)
app.get('/api/activities', (req, res) => res.json({
  success: true,
  data: [
    { id: 1, title: 'Torre de Blocos', category: 'motor' },
    { id: 2, title: 'Quebra-cabeça', category: 'cognitive' }
  ]
}))

// Rota da Kirvano (simulada)
app.get('/api/kirvano/config', (req, res) => res.json({
  success: true,
  configured: false,
  base_url: 'https://api.kirvano.com',
  product_id: 'brincafacil-premium',
  has_api_key: false
}))

app.listen(3000, () => console.log(' Servidor completo rodando na porta 3000'))