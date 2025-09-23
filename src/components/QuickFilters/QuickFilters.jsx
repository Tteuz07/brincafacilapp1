import React from 'react'
import { useNavigate } from 'react-router-dom'

const QuickFilters = () => {
  const navigate = useNavigate()

  const filters = [
    {
      id: 'indoor',
      label: 'Dentro de Casa',
      emoji: '🏠',
      color: 'from-blue-400 to-blue-500',
      description: 'Diversão em casa'
    },
    {
      id: 'quintal',
      label: 'No Quintal',
      emoji: '🌳',
      color: 'from-green-400 to-green-500',
      description: 'Para brincar no jardim'
    },
    {
      id: 'coordenação',
      label: 'Treinar Coordenação',
      emoji: '🎯',
      color: 'from-orange-400 to-orange-500',
      description: 'Desenvolver habilidades motoras'
    },
    {
      id: 'memória',
      label: 'Fortalecer Memória',
      emoji: '🧠',
      color: 'from-purple-400 to-purple-500',
      description: 'Exercitar a mente'
    }
  ]

  const handleFilterClick = (filterId) => {
    navigate(`/activities?filter=${filterId}`)
  }

  return (
    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        O que vamos fazer hoje? 🤔
      </h2>
      
      <div className="grid grid-cols-2 gap-3">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => handleFilterClick(filter.id)}
            className={`
              relative p-4 rounded-xl text-white font-medium text-left
              bg-gradient-to-br ${filter.color}
              shadow-lg hover:shadow-xl
              transition-all duration-200 transform hover:scale-105
              overflow-hidden group
            `}
          >
            {/* Elementos decorativos */}
            <div className="absolute top-2 right-2 text-2xl opacity-80">
              {filter.emoji}
            </div>
            <div className="absolute -bottom-2 -right-2 text-6xl opacity-10">
              {filter.emoji}
            </div>
            
            {/* Conteúdo */}
            <div className="relative z-10">
              <h3 className="font-bold mb-1 text-sm">
                {filter.label}
              </h3>
              <p className="text-xs opacity-90">
                {filter.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

export default QuickFilters










