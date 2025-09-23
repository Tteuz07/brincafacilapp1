import React, { useState, useEffect } from 'react'
import { X, Star, Clock, Users, Heart, Play, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import useAppStore from '../../store/useAppStore'

const CartoonModal = ({ cartoon, isOpen, onClose }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useAppStore()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const isCartoonFavorited = isFavorite('cartoon', cartoon?.id)

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
      // Prevenir scroll do body quando modal está aberto
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !cartoon) return null

  const handleFavoriteToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isCartoonFavorited) {
      await removeFromFavorites('cartoon', cartoon.id)
    } else {
      await addToFavorites('cartoon', cartoon.id)
    }
  }

  const getAgeRangeText = () => {
    if (cartoon.min_age && cartoon.max_age) {
      return `${cartoon.min_age}-${cartoon.max_age} anos`
    } else if (cartoon.min_age) {
      return `${cartoon.min_age}+ anos`
    } else if (cartoon.max_age) {
      return `até ${cartoon.max_age} anos`
    }
    return 'Todas as idades'
  }

  const getCategoryText = () => {
    const categories = {
      educational: 'Educativo',
      entertainment: 'Entretenimento',
      creative: 'Criativo',
      calm: 'Relaxante'
    }
    return categories[cartoon.category] || cartoon.category
  }

  const images = cartoon.gallery || [cartoon.thumbnail_url || cartoon.image]
  const currentImage = images[currentImageIndex]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleWatchClick = () => {
    // Tentar usar a primeira plataforma com URL disponível
    if (cartoon.watch_platforms) {
      const platformWithUrl = cartoon.watch_platforms.find(platform => platform.url)
      if (platformWithUrl) {
        window.open(platformWithUrl.url, '_blank')
        return
      }
    }
    
    // Fallback para video_url
    if (cartoon.video_url) {
      window.open(cartoon.video_url, '_blank')
    }
  }

  const handleBackdropClick = (e) => {
    // Fechar modal ao clicar no fundo
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleCloseClick = () => {
    console.log('Botão fechar clicado') // Debug temporário
    onClose()
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header com botão fechar */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">{cartoon.title}</h2>
          <button
            onClick={handleCloseClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors z-10 relative"
            type="button"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Galeria de Imagens */}
        <div className="relative">
          <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 relative overflow-hidden">
            {currentImage ? (
              <img 
                src={currentImage} 
                alt={cartoon.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">📺</div>
            )}
            
            {/* Controles da galeria */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                >
                  <ChevronLeft size={20} className="text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                >
                  <ChevronRight size={20} className="text-gray-700" />
                </button>
                
                {/* Indicadores */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Botão de favorito */}
            <button
              onClick={handleFavoriteToggle}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
            >
              <Heart 
                size={20} 
                className={isCartoonFavorited ? 'text-red-500 fill-red-500' : 'text-gray-400'} 
              />
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {/* Metadados principais */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                {getCategoryText()}
              </span>
              <span className="text-gray-600">{getAgeRangeText()}</span>
              {cartoon.duration && (
                <div className="flex items-center space-x-1 text-gray-600">
                  <Clock size={16} />
                  <span>{cartoon.duration} min</span>
                </div>
              )}
            </div>
            
            {cartoon.rating && (
              <div className="flex items-center space-x-1">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="font-medium">{cartoon.rating}</span>
              </div>
            )}
          </div>

          {/* Descrição */}
          {cartoon.description && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Sobre o desenho</h3>
              <p className="text-gray-600 leading-relaxed">{cartoon.description}</p>
            </div>
          )}

          {/* Informações educativas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">🎯 Faixa Etária</h4>
              <p className="text-gray-600">{getAgeRangeText()}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">⏱️ Duração</h4>
              <p className="text-gray-600">{cartoon.duration ? `${cartoon.duration} minutos` : 'Variável'}</p>
            </div>
          </div>

          {/* Seção "Onde Assistir" */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">📺 Onde Assistir</h3>
            <div className="space-y-3">
              {cartoon.watch_platforms ? (
                cartoon.watch_platforms.map((platform, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (platform.url) {
                        window.open(platform.url, '_blank')
                      }
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors group ${
                      platform.url 
                        ? 'hover:shadow-md cursor-pointer' 
                        : 'cursor-default'
                    } ${
                      platform.type === 'free' 
                        ? 'bg-green-50 hover:bg-green-100' 
                        : platform.type === 'tv'
                        ? 'bg-blue-50 hover:bg-blue-100'
                        : 'bg-purple-50 hover:bg-purple-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                        platform.type === 'free' 
                          ? 'bg-green-500' 
                          : platform.type === 'tv'
                          ? 'bg-blue-500'
                          : 'bg-purple-500'
                      }`}>
                        <span className="text-white">{platform.icon}</span>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-800">{platform.name}</p>
                        <p className="text-sm text-gray-600">{platform.description}</p>
                        {platform.type === 'free' && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                            Gratuito
                          </span>
                        )}
                      </div>
                    </div>
                    {platform.url && (
                      <ExternalLink size={20} className={`${
                        platform.type === 'free' 
                          ? 'text-green-500 group-hover:text-green-600' 
                          : platform.type === 'tv'
                          ? 'text-blue-500 group-hover:text-blue-600'
                          : 'text-purple-500 group-hover:text-purple-600'
                      }`} />
                    )}
                  </button>
                ))
              ) : cartoon.video_url ? (
                <button
                  onClick={handleWatchClick}
                  className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                      <Play size={20} className="text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800">Assistir Online</p>
                      <p className="text-sm text-gray-600">Clique para assistir</p>
                    </div>
                  </div>
                  <ExternalLink size={20} className="text-red-500 group-hover:text-red-600" />
                </button>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📺</div>
                  <p className="text-sm">Informações de onde assistir em breve</p>
                </div>
              )}
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex space-x-3">
            <button
              onClick={handleWatchClick}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Play size={20} />
              <span>Assistir Agora</span>
            </button>
            
            <button
              onClick={handleFavoriteToggle}
              className={`px-4 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                isCartoonFavorited 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart size={20} className={isCartoonFavorited ? 'fill-current' : ''} />
              <span>{isCartoonFavorited ? 'Favorito' : 'Favoritar'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartoonModal
