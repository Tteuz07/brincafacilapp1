// API para gerenciamento de atividades
import { supabase } from '../lib/supabase.js'

// Buscar atividades por categoria e faixa etária
export const getActivities = async (filters = {}) => {
  try {
    if (!supabase) {
      throw new Error('Supabase não configurado')
    }

    let query = supabase
      .from('activities')
      .select('*')
      .eq('is_active', true)

    // Aplicar filtros
    if (filters.category) {
      query = query.eq('category', filters.category)
    }

    if (filters.age) {
      query = query
        .lte('age_range_min', filters.age)
        .gte('age_range_max', filters.age)
    }

    if (filters.difficulty) {
      query = query.eq('difficulty_level', filters.difficulty)
    }

    if (filters.duration) {
      query = query.lte('duration_minutes', filters.duration)
    }

    // Ordenação
    const orderBy = filters.orderBy || 'created_at'
    const ascending = filters.ascending !== false
    query = query.order(orderBy, { ascending })

    // Paginação
    if (filters.limit) {
      const offset = (filters.page || 0) * filters.limit
      query = query.range(offset, offset + filters.limit - 1)
    }

    const { data, error } = await query

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Erro ao buscar atividades:', error)
    return { success: false, error: error.message }
  }
}

// Buscar atividade por ID
export const getActivityById = async (activityId) => {
  try {
    if (!supabase) {
      throw new Error('Supabase não configurado')
    }

    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('id', activityId)
      .eq('is_active', true)
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Erro ao buscar atividade:', error)
    return { success: false, error: error.message }
  }
}

// Registrar atividade realizada pela criança
export const recordChildActivity = async (activityData) => {
  try {
    if (!supabase) {
      throw new Error('Supabase não configurado')
    }

    const {
      child_id,
      activity_id,
      duration_minutes,
      rating,
      notes,
      parent_notes,
      difficulty_felt,
      enjoyment_level
    } = activityData

    const { data, error } = await supabase
      .from('child_activities')
      .insert({
        child_id,
        activity_id,
        duration_minutes,
        rating,
        notes,
        parent_notes,
        difficulty_felt,
        enjoyment_level
      })
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Erro ao registrar atividade:', error)
    return { success: false, error: error.message }
  }
}

// Buscar atividades realizadas por uma criança
export const getChildActivities = async (childId, filters = {}) => {
  try {
    if (!supabase) {
      throw new Error('Supabase não configurado')
    }

    let query = supabase
      .from('child_activities')
      .select(`
        *,
        activities (
          id,
          title,
          description,
          category,
          difficulty_level,
          duration_minutes
        )
      `)
      .eq('child_id', childId)

    // Aplicar filtros de data
    if (filters.startDate) {
      query = query.gte('completed_at', filters.startDate)
    }

    if (filters.endDate) {
      query = query.lte('completed_at', filters.endDate)
    }

    if (filters.category) {
      query = query.eq('activities.category', filters.category)
    }

    // Ordenação
    const orderBy = filters.orderBy || 'completed_at'
    const ascending = filters.ascending === false ? false : true
    query = query.order(orderBy, { ascending })

    // Paginação
    if (filters.limit) {
      const offset = (filters.page || 0) * filters.limit
      query = query.range(offset, offset + filters.limit - 1)
    }

    const { data, error } = await query

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Erro ao buscar atividades da criança:', error)
    return { success: false, error: error.message }
  }
}

// Adicionar atividade aos favoritos
export const addToFavorites = async (childId, activityId) => {
  try {
    if (!supabase) {
      throw new Error('Supabase não configurado')
    }

    const { data, error } = await supabase
      .from('favorites')
      .insert({
        child_id,
        activity_id
      })
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Erro ao adicionar aos favoritos:', error)
    return { success: false, error: error.message }
  }
}

