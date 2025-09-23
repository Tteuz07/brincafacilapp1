// API para gerenciamento de usuários
import { supabase } from '../lib/supabase.js'

// Criar ou atualizar perfil do usuário
export const createOrUpdateUser = async (userData) => {
  try {
    if (!supabase) {
      throw new Error('Supabase não configurado')
    }

    const { email, name, phone, access_type = 'authorized', purchase_data = null } = userData

    // Verificar se usuário já existe
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }

    if (existingUser) {
      // Atualizar usuário existente
      const { data, error } = await supabase
        .from('users')
        .update({
          name,
          phone,
          access_type,
          purchase_data,
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('email', email)
        .select()
        .single()

      if (error) throw error
      return { success: true, data, isNew: false }
    } else {
      // Criar novo usuário
      const { data, error } = await supabase
        .from('users')
        .insert({
          email,
          name,
          phone,
          access_type,
          purchase_data,
          last_login: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return { success: true, data, isNew: true }
    }
  } catch (error) {
    console.error('Erro ao criar/atualizar usuário:', error)
    return { success: false, error: error.message }
  }
}

// Buscar usuário por email
export const getUserByEmail = async (email) => {
  try {
    if (!supabase) {
      throw new Error('Supabase não configurado')
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    return { success: false, error: error.message }
  }
}

// Atualizar dados do usuário
export const updateUser = async (userId, updateData) => {
  try {
    if (!supabase) {
      throw new Error('Supabase não configurado')
    }

    const { data, error } = await supabase
      .from('users')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    return { success: false, error: error.message }
  }
}

// Desativar usuário
export const deactivateUser = async (userId) => {
  try {
    if (!supabase) {
      throw new Error('Supabase não configurado')
    }

    const { data, error } = await supabase
      .from('users')
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Erro ao desativar usuário:', error)
    return { success: false, error: error.message }
  }
}

// Listar todos os usuários (admin)
export const getAllUsers = async (limit = 50, offset = 0) => {
  try {
    if (!supabase) {
      throw new Error('Supabase não configurado')
    }

    const { data, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return { success: true, data, count }
  } catch (error) {
    console.error('Erro ao listar usuários:', error)
    return { success: false, error: error.message }
  }
}

// Estatísticas de usuários
export const getUserStats = async () => {
  try {
    if (!supabase) {
      throw new Error('Supabase não configurado')
    }

    // Total de usuários
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    // Usuários ativos
    const { count: activeUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // Usuários com acesso por compra
    const { count: purchaseUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('access_type', 'purchase')

    // Usuários cadastrados hoje
    const today = new Date().toISOString().split('T')[0]
    const { count: todayUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today)

    return {
      success: true,
      data: {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        purchaseUsers: purchaseUsers || 0,
        todayUsers: todayUsers || 0
      }
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas de usuários:', error)
    return { success: false, error: error.message }
  }
}

export default {
  createOrUpdateUser,
  getUserByEmail,
  updateUser,
  deactivateUser,
  getAllUsers,
  getUserStats
}

