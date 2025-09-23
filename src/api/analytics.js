// API para relatórios e analytics
import { supabase } from '../lib/supabase.js'

// Gerar relatório de desenvolvimento de uma criança
export const generateDevelopmentReport = async (childId, reportDate = null) => {
  try {
    if (!supabase) {
      throw new Error('Supabase não configurado')
    }

    const targetDate = reportDate || new Date().toISOString().split('T')[0]

    // Buscar dados da criança
    const { data: child, error: childError } = await supabase
      .from('children')
      .select('*')
      .eq('id', childId)
      .single()

    if (childError) throw childError

    // Calcular idade
    const age = calculateAge(child.birth_date)

    // Buscar atividades dos últimos 30 dias
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: activities, error: activitiesError } = await supabase
      .from('child_activities')
      .select(`
        *,
        activities!inner(category, difficulty_level)
      `)
      .eq('child_id', childId)
      .gte('completed_at', thirtyDaysAgo.toISOString())

    if (activitiesError) throw activitiesError

    // Calcular scores por categoria
    const scores = calculateCategoryScores(activities)

    // Calcular score geral
    const overallScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length

    // Contar atividades realizadas
    const activitiesCompleted = activities?.length || 0

    // Gerar insights
    const insights = generateInsights(scores, activitiesCompleted, age)

    // Salvar relatório no banco
    const { data: report, error: reportError } = await supabase
      .from('development_reports')
      .upsert({
        child_id: childId,
        report_date: targetDate,
        motor_skills_score: scores.motor || 0,
        cognitive_skills_score: scores.cognitive || 0,
        social_skills_score: scores.social || 0,
        language_skills_score: scores.language || 0,
        overall_score: Math.round(overallScore * 100) / 100,
        activities_completed: activitiesCompleted,
        notes: insights.join('; ')
      })
      .select()
      .single()

    if (reportError) throw reportError

    return {
      success: true,
      data: {
        child: {
          id: child.id,
          name: child.name,
          age: age
        },
        report: {
          ...report,
          insights,
          scores,
          activitiesCompleted
        }
      }
    }
  } catch (error) {
    console.error('Erro ao gerar relatório de desenvolvimento:', error)
    return { success: false, error: error.message }
  }
}

// Buscar relatórios de uma criança
export const getChildReports = async (childId, limit = 10) => {
  try {
    if (!supabase) {
      throw new Error('Supabase não configurado')
    }

    const { data, error } = await supabase
      .from('development_reports')
      .select('*')
      .eq('child_id', childId)
      .order('report_date', { ascending: false })
      .limit(limit)

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Erro ao buscar relatórios:', error)
    return { success: false, error: error.message }
  }
}