// Remover atividade dos favoritos
export const removeFromFavorites = async (childId, activityId) => {
  try {
    if (!supabase) {
      throw new Error('Supabase não configurado')
    }

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('child_id', childId)
      .eq('activity_id', activityId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Erro ao remover dos favoritos:', error)
    return { success: false, error: error.message }
  }
}

// Buscar atividades favoritas de uma criança
export const getChildFavorites = async (childId) => {
  try {
    if (!supabase) {
      throw new Error('Supabase não configurado')
    }

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        activities (
          id,
          title,
          description,
          category,
          age_range_min,
          age_range_max,
          difficulty_level,
          duration_minutes,
          materials_needed,
          instructions,
          image_url
        )
      `)
      .eq('child_id', childId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error)
    return { success: false, error: error.message }
  }
}

// Buscar estatísticas de atividades de uma criança
export const getChildActivityStats = async (childId, period = '30') => {
  try {
    if (!supabase) {
      throw new Error('Supabase não configurado')
    }

    // Calcular data de início do período
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    // Total de atividades realizadas
    const { count: totalActivities } = await supabase
      .from('child_activities')
      .select('*', { count: 'exact', head: true })
      .eq('child_id', childId)
      .gte('completed_at', startDate.toISOString())

    // Atividades por categoria
    const { data: categoryData } = await supabase
      .from('child_activities')
      .select(`
        activities!inner(category)
      `)
      .eq('child_id', childId)
      .gte('completed_at', startDate.toISOString())

    const categoryStats = categoryData?.reduce((acc, item) => {
      const category = item.activities.category
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {}) || {}

    // Média de avaliações
    const { data: ratingData } = await supabase
      .from('child_activities')
      .select('rating, difficulty_felt, enjoyment_level')
      .eq('child_id', childId)
      .gte('completed_at', startDate.toISOString())
      .not('rating', 'is', null)

    const avgRating = ratingData?.length > 0 
      ? ratingData.reduce((sum, item) => sum + item.rating, 0) / ratingData.length 
      : 0

    const avgDifficulty = ratingData?.length > 0 
      ? ratingData.reduce((sum, item) => sum + (item.difficulty_felt || 0), 0) / ratingData.length 
      : 0

    const avgEnjoyment = ratingData?.length > 0 
      ? ratingData.reduce((sum, item) => sum + (item.enjoyment_level || 0), 0) / ratingData.length 
      : 0

    // Tempo total de atividades
    const { data: durationData } = await supabase
      .from('child_activities')
      .select('duration_minutes')
      .eq('child_id', childId)
      .gte('completed_at', startDate.toISOString())
      .not('duration_minutes', 'is', null)

    const totalMinutes = durationData?.reduce((sum, item) => sum + (item.duration_minutes || 0), 0) || 0

    return {
      success: true,
      data: {
        totalActivities: totalActivities || 0,
        categoryDistribution: categoryStats,
        averageRating: Math.round(avgRating * 10) / 10,
        averageDifficulty: Math.round(avgDifficulty * 10) / 10,
        averageEnjoyment: Math.round(avgEnjoyment * 10) / 10,
        totalMinutes,
        period: `${period} dias`
      }
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas de atividades:', error)
    return { success: false, error: error.message }
  }
}

// Buscar atividades recomendadas para uma criança
export const getRecommendedActivities = async (childId, limit = 10) => {
  try {
    if (!supabase) {
      throw new Error('Supabase não configurado')
    }

    // Buscar dados da criança
    const { data: child, error: childError } = await supabase
      .from('children')
      .select('birth_date')
      .eq('id', childId)
      .single()

    if (childError) throw childError

    // Calcular idade
    const age = calculateAge(child.birth_date)

    // Buscar atividades já realizadas
    const { data: completedActivities } = await supabase
      .from('child_activities')
      .select('activity_id')
      .eq('child_id', childId)

    const completedIds = completedActivities?.map(item => item.activity_id) || []

    // Buscar atividades recomendadas
    let query = supabase
      .from('activities')
      .select('*')
      .eq('is_active', true)
      .lte('age_range_min', age)
      .gte('age_range_max', age)

    if (completedIds.length > 0) {
      query = query.not('id', 'in', `(${completedIds.join(',')})`)
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Erro ao buscar atividades recomendadas:', error)
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

export default {
  getActivities,
  getActivityById,
  recordChildActivity,
  getChildActivities,
  addToFavorites,
  removeFromFavorites,
  getChildFavorites,
  getChildActivityStats,
  getRecommendedActivities
}





