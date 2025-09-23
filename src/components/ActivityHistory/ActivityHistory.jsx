import React from 'react'
import { Calendar, Clock, Star, Camera, TrendingUp } from 'lucide-react'

export const ActivityHistory = ({ activities = [], maxItems = 5 }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">📝</div>
        <p className="text-sm">Nenhuma atividade registrada ainda</p>
        <p className="text-xs">Registre sua primeira brincadeira para começar!</p>
      </div>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Hoje'
    if (diffDays === 2) return 'Ontem'
    if (diffDays <= 7) return `${diffDays - 1} dias atrás`
    
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short' 
    })
  }

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      hard: 'bg-red-100 text-red-800 border-red-200'
    }
    return colors[difficulty] || colors.medium
  }

  const getFunLevelIcon = (funLevel) => {
    const icons = {
      boring: '😴',
      ok: '😐',
      fun: '🤩'
    }
    return icons[funLevel] || '😐'
  }

  const getAreaIcon = (area) => {
    const icons = {
      cognitive: '🧠',
      motor: '🏃',
      social: '👥',
      emotional: '❤️'
    }
    return icons[area] || '🎯'
  }

  const getAreaName = (area) => {
    const names = {
      cognitive: 'Cognitivo',
      motor: 'Motor',
      social: 'Social',
      emotional: 'Emocional'
    }
    return names[area] || 'Desenvolvimento'
  }

  const getAreaColor = (area) => {
    const colors = {
      cognitive: 'from-blue-500 to-cyan-500',
      motor: 'from-green-500 to-emerald-500',
      social: 'from-purple-500 to-pink-500',
      emotional: 'from-red-500 to-orange-500'
    }
    return colors[area] || 'from-gray-500 to-slate-500'
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
          <TrendingUp size={20} className="text-blue-500" />
          <span>Histórico de Atividades</span>
        </h3>
        <span className="text-sm text-gray-500">
          {activities.length} atividade{activities.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {activities.slice(0, maxItems).map((activity, index) => (
          <div key={activity.id || index} className="card hover:shadow-lg transition-shadow">
            {/* Header da Atividade */}
            <div className="flex items-start space-x-3 mb-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${getAreaColor(activity.area)} text-white text-sm font-medium`}>
                {getAreaIcon(activity.area)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-bold text-gray-800 text-sm truncate">
                    {activity.name}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {getAreaName(activity.area)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>{formatDate(activity.date)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock size={12} />
                    <span>{activity.duration}min</span>
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getDifficultyColor(activity.difficulty)}`}>
                    {activity.difficulty === 'easy' ? 'Fácil' : 
                     activity.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={`${
                      star <= activity.rating 
                        ? 'text-yellow-500 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Foto da Atividade */}
            {activity.photo && (
              <div className="mb-3">
                <img
                  src={activity.photo}
                  alt={`Foto da atividade ${activity.name}`}
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}

            {/* Comentário */}
            {activity.description && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 italic">
                  "{activity.description}"
                </p>
              </div>
            )}

            {/* Footer com Pontos e Diversão */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-500">
                  {getFunLevelIcon(activity.funLevel)} {activity.funLevel === 'fun' ? 'Muito Legal!' : 
                   activity.funLevel === 'ok' ? 'Ok' : 'Chato'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Ganhou</span>
                <span className="text-lg font-bold text-green-600">
                  +{activity.points} pontos
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botão para Ver Mais */}
      {activities.length > maxItems && (
        <div className="text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Ver mais {activities.length - maxItems} atividade{activities.length - maxItems !== 1 ? 's' : ''} →
          </button>
        </div>
      )}
    </div>
  )
}



