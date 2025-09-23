import React from 'react'
import { X, Star, Heart, ShoppingCart, Play, ExternalLink, CheckCircle } from 'lucide-react'

const ProductModal = ({ product, onClose, isFavorited, onToggleFavorite }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const getAgeRangeText = () => {
    if (product.min_age && product.max_age) {
      return `${product.min_age}-${product.max_age} anos`
    } else if (product.min_age) {
      return `${product.min_age}+ anos`
    }
    return 'Todas as idades'
  }

  const handleBuyClick = () => {
    if (product.affiliate_link) {
      window.open(product.affiliate_link, '_blank')
    }
  }

  const handleVideoClick = () => {
    if (product.video_url) {
      window.open(product.video_url, '_blank')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Detalhes do Produto</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {/* Imagem do produto */}
          <div className="relative mb-6">
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden relative">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">
                  🎯
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {product.discount && (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                    -{product.discount}%
                  </div>
                )}
                <div className="bg-primary-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                  {product.badge || 'DESTAQUE'}
                </div>
              </div>

              {/* Botão de favorito */}
              <button
                onClick={onToggleFavorite}
                className="absolute top-4 right-4 p-3 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
              >
                <Heart 
                  size={20} 
                  className={isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-400'} 
                />
              </button>
            </div>
          </div>

          {/* Informações principais */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {product.name}
            </h3>
            
            <p className="text-gray-600 mb-4">
              {product.description}
            </p>

            {/* Rating e faixa etária */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-medium text-gray-700">{product.rating}</span>
                  <span className="text-gray-500">({product.reviews} avaliações)</span>
                </div>
              </div>
              <span className="text-gray-600 font-medium">
                {getAgeRangeText()}
              </span>
            </div>

            {/* Preços */}
            <div className="mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.discount && (
                <p className="text-green-600 text-sm font-medium mt-1">
                  Você economiza {formatPrice(product.originalPrice - product.price)}!
                </p>
              )}
            </div>
          </div>

          {/* Características */}
          {product.features && product.features.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Características
              </h4>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefícios */}
          {product.benefits && product.benefits.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Benefícios para a Criança
              </h4>
              <ul className="space-y-2">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-blue-500" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Aviso sobre afiliados */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="text-blue-500 mt-0.5">
                <ExternalLink size={16} />
              </div>
              <div>
                <h5 className="font-medium text-blue-900 mb-1">
                  Link de Afiliado
                </h5>
                <p className="text-blue-700 text-sm">
                  Este produto contém um link de afiliado. Ao comprar através deste link, 
                  você ajuda a manter o BrincaFácil gratuito, sem custo adicional para você.
                </p>
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex space-x-3">
            <button
              onClick={handleBuyClick}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingCart size={20} />
              <span>Comprar Agora</span>
            </button>
            
            {product.video_url && (
              <button
                onClick={handleVideoClick}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <Play size={20} />
                <span>Ver Vídeo</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductModal