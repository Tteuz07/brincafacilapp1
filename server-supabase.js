import express from 'express'
import { createClient } from '@supabase/supabase-js'

const app = express()
app.use(express.json())

// Configuração do Supabase
const supabaseUrl = 'https://zbrqgtxrtbsezlutxopz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpicnFndHhydGJzZXpsdXR4b3B6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMTE1MDQsImV4cCI6MjA3MzY4NzUwNH0.SD8gwzrOvglLUF7fGYwQAN_VGzClLJlHDkn0TJQZogE'

const supabase = createClient(supabaseUrl, supabaseKey)

// Rota de teste
app.get('/api/test', (req, res) => res.json({message: 'OK', supabase: 'connected'}))

// Estatísticas reais do Supabase
app.get('/api/analytics/stats', async (req, res) => {
  try {
    // Contar usuários
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // Contar crianças
    const { count: totalChildren } = await supabase
      .from('child_profiles')
      .select('*', { count: 'exact', head: true })

    // Contar atividades
    const { count: totalActivities } = await supabase
      .from('activities')
      .select('*', { count: 'exact', head: true })

    res.json({
      success: true,
      data: {
        users: { total: totalUsers || 0, today: 0 },
        children: { total: totalChildren || 0 },
        activities: { total: totalActivities || 0, today: 0, categoryDistribution: {}, averageRating: 0 }
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Listar atividades reais do Supabase
app.get('/api/activities', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('activities')
      .select('id, title, description, category, min_age, max_age, difficulty')
      .limit(10)

    if (error) throw error

    res.json({
      success: true,
      data: data || []
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Listar desenhos reais do Supabase
app.get('/api/cartoons', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cartoons')
      .select('id, title, description, category, min_age, max_age')
      .limit(10)

    if (error) throw error

    res.json({
      success: true,
      data: data || []
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Listar usuários
app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, created_at, is_active')
      .limit(10)

    if (error) throw error

    res.json({
      success: true,
      data: data || []
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Configuração da Kirvano (ainda não configurada)
app.get('/api/kirvano/config', (req, res) => res.json({
  success: true,
  configured: false,
  base_url: 'https://api.kirvano.com',
  product_id: 'brincafacil-premium',
  has_api_key: false
}))

app.listen(3000, () => console.log(' Servidor com Supabase rodando na porta 3000'))