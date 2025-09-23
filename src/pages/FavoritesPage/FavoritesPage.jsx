import React, { useState, useEffect } from 'react'
import { Heart, Filter, Search, Trash2, Play } from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import ActivityCard from '../../components/ActivityCard/ActivityCard'
import CartoonCard from '../../components/CartoonCard/CartoonCard'
import toast from 'react-hot-toast'

const FavoritesPage = () => {
  const { favorites, loadFavorites, removeFromFavorites, activities, cartoons, setFavorites } = useAppStore()
  
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredFavorites, setFilteredFavorites] = useState([])

  const tabs = [
    { id: 'all', label: 'Todos', icon: Heart },
    { id: 'activity', label: 'Brincadeiras', icon: '🎯' },
    { id: 'cartoon', label: 'Desenhos', icon: '📺' }
  ]

  useEffect(() => {
    loadFavorites()
  }, [loadFavorites])

  useEffect(() => {
    filterFavorites()
  }, [favorites, activeTab, searchTerm])

  const filterFavorites = () => {
    let filtered = [...favorites]

    // Filtro por tipo
    if (activeTab !== 'all') {
      filtered = filtered.filter(fav => fav.type === activeTab)
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(fav => {
        const item = fav.activities || fav.cartoons
        if (item) {
          return item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 item.description?.toLowerCase().includes(searchTerm.toLowerCase())
        }
        return false
      })
    }

    // Ordenar por data de adição (mais recentes primeiro)
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    setFilteredFavorites(filtered)
  }

  const handleRemoveFavorite = async (type, itemId) => {
    // Atualização otimista: remove imediatamente da tela e do store
    const key = type === 'activity' ? 'activity_id' : 'cartoon_id'
    const prevFavorites = [...favorites]
    const optimisticallyFiltered = prevFavorites.filter(f => !(f.type === type && (f[key] === itemId)))
    setFavorites(optimisticallyFiltered)
    setFilteredFavorites(prev => prev.filter(f => !(f.type === type && ((f.activity_id || f.cartoon_id) === itemId))))

    try {
      const { error } = await removeFromFavorites(type, itemId)
      if (error) throw error
      toast.success('Removido dos favoritos')
    } catch (error) {
      // Reverter em caso de falha
      await loadFavorites()
      setFilteredFavorites(prev => prev)
      toast.error('Erro ao remover favorito')
    }
  }

  const getFavoriteStats = () => {
    const activities = favorites.filter(f => f.type === 'activity').length
    const cartoons = favorites.filter(f => f.type === 'cartoon').length
    
    return { activities, cartoons, total: activities + cartoons }
  }

  const stats = getFavoriteStats()

  const EmptyState = ({ type }) => {
    const messages = {
      all: {
        icon: '💝',
        title: 'Nenhum favorito ainda',
        description: 'Explore brincadeiras e desenhos para adicionar aos seus favoritos!'
      },
      activity: {
        icon: '🎯',
        title: 'Nenhuma brincadeira favoritada',
        description: 'Encontre atividades incríveis e salve as que mais gosta!'
      },
      cartoon: {
        icon: '📺',
        title: 'Nenhum desenho favoritado',
        description: 'Descubra desenhos educativos e divertidos para sua criança!'
      }
    }

    const message = messages[type] || messages.all

    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-6xl mb-4">{message.icon}</div>
        <h3 className="text-lg font-medium mb-2">{message.title}</h3>
        <p className="text-sm mb-6">{message.description}</p>
        <div className="space-y-2">
          {type !== 'cartoon' && (
            <button
              onClick={() => window.location.href = '/activities'}
              className="btn-primary mx-2"
            >
              Explorar Brincadeiras
            </button>
          )}
          {type !== 'activity' && (
            <button
              onClick={() => window.location.href = '/cartoons'}
              className="btn-secondary mx-2"
            >
              Ver Desenhos
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="container-app py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
          <Heart className="text-red-500 fill-red-500" size={28} />
          <span>Meus Favoritos</span>
        </h1>
        <p className="text-gray-600 text-sm">
          {stats.total} {stats.total === 1 ? 'item salvo' : 'itens salvos'}
        </p>
      </div>

      {/* Estatísticas */}
      {stats.total > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-2xl mb-2">💝</div>
            <div className="text-lg font-bold text-gray-800">{stats.total}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-lg font-bold text-gray-800">{stats.activities}</div>
            <div className="text-xs text-gray-600">Brincadeiras</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl mb-2">📺</div>
            <div className="text-lg font-bold text-gray-800">{stats.cartoons}</div>
            <div className="text-xs text-gray-600">Desenhos</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
        {tabs.map(tab => {
          const Icon = typeof tab.icon === 'string' ? null : tab.icon
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-primary-500 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {Icon ? <Icon size={18} /> : <span className="text-lg">{tab.icon}</span>}
              <span className="text-sm">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Busca */}
      {stats.total > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar nos favoritos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-12 pr-4"
          />
        </div>
      )}

      {/* Lista de Favoritos */}
      {filteredFavorites.length > 0 ? (
        <div className="space-y-4">
          {filteredFavorites.map(favorite => {
            let item = favorite.activities || favorite.cartoons
            // Fallback: quando não veio expandido do backend, achar pelo id localmente
            if (!item) {
              if (favorite.type === 'activity') {
                item = activities.find(a => a.id === (favorite.activity_id || favorite.activities?.id))
              } else if (favorite.type === 'cartoon') {
                item = cartoons.find(c => c.id === (favorite.cartoon_id || favorite.cartoons?.id))
              }
            }
            
            if (!item) return null

            return (
              <div key={`${favorite.type}-${favorite.activity_id || favorite.cartoon_id}`} className="relative group">
                {/* Botão de remoção */}
                <button
                  onClick={() => handleRemoveFavorite(
                    favorite.type, 
                    favorite.activity_id || favorite.cartoon_id
                  )}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-all transform hover:scale-110"
                  title="Remover dos favoritos"
                >
                  <Trash2 size={16} />
                </button>

                {/* Card do item */}
                {favorite.type === 'activity' ? (
                  <ActivityCard activity={item} />
                ) : (
                  <div className="card group cursor-pointer" onClick={() => {
                    if (item.video_url) {
                      window.open(item.video_url, '_blank')
                    }
                  }}>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center text-2xl">
                        📺
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                          {item.description || 'Desenho animado educativo'}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>
                            {item.min_age && item.max_age 
                              ? `${item.min_age}-${item.max_age} anos`
                              : 'Todas as idades'
                            }
                          </span>
                          {item.duration && (
                            <span>{item.duration} min</span>
                          )}
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={20} className="text-primary-500" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Data de adição */}
                {favorite.created_at && (
                  <div className="mt-2 text-xs text-gray-400 text-right">
                    Adicionado em {new Date(favorite.created_at).toLocaleDateString('pt-BR')}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState type={activeTab} />
      )}

      {/* Dica */}
      {stats.total > 0 && (
        <div className="card bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">💡</div>
            <div>
              <h4 className="font-medium text-pink-800 mb-1">Dica</h4>
              <p className="text-pink-700 text-sm">
                Seus favoritos ficam salvos mesmo quando você está offline! 
                Perfeito para momentos sem internet.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Seção de exportar favoritos */}
      {stats.total > 5 && (
        <div className="card border-l-4 border-l-blue-400 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-800 mb-1">
                Compartilhar Lista de Favoritos
              </h4>
              <p className="text-blue-700 text-sm">
                Que tal compartilhar suas atividades favoritas com outros pais?
              </p>
            </div>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              onClick={() => toast.success('Funcionalidade em desenvolvimento! 🚧')}
            >
              Compartilhar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FavoritesPage