// Buscar estatísticas gerais do app
export const getAppStats = async () => {
  try {
    if (!supabase) {
      throw new Error('Supabase não configurado')
    }

    // Total de usuários
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // Total de crianças
    const { count: totalChildren } = await supabase
      .from('children')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // Total de atividades realizadas
    const { count: totalActivities } = await supabase
      .from('child_activities')
      .select('*', { count: 'exact', head: true })

    // Atividades realizadas hoje
    const today = new Date().toISOString().split('T')[0]
    const { count: todayActivities } = await supabase
      .from('child_activities')
      .select('*', { count: 'exact', head: true })
      .gte('completed_at', today)

    // Usuários cadastrados hoje
    const { count: todayUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today)

    // Distribuição de atividades por categoria
    const { data: categoryData } = await supabase
      .from('child_activities')
      .select(`
        activities!inner(category)
      `)

    const categoryStats = categoryData?.reduce((acc, item) => {
      const category = item.activities.category
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {}) || {}

    // Média de avaliações
    const { data: ratingData } = await supabase
      .from('child_activities')
      .select('rating')
      .not('rating', 'is', null)

    const avgRating = ratingData?.length > 0 
      ? ratingData.reduce((sum, item) => sum + item.rating, 0) / ratingData.length 
      : 0

    return {
      success: true,
      data: {
        users: {
          total: totalUsers || 0,
          today: todayUsers || 0
        },
        children: {
          total: totalChildren || 0
        },
        activities: {
          total: totalActivities || 0,
          today: todayActivities || 0,
          categoryDistribution: categoryStats,
          averageRating: Math.round(avgRating * 10) / 10
        }
      }
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas do app:', error)
    return { success: false, error: error.message }
  }
}

// Buscar dados de uso por período
export const getUsageStats = async (startDate, endDate) => {
  try {
    if (!supabase) {
      throw new Error('Supabase não configurado')
    }

    // Atividades realizadas no período
    const { data: activities, error: activitiesError } = await supabase
      .from('child_activities')
      .select(`
        completed_at,
        activities!inner(category, difficulty_level)
      `)
      .gte('completed_at', startDate)
      .lte('completed_at', endDate)

    if (activitiesError) throw activitiesError

    // Agrupar por dia
    const dailyStats = activities?.reduce((acc, activity) => {
      const date = activity.completed_at.split('T')[0]
      if (!acc[date]) {
        acc[date] = {
          date,
          total: 0,
          categories: {}
        }
      }
      acc[date].total++
      const category = activity.activities.category
      acc[date].categories[category] = (acc[date].categories[category] || 0) + 1
      return acc
    }, {}) || {}

    // Usuários ativos no período
    const { data: activeUsers, error: usersError } = await supabase
      .from('users')
      .select('last_login')
      .eq('is_active', true)
      .gte('last_login', startDate)
      .lte('last_login', endDate)

    if (usersError) throw usersError

    return {
      success: true,
      data: {
        dailyActivities: Object.values(dailyStats),
        activeUsers: activeUsers?.length || 0,
        period: {
          start: startDate,
          end: endDate
        }
      }
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas de uso:', error)
    return { success: false, error: error.message }
  }
}

// Função auxiliar para calcular idade
const calculateAge = (birthDate) => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

// Função para calcular scores por categoria
const calculateCategoryScores = (activities) => {
  const categories = ['motor', 'cognitive', 'social', 'language']
  const scores = {}

  categories.forEach(category => {
    const categoryActivities = activities?.filter(activity => 
      activity.activities.category === category
    ) || []

    if (categoryActivities.length === 0) {
      scores[category] = 0
      return
    }

    // Calcular score baseado em avaliações e dificuldade
    const totalScore = categoryActivities.reduce((sum, activity) => {
      let score = 0
      
      // Baseado na avaliação (1-5)
      if (activity.rating) {
        score += activity.rating * 2
      }
      
      // Baseado no nível de dificuldade da atividade
      if (activity.activities.difficulty_level) {
        score += activity.activities.difficulty_level
      }
      
      // Bonus por completar a atividade
      score += 1
      
      return sum + score
    }, 0)

    scores[category] = Math.min(5, Math.round((totalScore / categoryActivities.length) * 10) / 10)
  })

  return scores
}

// Função para gerar insights baseados nos scores
const generateInsights = (scores, activitiesCompleted, age) => {
  const insights = []

  // Insight sobre quantidade de atividades
  if (activitiesCompleted === 0) {
    insights.push('Nenhuma atividade foi registrada neste período. Que tal começar a explorar as atividades disponíveis?')
  } else if (activitiesCompleted < 5) {
    insights.push('Poucas atividades foram realizadas. Tente aumentar a frequência para melhor desenvolvimento.')
  } else if (activitiesCompleted > 20) {
    insights.push('Excelente! Muitas atividades foram realizadas. Continue assim!')
  }

  // Insights por categoria
  Object.entries(scores).forEach(([category, score]) => {
    const categoryName = {
      motor: 'Habilidades Motoras',
      cognitive: 'Habilidades Cognitivas',
      social: 'Habilidades Sociais',
      language: 'Habilidades de Linguagem'
    }[category]

    if (score >= 4) {
      insights.push(`${categoryName}: Desenvolvimento excelente! Continue incentivando atividades nesta área.`)
    } else if (score >= 3) {
      insights.push(`${categoryName}: Bom desenvolvimento. Há espaço para mais atividades nesta área.`)
    } else if (score > 0) {
      insights.push(`${categoryName}: Desenvolvimento inicial. Foque em atividades mais simples nesta área.`)
    } else {
      insights.push(`${categoryName}: Nenhuma atividade registrada. Que tal explorar atividades desta categoria?`)
    }
  })

  // Insight sobre idade
  if (age < 3) {
    insights.push('Para esta idade, foque em atividades sensoriais e motoras básicas.')
  } else if (age < 6) {
    insights.push('Período ideal para desenvolver habilidades cognitivas e sociais através de brincadeiras.')
  } else {
    insights.push('Idade perfeita para atividades mais complexas e desafios educacionais.')
  }

  return insights
}

export default {
  generateDevelopmentReport,
  getChildReports,
  getAppStats,
  getUsageStats
}





