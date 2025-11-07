import React, { useState, useEffect } from 'react'
import { Heart, Filter, Search, Trash2, Play, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '../../store/useAppStore'
import ActivityCard from '../../components/ActivityCard/ActivityCard'
import CartoonCard from '../../components/CartoonCard/CartoonCard'
import toast from 'react-hot-toast'

const FavoritesPage = () => {
  const navigate = useNavigate()
  const { favorites, loadFavorites, removeFromFavorites, activities, cartoons, setFavorites, loadActivities, loadCartoons } = useAppStore()
  
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredFavorites, setFilteredFavorites] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const tabs = [
    { id: 'all', label: 'Todos', icon: Heart },
    { id: 'activity', label: 'Brincadeiras', icon: '🎯' },
    { id: 'cartoon', label: 'Desenhos', icon: '📺' }
  ]

  useEffect(() => {
    // Carregar dados quando a página carregar
    const loadData = async () => {
      try {
        setIsLoading(true)
        console.log('🔄 FavoritesPage: Carregando dados...')
        
        // Garantir que activities e cartoons estão carregados
        if (activities.length === 0) {
          console.log('📋 Carregando atividades...')
          await loadActivities()
        }
        if (cartoons.length === 0) {
          console.log('📺 Carregando desenhos...')
          await loadCartoons()
        }
        
        // Carregar favoritos
        console.log('⭐ Carregando favoritos...')
        const result = await loadFavorites()
        console.log('✅ FavoritesPage: Dados carregados:', {
          favorites: result?.data?.length || 0,
          activities: activities.length,
          cartoons: cartoons.length
        })
      } catch (error) {
        console.error('❌ FavoritesPage: Erro ao carregar dados:', error)
        toast.error('Erro ao carregar favoritos')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])
  
  // Recarregar quando activities/cartoons mudarem (para garantir que os itens existem)
  useEffect(() => {
    if (activities.length > 0 || cartoons.length > 0) {
      filterFavorites()
    }
  }, [activities.length, cartoons.length])

  useEffect(() => {
    console.log('🔄 FavoritesPage: Filtrando favoritos...', {
      favoritesCount: favorites.length,
      activeTab,
      searchTerm
    })
    filterFavorites()
  }, [favorites, activeTab, searchTerm, activities, cartoons])

  const filterFavorites = () => {
    console.log('🔍 FavoritesPage: Filtrando favoritos...', {
      totalFavorites: favorites.length,
      activitiesCount: activities.length,
      cartoonsCount: cartoons.length
    })
    
    let filtered = [...favorites]

    // Primeiro, garantir que os favoritos têm os itens correspondentes
    filtered = filtered.filter(fav => {
      let item = null
      if (fav.type === 'activity') {
        // Tentar múltiplas formas de comparação de ID
        item = activities.find(a => {
          const favId = String(fav.itemId)
          const actId = String(a.id)
          return favId === actId || parseInt(favId) === a.id || favId === String(a.id)
        })
      } else if (fav.type === 'cartoon') {
        // Tentar múltiplas formas de comparação de ID
        item = cartoons.find(c => {
          const favId = String(fav.itemId)
          const cartId = String(c.id)
          return favId === cartId || parseInt(favId) === c.id || favId === String(c.id)
        })
      }
      
      if (!item) {
        console.warn('⚠️ Item não encontrado para favorito:', {
          type: fav.type,
          itemId: fav.itemId,
          itemIdType: typeof fav.itemId,
          availableIds: fav.type === 'activity' 
            ? activities.map(a => ({ id: a.id, idType: typeof a.id }))
            : cartoons.map(c => ({ id: c.id, idType: typeof c.id }))
        })
      }
      
      return !!item // Manter apenas favoritos que têm item correspondente
    })

    // Filtro por tipo
    if (activeTab !== 'all') {
      filtered = filtered.filter(fav => fav.type === activeTab)
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(fav => {
        let item = null
        if (fav.type === 'activity') {
          item = activities.find(a => {
            const favId = String(fav.itemId)
            const actId = String(a.id)
            return favId === actId || parseInt(favId) === a.id
          })
        } else if (fav.type === 'cartoon') {
          item = cartoons.find(c => {
            const favId = String(fav.itemId)
            const cartId = String(c.id)
            return favId === cartId || parseInt(favId) === c.id
          })
        }
        
        if (item) {
          return item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 item.description?.toLowerCase().includes(searchTerm.toLowerCase())
        }
        return false
      })
    }

    // Ordenar por data de adição (mais recentes primeiro)
    filtered.sort((a, b) => {
      const dateA = a.addedAt || a.created_at || 0
      const dateB = b.addedAt || b.created_at || 0
      return new Date(dateB) - new Date(dateA)
    })

    console.log('✅ FavoritesPage: Favoritos filtrados:', filtered.length)
    setFilteredFavorites(filtered)
  }

  const handleRemoveFavorite = async (type, itemId) => {
    try {
      const { error } = await removeFromFavorites(type, itemId)
      if (error) throw error
      toast.success('Removido dos favoritos')
    } catch (error) {
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
        title: 'Nenhum favorito ainda',
        description: 'Explore brincadeiras e desenhos para adicionar aos seus favoritos!'
      },
      activity: {
        title: 'Nenhuma brincadeira favoritada',
        description: 'Encontre atividades incríveis e salve as que mais gosta!'
      },
      cartoon: {
        title: 'Nenhum desenho favoritado',
        description: 'Descubra desenhos educativos e divertidos para sua criança!'
      }
    }

    const message = messages[type] || messages.all

    return (
      <div className="card text-center py-8">
        <h3 className="text-lg font-medium text-gray-800 mb-2">{message.title}</h3>
        <p className="text-sm text-gray-600 mb-6">{message.description}</p>
        <div className="flex flex-col gap-2">
          {type !== 'cartoon' && (
            <button
              onClick={() => navigate('/activities')}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Explorar Brincadeiras
            </button>
          )}
          {type !== 'activity' && (
            <button
              onClick={() => navigate('/cartoons')}
              className="w-full bg-white border-2 border-primary-500 text-primary-500 font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:bg-primary-50"
            >
              Ver Desenhos
            </button>
          )}
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container-app py-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando favoritos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-app py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Meus Favoritos ❤️
          </h1>
          <p className="text-gray-600 text-sm">
            {stats.total} {stats.total === 1 ? 'item salvo' : 'itens salvos'}
          </p>
        </div>
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
            let item = null
            if (favorite.type === 'activity') {
              // Converter itemId para número se necessário (Supabase retorna string)
              const itemId = typeof favorite.itemId === 'string' ? parseInt(favorite.itemId) : favorite.itemId
              item = activities.find(a => a.id === itemId || a.id === favorite.itemId || String(a.id) === String(favorite.itemId))
            } else if (favorite.type === 'cartoon') {
              // Converter itemId para número se necessário (Supabase retorna string)
              const itemId = typeof favorite.itemId === 'string' ? parseInt(favorite.itemId) : favorite.itemId
              item = cartoons.find(c => c.id === itemId || c.id === favorite.itemId || String(c.id) === String(favorite.itemId))
            }
            
            if (!item) {
              console.warn('Item não encontrado para favorito:', favorite)
              return null
            }

            return (
              <div key={`${favorite.type}-${favorite.itemId}`} className="relative group">
                {/* Botão de remoção */}
                <button
                  onClick={() => handleRemoveFavorite(favorite.type, favorite.itemId)}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-all transform hover:scale-110"
                  title="Remover dos favoritos"
                >
                  <Trash2 size={16} />
                </button>

                {/* Card do item */}
                {favorite.type === 'activity' ? (
                  <ActivityCard activity={item} />
                ) : (
                  <CartoonCard cartoon={item} compact={false} hideFavoriteButton={true} />
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















