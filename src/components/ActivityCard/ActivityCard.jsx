import React from 'react'
import { Link } from 'react-router-dom'
import { Clock, Users, Heart, Star } from 'lucide-react'
import useAppStore from '../../store/useAppStore'

const ActivityCard = ({ activity, compact = false }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useAppStore()
  const favorites = useAppStore(state => state.favorites)
  const setFavorites = useAppStore(state => state.setFavorites)
  
  const isActivityFavorited = isFavorite('activity', activity.id)

  
  // DEBUG: Log específico para Caça ao Tesouro Lógico
  if (activity.title === 'Caça ao Tesouro Lógico') {
    console.log('🏴‍☠️ DEBUG CAÇA AO TESOURO LÓGICO:', {
      title: activity.title,
      id: activity.id,
      image_url: activity.image_url,
      image: activity.image,
      hasImageUrl: !!activity.image_url,
      hasImage: !!activity.image,
      finalImageSrc: activity.image_url || activity.image,
      willShowImage: !!(activity.image_url || activity.image)
    })
    
    // Teste direto da imagem
    if (activity.image_url) {
      const img = new Image()
      img.onload = () => console.log('✅ IMAGEM TESOURO CARREGADA COM SUCESSO!')
      img.onerror = (e) => console.error('❌ ERRO AO CARREGAR IMAGEM TESOURO:', e)
      img.src = activity.image_url
    }
  }

  const handleFavoriteToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isActivityFavorited) {
      const res = await removeFromFavorites('activity', activity.id)
      if (res?.error) {
        console.error('Erro ao remover favorito:', res.error)
      }
    } else {
      const { error } = await addToFavorites('activity', activity.id)
      if (error) {
        console.error('Erro ao adicionar favorito:', error)
      }
    }
  }



  const getCategoryEmoji = (categories) => {
    if (!categories || categories.length === 0) return '🎯'
    
    const emojiMap = {
      creative: '🎨',
      physical: '🏃',
      quiet: '📚',
      outdoor: '🌳',
      indoor: '🏠',
      educational: '🧠',
      musical: '🎵',
      games: '🧩'
    }
    
    return emojiMap[categories[0]] || '🎯'
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'Fácil'
      case 'medium': return 'Médio'
      case 'hard': return 'Difícil'
      default: return 'Normal'
    }
  }

  const getCategoryLabel = (category) => {
    const categoryMap = {
      'creative': 'Criativa',
      'physical': 'Física',
      'quiet': 'Calma',
      'outdoor': 'Ar Livre',
      'indoor': 'Casa',
      'educational': 'Educativa',
      'musical': 'Musical',
      'games': 'Jogos',
      'mathematical': 'Matemática',
      'fine-motor': 'Motora Fina',
      'coordination': 'Coordenação',
      'competition': 'Competição',
      'logic': 'Lógica',
      'strategic': 'Estratégica',
      'concentration': 'Concentração',
      'problem-solving': 'Resolução',
      'colors': 'Cores',
      'traditional': 'Tradicional',
      'spatial': 'Espacial',
      'quick-thinking': 'Rápida',
      'energy': 'Energia',
      'motor': 'Motora',
      'learning': 'Aprendizado',
      'discovery': 'Descoberta',
      'observação': 'Observação',
      'observation': 'Observação',
      'art': 'Arte',
      'imagination': 'Imaginação',
      'criatividade': 'Criatividade',
      'casa': 'Casa',
      'quintal': 'Quintal',
      'relaxing': 'Relaxante',
      'meditation': 'Meditação',
      'música': 'Música',
      'music': 'Música',
      'active': 'Ativa',
      'energético': 'Energético',
      'curioso': 'Curioso',
      'criativo': 'Criativo',
      'tarde': 'Tarde',
      'afternoon': 'Tarde'
    }
    return categoryMap[category] || category
  }

  // Renderizar o card compacto
  if (compact) {
    return (
      <div>
        <Link 
          to={`/activities/${activity.id}`}
          className="block group"
          onClick={(e) => {
            // Se o clique foi no botão de favorito, não navegar
            if (e.target.closest('button[onClick*="handleFavoriteToggle"]') || 
                e.target.closest('button')?.classList.contains('absolute')) {
              e.preventDefault()
              e.stopPropagation()
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform group-hover:scale-105 relative overflow-hidden p-0">
            {/* Imagem da atividade */}
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-2xl overflow-hidden">
              {(activity.image_url || activity.image) ? (
                <img 
                  src={activity.image_url || activity.image} 
                  alt={activity.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onLoad={() => console.log(`✅ IMAGEM CARREGADA: ${activity.title} - ${activity.image_url || activity.image}`)}
                  onError={(e) => console.error(`❌ ERRO AO CARREGAR IMAGEM: ${activity.title} - ${activity.image_url || activity.image}`, e)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-primary-100 to-primary-200">
                  {getCategoryEmoji(activity.categories)}
                </div>
              )}
              
              {/* Overlay escuro para melhor legibilidade */}
              <div className="absolute inset-0 bg-black/20"></div>
              
              {/* Botão de favorito */}
              <button
                onClick={handleFavoriteToggle}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-lg"
                style={{ pointerEvents: 'auto' }}
              >
                <Heart 
                  size={16} 
                  className={isActivityFavorited ? 'text-red-500 fill-red-500' : 'text-gray-400'} 
                />
              </button>



              {/* Tags de dificuldade e categoria */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {/* Badge de dificuldade */}
                {activity.difficulty && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium shadow-lg ${getDifficultyColor(activity.difficulty)}`}>
                    {getDifficultyLabel(activity.difficulty)}
                  </span>
                )}
                
                {/* Badge Premium/Normal */}
                {activity.video_url ? (
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg flex items-center space-x-1">
                    <span>🎬</span>
                    <span>COM VÍDEO</span>
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg flex items-center space-x-1">
                    <span>📸</span>
                    <span>CLÁSSICA</span>
                  </span>
                )}
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-4">
              {/* Título */}
              <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 text-sm">
                {activity.title}
              </h3>

              {/* Info rápida */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Clock size={12} />
                    <span>{activity.duration || '15'}min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={12} />
                    <span>{activity.participants || '1'}+</span>
                  </div>
                </div>
                
                {activity.rating && (
                  <div className="flex items-center space-x-1">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-medium">{activity.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>


      </div>
    )
  }

  // Renderizar o card normal
  return (
    <div>
      <Link 
        to={`/activities/${activity.id}`}
        className="block group"
        onClick={(e) => {
          // Se o clique foi no botão de favorito, não navegar
          if (e.target.closest('button')?.classList.contains('absolute') ||
              e.target.closest('button')?.getAttribute('onClick')?.includes('handleFavoriteToggle')) {
            e.preventDefault()
            e.stopPropagation()
          }
        }}
      >
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform group-hover:scale-105 relative overflow-hidden p-0">
          {/* Imagem da atividade - LIMPA, SEM SOBREPOSIÇÕES */}
          <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-2xl overflow-hidden">
                          {(activity.image_url || activity.image) ? (
                <img 
                  src={activity.image_url || activity.image} 
                  alt={activity.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onLoad={() => console.log(`✅ IMAGEM CARREGADA: ${activity.title} - ${activity.image_url || activity.image}`)}
                  onError={(e) => console.error(`❌ ERRO AO CARREGAR IMAGEM: ${activity.title} - ${activity.image_url || activity.image}`, e)}
                />
              ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-primary-100 to-primary-200">
                {getCategoryEmoji(activity.categories)}
              </div>
            )}
            
            {/* Botão de favorito */}
            <button
              onClick={handleFavoriteToggle}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-md"
              style={{ pointerEvents: 'auto' }}
            >
              <Heart 
                size={18} 
                className={isActivityFavorited ? 'text-red-500 fill-red-500' : 'text-gray-400'} 
              />
            </button>


          </div>

          {/* CONTEÚDO ABAIXO DA IMAGEM - CONFORME SOLICITADO */}
          <div className="p-4">
            {/* 1. TAGS PRIMEIRO - educational, outdoor, physical */}
            <div className="flex flex-wrap gap-1 mb-3">
              {activity.categories && activity.categories.map(category => (
                <span key={category} className="px-2 py-1 rounded text-xs bg-gray-200 text-gray-700">
                  {getCategoryLabel(category)}
                </span>
              ))}
            </div>

            {/* 2. NOME da brincadeira */}
            <h3 className="font-bold text-gray-900 mb-2 text-base">
              {activity.title}
            </h3>

            {/* 3. NOTA (rating) */}
            {activity.rating && (
              <div className="flex items-center mb-2">
                <Star size={16} className="text-yellow-400 fill-yellow-400 mr-1" />
                <span className="text-sm font-medium text-gray-700">{activity.rating}</span>
              </div>
            )}

            {/* 4. DESCRIÇÃO */}
            <p className="text-gray-600 text-sm leading-relaxed">
              {activity.description}
            </p>
          </div>
        </div>
      </Link>


    </div>
  )
}

export default ActivityCard

