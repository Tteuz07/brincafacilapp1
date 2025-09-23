import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Clock, Users, Star, CheckCircle, AlertCircle, Lightbulb, Plus } from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import toast from 'react-hot-toast'
import { ActivityRegistrationModal } from '../../components/ActivityRegistrationModal/ActivityRegistrationModal'

const ActivityDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { activities, addToFavorites, removeFromFavorites, isFavorite } = useAppStore()
  
  const [activity, setActivity] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)

  const isActivityFavorited = activity ? isFavorite('activity', activity.id) : false

  useEffect(() => {
    if (activities.length > 0) {
      const foundActivity = activities.find(a => a.id === parseInt(id))
      setActivity(foundActivity)
      setIsLoading(false)
      
      if (!foundActivity) {
        toast.error('Atividade não encontrada')
        navigate('/activities')
      }
    }
  }, [id, activities, navigate])

  const handleFavoriteToggle = async () => {
    if (!activity) return
    
    try {
      if (isActivityFavorited) {
        await removeFromFavorites('activity', activity.id)
        toast.success('Removido dos favoritos')
      } else {
        await addToFavorites('activity', activity.id)
        toast.success('Adicionado aos favoritos! ❤️')
      }
    } catch (error) {
      toast.error('Erro ao atualizar favoritos')
    }
  }

  const toggleStepCompletion = (stepIndex) => {
    setCompletedSteps(prev => 
      prev.includes(stepIndex)
        ? prev.filter(i => i !== stepIndex)
        : [...prev, stepIndex]
    )
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

  // Mapear categorias da brincadeira para áreas de desenvolvimento
  const getDevelopmentArea = (categories) => {
    if (!categories || categories.length === 0) return 'cognitive'
    
    const categoryMap = {
      // Coordenação motora
      'coordenação': 'motor',
      'physical': 'motor',
      'outdoor': 'motor',
      'fine-motor': 'motor',
      'coordination': 'motor',
      
      // Desenvolvimento cognitivo
      'memória': 'cognitive',
      'educational': 'cognitive',
      'logic': 'cognitive',
      'problem-solving': 'cognitive',
      'spatial': 'cognitive',
      'strategic': 'cognitive',
      'mathematical': 'cognitive',
      'memory': 'cognitive',
      'observation': 'cognitive',
      'sequential': 'cognitive',
      
      // Desenvolvimento social
      'social': 'social',
      'socialization': 'social',
      'group': 'social',
      'team': 'social',
      'traditional': 'social',
      
      // Desenvolvimento emocional
      'creative': 'emotional',
      'artistic': 'emotional',
      'musical': 'emotional',
      'quiet': 'emotional',
      'relaxing': 'emotional',
      'entertainment': 'emotional'
    }
    
    // Procurar por categorias que mapeiam para áreas específicas
    for (const category of categories) {
      if (categoryMap[category]) {
        return categoryMap[category]
      }
    }
    
    // Fallback baseado na primeira categoria
    return 'cognitive'
  }

  const handleRegisterActivity = async (activityData) => {
    try {
      const { recordActivityFromCard } = useAppStore.getState()
      const area = getDevelopmentArea(activity.categories)
      
      const result = await recordActivityFromCard(activity.id, area, activityData)
      
      // Mostrar feedback de sucesso
      toast.success(`Atividade registrada! +${result.points} pontos para ${area}`)
      
      // Fechar modal
      setShowRegistrationModal(false)
      
    } catch (error) {
      console.error('Erro ao registrar atividade:', error)
      toast.error('Erro ao registrar atividade')
    }
  }

  // Função para extrair thumbnail do YouTube (suporta vídeos regulares e Shorts)
  const getYouTubeThumbnail = (url) => {
    if (!url) return null
    
    // Regex que captura vídeos regulares, shorts e outros formatos
    const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&\n?#]+)/
    const match = url.match(regex)
    
    if (match && match[1]) {
      const videoId = match[1]
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    }
    
    return null
  }

  if (isLoading) {
    return (
      <div className="container-app py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="container-app py-6 text-center">
        <div className="text-6xl mb-4">🤔</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Atividade não encontrada
        </h2>
        <p className="text-gray-600 mb-6">
          A atividade que você procura não existe ou foi removida.
        </p>
        <button
          onClick={() => navigate('/activities')}
          className="btn-primary"
        >
          Ver todas as atividades
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Elementos decorativos sutis */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-8"></div>
      {/* Header com Imagem de Fundo - APENAS IMAGEM */}
      <div className="relative h-72 overflow-hidden rounded-b-3xl shadow-2xl">
        {/* Imagem de fundo */}
        <div className="absolute inset-0">
          {(activity.image_url || activity.image) ? (
            <img 
              src={activity.image_url || activity.image} 
              alt={activity.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 flex items-center justify-center">
              <div className="text-8xl animate-bounce-soft filter drop-shadow-lg">
                {getCategoryEmoji(activity.categories)}
              </div>
            </div>
          )}
          {/* Overlay sutil apenas para os botões */}
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Controles do header */}
        <div className="absolute top-6 left-4 right-4 flex items-center justify-between z-10">
          <button
            onClick={() => navigate(-1)}
            className="p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all shadow-lg"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          
          <button
            onClick={handleFavoriteToggle}
            className="p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all shadow-lg"
          >
            <Heart 
              size={20} 
              className={isActivityFavorited ? 'text-red-300 fill-red-300' : 'text-white'} 
            />
          </button>
        </div>

      </div>

      {/* CONTEÚDO PRINCIPAL - DESIGN ULTRA-MODERNO */}
      <div className="container-app -mt-8 relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 mb-6 relative overflow-hidden">
          {/* Elementos decorativos */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-tr from-pink-100 to-yellow-100 rounded-full blur-2xl opacity-40"></div>
          
          {/* Tags de categoria - MODERNAS COM GRADIENTES */}
          <div className="flex flex-wrap gap-3 mb-5 relative z-10">
            {activity.categories && activity.categories.map((category, index) => {
              const gradients = [
                'bg-gradient-to-r from-blue-500 to-cyan-500',
                'bg-gradient-to-r from-purple-500 to-pink-500', 
                'bg-gradient-to-r from-green-500 to-emerald-500',
                'bg-gradient-to-r from-orange-500 to-red-500',
                'bg-gradient-to-r from-indigo-500 to-purple-500'
              ];
              return (
                <span 
                  key={category} 
                  className={`px-4 py-2 rounded-2xl text-xs font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ${gradients[index % gradients.length]}`}
                >
                  {getCategoryLabel(category)}
                </span>
              );
            })}
          </div>

          {/* Título com gradiente - SEGUNDO */}
          <h1 className="text-3xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4 leading-tight relative z-10">
            {activity.title}
          </h1>
          
          {/* Rating moderno - TERCEIRO */}
          <div className="flex items-center space-x-4 mb-5 relative z-10">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 rounded-2xl border border-amber-200 shadow-md">
              <div className="w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <Star size={14} className="text-white fill-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">{activity.rating || '4.5'}</span>
              <span className="text-amber-600 text-sm font-medium">Avaliação</span>
            </div>
            
            {/* Badge de dificuldade moderno */}
            {activity.difficulty && (
              <span className={`px-4 py-2 rounded-2xl text-sm font-bold shadow-lg border-2 border-white/50 ${getDifficultyColor(activity.difficulty)}`}>
                {getDifficultyLabel(activity.difficulty)}
              </span>
            )}
          </div>

          {/* Descrição moderna */}
          <div className="relative z-10">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-5 border border-gray-200 shadow-inner">
              <p className="text-gray-700 leading-relaxed text-base">
                {activity.description}
              </p>
            </div>
          </div>
        </div>
      </div>

            {/* Stats Cards Ultra-Modernos */}
      <div className="container-app -mt-6">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-5 relative overflow-hidden">
          {/* Fundo decorativo */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-pink-50/50"></div>
          
          <div className="grid grid-cols-3 gap-1 relative z-10">
            {/* Duração */}
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Clock size={20} className="text-white" />
              </div>
              <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{activity.duration || '15'}</div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">MIN</div>
              <div className="text-xs text-blue-500 mt-1 font-medium">Duração</div>
            </div>
            
            {/* Participantes */}
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users size={20} className="text-white" />
              </div>
              <div className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{activity.participants || '1-2'}</div>
              <div className="text-xs font-bold text-green-600 uppercase tracking-wider">PESSOAS</div>
              <div className="text-xs text-green-500 mt-1 font-medium">Participantes</div>
            </div>
            
            {/* Avaliação */}
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Star size={20} className="text-white" />
              </div>
              <div className="text-2xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">{activity.rating || '4.5'}</div>
              <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">ESTRELAS</div>
              <div className="text-xs text-amber-500 mt-1 font-medium">Avaliação</div>
            </div>
          </div>
        </div>
      </div>

      {/* Seções Adicionais Ultra-Modernas */}
      <div className="container-app -mt-4 space-y-3">
        {/* Vídeo Demonstrativo */}
        {activity.video_url && (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
            {/* Fundo decorativo animado */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-full blur-2xl opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-gradient-to-tr from-purple-100 to-blue-100 rounded-full blur-xl opacity-40"></div>
            
            <div className="flex items-center space-x-4 mb-5 relative z-10">
              <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-3xl">🎬</span>
              </div>
              <div>
                <h2 className="text-xl font-black bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">Vídeo Demonstrativo</h2>
                <p className="text-sm text-red-500 font-medium">Veja como fazer esta brincadeira</p>
              </div>
            </div>
            
            {/* Card do Vídeo */}
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden relative group cursor-pointer"
                   onClick={() => window.open(activity.video_url, '_blank')}>
                {/* Thumbnail do YouTube */}
                {getYouTubeThumbnail(activity.video_url) ? (
                  <img 
                    src={getYouTubeThumbnail(activity.video_url)}
                    alt="Thumbnail do vídeo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback para o gradiente caso a thumbnail não carregue
                      e.target.style.display = 'none'
                      e.target.nextElementSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                
                {/* Fallback gradiente (escondido por padrão) */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-400 via-pink-500 to-purple-600 items-center justify-center" 
                     style={{ display: getYouTubeThumbnail(activity.video_url) ? 'none' : 'flex' }}>
                  <div className="text-center">
                    <p className="text-white font-bold text-lg mb-2">Vídeo Demonstrativo</p>
                    <p className="text-white/80 text-sm">Clique para assistir</p>
                  </div>
                </div>
                
                {/* Overlay do botão play */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                    </svg>
                  </div>
                </div>
                
                {/* Badge do vídeo */}
                <div className="absolute top-4 right-4 bg-red-600/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-white text-xs font-medium">🎥 Vídeo</span>
                </div>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Botão adicional para mobile */}
              <button
                onClick={() => window.open(activity.video_url, '_blank')}
                className="mt-4 w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                </svg>
                <span>Assistir Demonstração</span>
              </button>
            </div>
            
            {/* Elementos decorativos */}
            <div className="absolute top-6 right-6 text-red-100/20 text-3xl animate-pulse">🎬</div>
            <div className="absolute bottom-6 left-6 text-pink-100/20 text-2xl animate-bounce-soft">📹</div>
          </div>
        )}

        {/* Materiais Necessários Ultra-Moderno */}
        {activity.materials && activity.materials.length > 0 && (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
            {/* Elementos decorativos */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-3 -left-3 w-20 h-20 bg-gradient-to-tr from-green-100 to-emerald-100 rounded-full blur-2xl opacity-60"></div>
            
            <div className="flex items-center space-x-4 mb-6 relative z-10">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-3xl">📦</span>
              </div>
              <div>
                <h2 className="text-xl font-black bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">Materiais Necessários</h2>
                <p className="text-sm text-orange-500 font-medium">O que você vai precisar</p>
              </div>
            </div>
            
            <div className="grid gap-4 relative z-10">
              {activity.materials.map((material, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-2xl border border-green-200/50 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle size={18} className="text-white" />
                  </div>
                  <span className="text-gray-800 font-semibold text-base">{material}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Como Fazer */}
        {activity.how_to_make && activity.how_to_make.length > 0 && (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
            {/* Fundo decorativo */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-2xl opacity-50"></div>
            <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-tr from-blue-100 to-cyan-100 rounded-full blur-xl opacity-40"></div>
            
            <div className="flex items-center space-x-4 mb-6 relative z-10">
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-3xl">🔧</span>
              </div>
              <div>
                <h2 className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Como Fazer</h2>
                <p className="text-sm text-indigo-500 font-medium">Passo a passo para criar os materiais</p>
              </div>
            </div>
            <div className="space-y-4 relative z-10">
              {activity.how_to_make.map((step, index) => (
                <div key={index} className="flex items-start space-x-4 p-5 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 backdrop-blur-sm rounded-2xl border border-indigo-200/50 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-base">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium leading-relaxed">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instruções Passo a Passo */}
        {activity.instructions && activity.instructions.length > 0 && (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
            {/* Fundo decorativo */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-3 -left-3 w-20 h-20 bg-gradient-to-tr from-pink-100 to-red-100 rounded-full blur-2xl opacity-40"></div>
            
            <div className="flex items-center space-x-4 mb-6 relative z-10">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-3xl">📋</span>
              </div>
              <div>
                <h2 className="text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Como Brincar</h2>
                <p className="text-sm text-blue-500 font-medium">Siga os passos para se divertir</p>
              </div>
            </div>

            {/* Barra de progresso ultra-moderna */}
            <div className="mb-6 p-5 bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm rounded-3xl border border-purple-200/50 shadow-lg relative z-10">
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="font-black text-purple-800">Progresso da Brincadeira</span>
                <span className="text-purple-600 font-bold">
                  {completedSteps.length} de {activity.instructions.length} passos
                </span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${(completedSteps.length / activity.instructions.length) * 100}%` 
                  }}
                ></div>
              </div>
              {completedSteps.length === activity.instructions.length && (
                <div className="mt-2 text-center">
                  <span className="text-purple-700 text-sm font-medium">🎉 Parabéns! Você completou todos os passos!</span>
                </div>
              )}
            </div>

            {/* Botão de Registro de Atividade */}
            <div className="mb-6 text-center">
              <button
                onClick={() => setShowRegistrationModal(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 mx-auto"
              >
                <Plus size={24} />
                <span className="text-lg">Registrar que Brincou</span>
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Clique aqui para registrar que a criança brincou e ganhar pontos de desenvolvimento
              </p>
            </div>

            <div className="space-y-4">
              {activity.instructions.map((instruction, index) => (
                <div 
                  key={index}
                  className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                    completedSteps.includes(index)
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg'
                      : 'bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 hover:border-primary-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start space-x-4 p-4">
                    <button
                      onClick={() => toggleStepCompletion(index)}
                      className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
                        completedSteps.includes(index)
                          ? 'bg-green-500 border-green-500 shadow-lg'
                          : 'border-gray-300 hover:border-primary-500 bg-white hover:bg-primary-50'
                      }`}
                    >
                      {completedSteps.includes(index) ? (
                        <CheckCircle size={20} className="text-white" />
                      ) : (
                        <span className="text-gray-400 font-bold text-sm">{index + 1}</span>
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`text-sm font-bold ${
                          completedSteps.includes(index) ? 'text-green-700' : 'text-primary-600'
                        }`}>
                          Passo {index + 1}
                        </span>
                        {completedSteps.includes(index) && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            ✓ Concluído
                          </span>
                        )}
                      </div>
                      <p className={`text-base leading-relaxed ${
                        completedSteps.includes(index) ? 'text-green-800 font-medium' : 'text-gray-700'
                      }`}>
                        {instruction}
                      </p>
                    </div>
                  </div>
                  
                  {/* Efeito visual quando completo */}
                  {completedSteps.includes(index) && (
                    <div className="absolute top-2 right-2">
                      <span className="text-2xl animate-bounce">🎉</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Variações */}
        {activity.variations && activity.variations.length > 0 && (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔄</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Variações</h2>
                <p className="text-sm text-gray-500">Outras formas de brincar</p>
              </div>
            </div>
            <div className="space-y-4">
              {activity.variations.map((variation, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Lightbulb size={16} className="text-white" />
                    </div>
                    <p className="text-gray-800 font-medium leading-relaxed">{variation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dicas de Segurança */}
        {activity.safety_tips && activity.safety_tips.length > 0 && (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Dicas de Segurança</h2>
                <p className="text-sm text-gray-500">Para brincar com segurança</p>
              </div>
            </div>
            <div className="space-y-4">
              {activity.safety_tips.map((tip, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertCircle size={16} className="text-white" />
                    </div>
                    <p className="text-gray-800 font-medium leading-relaxed">{tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Benefícios para o Cérebro */}
        {activity.brain_benefits && activity.brain_benefits.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 relative overflow-hidden">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🧠</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Benefícios para o Cérebro</h2>
                <p className="text-sm text-gray-500">Como esta brincadeira desenvolve seu filho</p>
              </div>
            </div>
            
            {/* Banner informativo */}
            <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-100">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">🎯</span>
                <h3 className="font-bold text-pink-800">Desenvolvimento Científico Comprovado</h3>
              </div>
              <p className="text-pink-700 text-sm">
                Cada benefício listado é baseado em neurociência infantil e estudos sobre desenvolvimento cognitivo.
              </p>
            </div>
            
            <div className="grid gap-4">
              {activity.brain_benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl border border-pink-100 relative overflow-hidden">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">🧠</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium leading-relaxed">{benefit}</p>
                  </div>
                  
                  {/* Efeito de destaque */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>
            
            {/* Footer informativo */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100">
              <div className="flex items-center space-x-2 text-purple-700">
                <span className="text-sm">💡</span>
                <p className="text-sm font-medium">
                  <strong>Dica:</strong> Pratique esta atividade regularmente para maximizar os benefícios no desenvolvimento cerebral!
                </p>
              </div>
            </div>
            
            {/* Elementos decorativos */}
            <div className="absolute top-6 right-6 text-pink-100/30 text-3xl animate-pulse">✨</div>
            <div className="absolute bottom-6 left-6 text-purple-100/30 text-2xl animate-bounce-soft">🎓</div>
          </div>
        )}

        {/* Botão de Conclusão */}
        {completedSteps.length === activity.instructions?.length && activity.instructions?.length > 0 && (
          <div className="bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 rounded-3xl shadow-2xl p-8 text-white text-center relative overflow-hidden">
            {/* Elementos decorativos de fundo */}
            <div className="absolute inset-0 bg-white/10 rounded-3xl"></div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h3 className="text-2xl font-bold mb-3">Parabéns!</h3>
              <p className="text-green-100 text-lg mb-6 leading-relaxed">
                Vocês concluíram a brincadeira<br/>
                <span className="font-bold text-white">"{activity.title}"!</span>
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/activities')}
                  className="bg-white text-green-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-50 transition-all transform hover:scale-105 shadow-xl"
                >
                  Escolher nova brincadeira 🎯
                </button>
                <div className="flex items-center justify-center space-x-4 text-green-100">
                  <span>⭐ Brincadeira concluída</span>
                  <span>•</span>
                  <span>🏆 Missão cumprida</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Registro de Atividade */}
        <ActivityRegistrationModal
          isOpen={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
          area={getDevelopmentArea(activity.categories)}
          activity={activity.title}
          onRegister={handleRegisterActivity}
        />
      </div>
    </div>
  )
}

export default ActivityDetailPage

