import React, { useState } from 'react'
import { Heart, Star, Clock, Play } from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import CartoonModal from '../CartoonModal/CartoonModal'

const CartoonCard = ({ cartoon, compact = false, onClick }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useAppStore()
  const favorites = useAppStore(state => state.favorites)
  const setFavorites = useAppStore(state => state.setFavorites)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const isCartoonFavorited = isFavorite('cartoon', cartoon.id)

  const handleFavoriteToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isCartoonFavorited) {
      const updated = favorites.filter(fav => !(fav.type === 'cartoon' && fav.cartoon_id === cartoon.id))
      setFavorites(updated)
      const res = await removeFromFavorites('cartoon', cartoon.id)
      if (res?.error) {
        useAppStore.getState().loadFavorites()
      }
    } else {
      const optimisticFav = { type: 'cartoon', cartoon_id: cartoon.id }
      setFavorites([optimisticFav, ...favorites])
      const { error } = await addToFavorites('cartoon', cartoon.id)
      if (error) {
        useAppStore.getState().loadFavorites()
      }
    }
  }

  const handleCardClick = () => {
    if (onClick) {
      onClick(cartoon)
    } else {
      setIsModalOpen(true)
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

  if (compact) {
    return (
      <div 
        onClick={handleCardClick}
        className="group cursor-pointer"
      >
        <div className="relative rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-200 transform group-hover:scale-105">
          {/* Thumbnail */}
          <div className="aspect-square bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center relative">
            {cartoon.thumbnail_url ? (
              <img 
                src={cartoon.thumbnail_url} 
                alt={cartoon.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-4xl">📺</div>
            )}
            
            {/* Play overlay */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white/90 rounded-full p-2">
                <Play size={20} className="text-primary-500" />
              </div>
            </div>

            {/* Botão de favorito */}
            <button
              onClick={handleFavoriteToggle}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
            >
              <Heart 
                size={14} 
                className={isCartoonFavorited ? 'text-red-500 fill-red-500' : 'text-gray-400'} 
              />
            </button>
          </div>

          {/* Info */}
          <div className="p-3">
            <h3 className="font-medium text-gray-800 text-sm line-clamp-2 mb-1">
              {cartoon.title}
            </h3>
            <p className="text-xs text-gray-500">
              {getAgeRangeText()}
            </p>
            
            {cartoon.rating && (
              <div className="flex items-center space-x-1 mt-1">
                <Star size={10} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-medium">{cartoon.rating}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        <CartoonModal 
          cartoon={cartoon}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    )
  }

  return (
    <div 
      onClick={handleCardClick}
      className="group cursor-pointer"
    >
      <div className="card hover:shadow-xl transition-all duration-200 transform group-hover:scale-105 relative overflow-hidden">
        {/* Botão de favorito */}
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
        >
          <Heart 
            size={20} 
            className={isCartoonFavorited ? 'text-red-500 fill-red-500' : 'text-gray-400'} 
          />
        </button>

        {/* Thumbnail */}
        <div className="relative h-40 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center rounded-xl mb-4 overflow-hidden">
          {cartoon.thumbnail_url ? (
            <img 
              src={cartoon.thumbnail_url} 
              alt={cartoon.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-6xl">📺</div>
          )}
          
          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/90 rounded-full p-3">
              <Play size={24} className="text-primary-500" />
            </div>
          </div>
        </div>

        {/* Informações */}
        <div>
          <h3 className="font-bold text-gray-800 mb-2 text-lg line-clamp-2">
            {cartoon.title}
          </h3>
          
          {cartoon.description && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {cartoon.description}
            </p>
          )}

          {/* Metadados */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <span>{getAgeRangeText()}</span>
            
            {cartoon.duration && (
              <div className="flex items-center space-x-1">
                <Clock size={16} />
                <span>{cartoon.duration} min</span>
              </div>
            )}
          </div>

          {/* Rating e categoria */}
          <div className="flex items-center justify-between">
            {cartoon.category && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {cartoon.category}
              </span>
            )}
            
            {cartoon.rating && (
              <div className="flex items-center space-x-1">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="font-medium">{cartoon.rating}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <CartoonModal 
        cartoon={cartoon}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default CartoonCard










