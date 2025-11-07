import React, { useState } from 'react'
import { 
  Trophy, 
  Star,
  Clock,
  Gift,
  Palette,
  Music,
  BookOpen,
  Camera,
  Smile,
  Zap,
  Target,
  Book,
  Dumbbell,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import { useChildDevelopment } from '../../hooks/useChildDevelopment'
import { ActivityHistory } from '../../components/ActivityHistory/ActivityHistory'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const { 
    child, 
    favorites, 
    setChild
  } = useAppStore()
  
  const {
    childDevelopment,
    recordActivity,
    getStats,
    getActivityHistory
  } = useChildDevelopment()
  
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingChild, setEditingChild] = useState(child || {})
  


  const handleSaveChild = async () => {
    try {
      setChild(editingChild)
      setShowEditModal(false)
      toast.success('Perfil atualizado! 🎉')
    } catch (error) {
      toast.error('Erro ao atualizar perfil')
    }
  }



  const getActivityStats = () => {
    const totalFavorites = favorites?.length || 0
    const activityFavorites = favorites?.filter(f => f.type === 'activity').length || 0
    const cartoonFavorites = favorites?.filter(f => f.type === 'cartoon').length || 0
    
    // Valores padrão para habits
    const defaultHabits = {
      reading: { streak: 0, goal: 30 },
      exercise: { streak: 0, goal: 7 },
      creativity: { hours: 0, goal: 25 },
      sleep: { streak: 0, goal: 7 }
    }
    
    // Usar dados reais do store ou valores padrão
    const development = childDevelopment || {
      totalPoints: 0,
      level: 1,
      weeklyGoal: 5,
      completedThisWeek: 0,
      currentStreak: 0,
      habits: defaultHabits
    }
    
    // Garantir que habits existe e tem todas as propriedades
    const habits = development.habits || defaultHabits
    
    return {
      totalFavorites,
      activityFavorites,
      cartoonFavorites,
      weeklyGoal: development.weeklyGoal || 5,
      completedThisWeek: development.completedThisWeek || 0,
      streak: development.currentStreak || 0,
      totalPoints: development.totalPoints || 0,
      level: development.level || 1,
      readingStreak: habits.reading?.streak || 0,
      exerciseDays: habits.exercise?.streak || 0,
      creativeHours: habits.creativity?.hours || 0,
      sleepStreak: habits.sleep?.streak || 0
    }
  }

  const stats = getActivityStats()

  // (Seção de dicas removida)

  const avatarOptions = [
    '👶', '🧒', '👦', '👧', '🦄', '🐻', '🐱', '🐶', '🦊', '🐼', '🦋', '🌟', '🌈', '🎈', '🎪', '🚀'
  ]

  return (
    <div className="container-app py-6 space-y-6">
      {/* Header Personalizado da Criança */}
      <div className="card bg-gradient-to-br from-primary-50 to-orange-50 border-primary-200">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-orange-500 rounded-full flex items-center justify-center text-4xl shadow-lg animate-pulse">
            {child?.avatar || '🧒'}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">
              {child?.name || 'Minha Criança'}! 🎉
            </h2>
            <p className="text-gray-600 text-lg">
              {child?.age ? `${child.age} anos de diversão e crescimento` : 'Idade não informada'}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <Trophy size={20} className="text-yellow-500 fill-yellow-500" />
              <span className="text-sm text-gray-600 font-medium">
                Nível {stats.level} - {stats.totalPoints} pontos
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="p-3 rounded-xl bg-white/80 hover:bg-white transition-colors shadow-md"
          >
            <Palette size={24} className="text-primary-600" />
          </button>
        </div>

        {/* Progresso Semanal com Design Infantil */}
        <div className="bg-gradient-to-r from-primary-100 to-orange-100 rounded-xl p-4 border border-primary-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-primary-800 flex items-center space-x-2">
              <Target size={16} />
              <span>Meta Semanal de Desenvolvimento</span>
            </span>
            <span className="text-sm font-bold text-primary-600 bg-white px-3 py-1 rounded-full">
              {stats.completedThisWeek}/{stats.weeklyGoal}
            </span>
          </div>
          <div className="w-full bg-white rounded-full h-3 shadow-inner">
            <div 
              className="bg-gradient-to-r from-primary-500 to-orange-500 h-3 rounded-full transition-all duration-500 shadow-sm"
              style={{ 
                width: `${Math.min((stats.completedThisWeek / stats.weeklyGoal) * 100, 100)}%` 
              }}
            ></div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-primary-700 font-medium">
              Continue crescendo! 🌱
            </p>
            <div className="flex items-center space-x-1">
              <span className="text-xs text-orange-600 font-bold">🔥</span>
              <span className="text-xs text-orange-600 font-bold">{stats.streak} dias seguidos</span>
            </div>
          </div>
          
          {/* Informação sobre como completar meta */}
          <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-800 font-medium">
              🎯 Para completar sua meta semanal:
            </p>
            <p className="text-xs text-orange-600 mt-1">
              Registre atividades nas brincadeiras para ganhar pontos!
            </p>
          </div>
        </div>
      </div>


      

      {/* Histórico de Atividades */}
      <div className="card bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <ActivityHistory 
          activities={getActivityHistory()} 
          maxItems={3}
        />
      </div>


      {/* Modal de Edição Personalizado */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-slide-up">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <Palette size={20} className="text-primary-500" />
              <span>Personalizar Meu Perfil</span>
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meu Nome
                </label>
                <input
                  type="text"
                  value={editingChild.name || ''}
                  onChange={(e) => setEditingChild(prev => ({ ...prev, name: e.target.value }))}
                  className="input border-2 border-primary-200 focus:border-primary-500"
                  placeholder="Digite seu nome"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minha Idade
                </label>
                <select
                  value={editingChild.age || ''}
                  onChange={(e) => setEditingChild(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                  className="input border-2 border-primary-200 focus:border-primary-500"
                >
                  <option value="">Escolha sua idade</option>
                  {[2, 3, 4, 5, 6, 7, 8].map(age => (
                    <option key={age} value={age}>
                      {age} anos
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meu Avatar Especial
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {avatarOptions.map(avatar => (
                    <button
                      key={avatar}
                      onClick={() => setEditingChild(prev => ({ ...prev, avatar }))}
                      className={`p-3 rounded-xl text-2xl transition-all hover:scale-110 ${
                        editingChild.avatar === avatar
                          ? 'bg-primary-500 scale-110 shadow-lg'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveChild}
                className="flex-1 btn-primary font-bold"
              >
                Salvar! 🎉
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}

export default ProfilePage



