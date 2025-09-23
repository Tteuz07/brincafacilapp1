import { useEffect, useState } from 'react'
import useAppStore from '../store/useAppStore'

export const useChildDevelopment = () => {
  const { 
    childDevelopment, 
    recordDevelopmentActivity, 
    recordDailyHabit,
    updateChildDevelopment 
  } = useAppStore()
  
  const [isLoading, setIsLoading] = useState(false)

  // Carregar dados iniciais
  useEffect(() => {
    if (!childDevelopment) {
      // Inicializar dados padrão se não existirem
      const defaultData = {
        cognitive: { progress: 0, activities: [], lastUpdated: null },
        motor: { progress: 0, activities: [], lastUpdated: null },
        social: { progress: 0, activities: [], lastUpdated: null },
        emotional: { progress: 0, activities: [], lastUpdated: null },
        habits: {
          reading: { streak: 0, goal: 30, lastActivity: null },
          exercise: { streak: 0, goal: 7, lastActivity: null },
          creativity: { hours: 0, goal: 25, lastActivity: null },
          sleep: { streak: 0, goal: 7, lastActivity: null }
        },
        achievements: [],
        totalPoints: 0,
        level: 1,
        weeklyGoal: 5,
        completedThisWeek: 0,
        currentStreak: 0,
        lastUpdated: new Date().toISOString()
      }
      
      updateChildDevelopment(defaultData)
    }
  }, [childDevelopment, updateChildDevelopment])

  // Função para registrar atividade de desenvolvimento
  const recordActivity = async (area, activityName, points = 10) => {
    setIsLoading(true)
    try {
      const result = recordDevelopmentActivity(area, activityName, points)
      
      // Verificar se desbloqueou nova conquista
      const newAchievements = result.achievements.filter(achievement => 
        !childDevelopment?.achievements?.some(existing => existing.id === achievement.id)
      )
      
      return { success: true, result, newAchievements }
    } catch (error) {
      console.error('Erro ao registrar atividade:', error)
      return { success: false, error }
    } finally {
      setIsLoading(false)
    }
  }

  // Função para registrar hábito diário
  const recordHabit = async (habitType, value = 1) => {
    setIsLoading(true)
    try {
      const result = recordDailyHabit(habitType, value)
      
      // Verificar se atingiu meta
      const habit = result.habits[habitType]
      const goalReached = habit.streak >= habit.goal
      
      return { success: true, result, goalReached }
    } catch (error) {
      console.error('Erro ao registrar hábito:', error)
      return { success: false, error }
    } finally {
      setIsLoading(false)
    }
  }

  // Função para obter estatísticas resumidas
  const getStats = () => {
    if (!childDevelopment) return null
    
    const totalActivities = Object.values(childDevelopment)
      .filter(area => typeof area === 'object' && area.activities)
      .reduce((total, area) => total + area.activities.length, 0)
    
    const totalHabits = Object.values(childDevelopment.habits)
      .reduce((total, habit) => total + habit.streak, 0)
    
    const averageProgress = Object.values(childDevelopment)
      .filter(area => typeof area === 'object' && typeof area.progress === 'number')
      .reduce((total, area) => total + area.progress, 0) / 4
    
    return {
      totalActivities,
      totalHabits,
      averageProgress: Math.round(averageProgress),
      level: childDevelopment.level,
      totalPoints: childDevelopment.totalPoints,
      weeklyProgress: Math.round((childDevelopment.completedThisWeek / childDevelopment.weeklyGoal) * 100)
    }
  }

  // Função para obter próximas conquistas
  const getNextAchievements = () => {
    if (!childDevelopment) return []
    
    const nextAchievements = []
    
    // Verificar áreas de desenvolvimento
    Object.entries(childDevelopment).forEach(([area, data]) => {
      if (typeof data === 'object' && data.progress !== undefined) {
        const nextMilestone = Math.ceil(data.progress / 25) * 25
        if (nextMilestone > data.progress && nextMilestone <= 100) {
          nextAchievements.push({
            type: 'area',
            area,
            current: data.progress,
            next: nextMilestone,
            title: `Alcançar ${nextMilestone}% em ${area === 'cognitive' ? 'Cognitivo' : area === 'motor' ? 'Motor' : area === 'social' ? 'Social' : 'Emocional'}`,
            points: 25
          })
        }
      }
    })
    
    // Verificar hábitos
    Object.entries(childDevelopment.habits).forEach(([habit, data]) => {
      if (data.streak < data.goal) {
        const remaining = data.goal - data.streak
        nextAchievements.push({
          type: 'habit',
          habit,
          current: data.streak,
          next: data.goal,
          title: `Completar meta de ${habit === 'reading' ? 'Leitura' : habit === 'exercise' ? 'Exercício' : habit === 'creativity' ? 'Criatividade' : 'Sono'}`,
          points: 50,
          remaining
        })
      }
    })
    
    return nextAchievements.sort((a, b) => a.remaining - b.remaining)
  }

  // Função para obter histórico de atividades
  const getActivityHistory = (area = null, limit = 10) => {
    if (!childDevelopment) return []
    
    let activities = []
    
    if (area && childDevelopment[area]?.activities) {
      activities = childDevelopment[area].activities
    } else {
      // Todas as atividades de todas as áreas
      Object.values(childDevelopment).forEach(areaData => {
        if (typeof areaData === 'object' && areaData.activities) {
          activities.push(...areaData.activities.map(activity => ({
            ...activity,
            area: Object.keys(childDevelopment).find(key => childDevelopment[key] === areaData)
          })))
        }
      })
    }
    
    return activities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit)
  }

  // Função para resetar dados semanais
  const resetWeeklyData = () => {
    updateChildDevelopment({
      completedThisWeek: 0,
      weeklyGoal: 5
    })
  }

  // Função para definir nova meta semanal
  const setWeeklyGoal = (newGoal) => {
    updateChildDevelopment({
      weeklyGoal: newGoal,
      completedThisWeek: 0
    })
  }

  return {
    childDevelopment,
    isLoading,
    recordActivity,
    recordHabit,
    getStats,
    getNextAchievements,
    getActivityHistory,
    resetWeeklyData,
    setWeeklyGoal
  }
}



