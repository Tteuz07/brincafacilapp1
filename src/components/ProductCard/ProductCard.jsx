import React from 'react'
import { Star, Heart, Play } from 'lucide-react'

const ProductCard = ({ product, onClick, isFavorited, onToggleFavorite }) => {
  const handleFavoriteToggle = (e) => {
    e.stopPropagation()
    if (onToggleFavorite) {
      onToggleFavorite()
    }
  }

  const handleCardClick = () => {
    if (onClick) {
      onClick(product)
    }
  }

  const getAgeRangeText = () => {
    if (product.min_age && product.max_age) {
      return `${product.min_age}-${product.max_age} anos`
    } else if (product.min_age) {
      return `${product.min_age}+ anos`
    }
    return 'Todas as idades'
  }

  const getCategoryEmoji = () => {
    const categoryEmojis = {
      educational: '🧠',
      creative: '🎨',
      physical: '🏃',
      building: '🧱',
      musical: '🎵',
      outdoor: '🌳'
    }
    return categoryEmojis[product.category] || '🎯'
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer transform hover:scale-105 border border-gray-100"
    >
      {/* Header com imagem */}
      <div className="relative">
        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {getCategoryEmoji()}
            </div>
          )}
          
          {/* Badge de desconto */}
          {product.discount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
              -{product.discount}%
            </div>
          )}
          
          {/* Badge de categoria */}
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
            {product.badge || 'DESTAQUE'}
          </div>
          
          {/* Indicador de vídeo */}
          {product.video_url && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center space-x-1">
              <Play size={12} />
              <span>Vídeo</span>
            </div>
          )}
          
          {/* Botão de favorito */}
          <button
            onClick={handleFavoriteToggle}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
          >
            <Heart 
              size={16} 
              className={isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-400'} 
            />
          </button>
        </div>
      </div>

      {/* Informações do produto */}
      <div className="p-3">
        {/* Nome do produto */}
        <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* Rating e faixa etária */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="font-medium text-xs text-gray-600">{product.rating}</span>
            <span className="text-gray-400 text-xs">({product.reviews})</span>
          </div>
          <span className="text-gray-500 text-xs">
            {getAgeRangeText()}
          </span>
        </div>

        {/* Preços */}
        <div className="mb-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Call to action */}
        <div className="flex items-center justify-between">
          <div className="text-gray-600 text-xs">
            <span className="font-medium">Ver detalhes</span>
          </div>
          
          <div className="text-blue-500 text-xs font-medium">
            →
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard