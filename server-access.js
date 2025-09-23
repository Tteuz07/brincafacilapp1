import express from 'express'
import { createClient } from '@supabase/supabase-js'

const app = express()
app.use(express.json())

// Configuração do Supabase (apenas para controle de acesso)
const supabaseUrl = 'https://zbrqgtxrtbsezlutxopz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpicnFndHhydGJzZXpsdXR4b3B6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMTE1MDQsImV4cCI6MjA3MzY4NzUwNH0.SD8gwzrOvglLUF7fGYwQAN_VGzClLJlHDkn0TJQZogE'

const supabase = createClient(supabaseUrl, supabaseKey)

// Rota de teste
app.get('/api/test', (req, res) => res.json({message: 'OK', supabase: 'connected'}))

// Verificar acesso do usuário (Supabase)
app.post('/api/auth/check-access', async (req, res) => {
  try {
    const { email } = req.body
    
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email é obrigatório' })
    }

    // Verificar se email está autorizado
    const { data: authorizedEmail } = await supabase
      .from('authorized_emails')
      .select('email, active')
      .eq('email', email)
      .eq('active', true)
      .single()

    // Verificar se tem compra verificada
    const { data: verifiedPurchase } = await supabase
      .from('verified_purchases')
      .select('email, status, expires_at')
      .eq('email', email)
      .eq('status', 'completed')
      .single()

    const hasAccess = !!authorizedEmail || !!verifiedPurchase

    res.json({
      success: true,
      hasAccess,
      accessType: authorizedEmail ? 'authorized' : (verifiedPurchase ? 'purchase' : 'none'),
      email: email
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Registrar login do usuário (Supabase)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, name } = req.body
    
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email é obrigatório' })
    }

    // Verificar acesso primeiro
    const { data: authorizedEmail } = await supabase
      .from('authorized_emails')
      .select('email, active')
      .eq('email', email)
      .eq('active', true)
      .single()

    const { data: verifiedPurchase } = await supabase
      .from('verified_purchases')
      .select('email, status, expires_at')
      .eq('email', email)
      .eq('status', 'completed')
      .single()

    const hasAccess = !!authorizedEmail || !!verifiedPurchase

    if (!hasAccess) {
      return res.status(403).json({ 
        success: false, 
        error: 'Email não autorizado para acesso' 
      })
    }

    // Registrar login no Supabase
    const { data: user, error } = await supabase
      .from('users')
      .upsert({
        email: email,
        name: name || email,
        last_login: new Date().toISOString(),
        is_active: true
      })
      .select()
      .single()

    if (error) throw error

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        hasAccess: true
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Dados locais (atividades e desenhos) - retornar dados estáticos
app.get('/api/local/activities', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        title: 'Torre de Blocos',
        description: 'Construir uma torre com blocos de diferentes tamanhos',
        category: 'motor',
        ageRange: { min: 1, max: 3 },
        difficulty: 2,
        duration: 15,
        materials: ['blocos de construção'],
        instructions: 'Peça para a criança empilhar os blocos do maior para o menor'
      },
      {
        id: 2,
        title: 'Quebra-cabeça Simples',
        description: 'Montar um quebra-cabeça com poucas peças',
        category: 'cognitive',
        ageRange: { min: 2, max: 4 },
        difficulty: 2,
        duration: 20,
        materials: ['quebra-cabeça infantil'],
        instructions: 'Ajude a criança a encontrar as peças que se encaixam'
      },
      {
        id: 3,
        title: 'Dança das Cores',
        description: 'Pular quando a música parar e tocar na cor mencionada',
        category: 'motor',
        ageRange: { min: 3, max: 6 },
        difficulty: 3,
        duration: 10,
        materials: ['música', 'objetos coloridos'],
        instructions: 'Coloque música e peça para pular quando parar, tocando na cor que você mencionar'
      }
    ]
  })
})

app.get('/api/local/cartoons', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        title: 'Bluey',
        description: 'A cachorrinha azul e suas aventuras familiares',
        category: 'animação',
        ageRange: { min: 2, max: 8 },
        duration: 7
      },
      {
        id: 2,
        title: 'Caillou',
        description: 'O menino de 4 anos e suas descobertas',
        category: 'educativo',
        ageRange: { min: 2, max: 6 },
        duration: 11
      },
      {
        id: 3,
        title: 'Daniel Tigre',
        description: 'As aventuras do pequeno tigre Daniel',
        category: 'educativo',
        ageRange: { min: 2, max: 6 },
        duration: 11
      }
    ]
  })
})

// Estatísticas de uso (Supabase)
app.get('/api/analytics/stats', async (req, res) => {
  try {
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    const { count: totalChildren } = await supabase
      .from('child_profiles')
      .select('*', { count: 'exact', head: true })

    res.json({
      success: true,
      data: {
        users: { total: totalUsers || 0, today: 0 },
        children: { total: totalChildren || 0 },
        activities: { total: 3, today: 0, categoryDistribution: {}, averageRating: 0 },
        cartoons: { total: 3, today: 0 }
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.listen(3000, () => console.log(' Servidor de Acesso + Dados Locais rodando na porta 3000'))