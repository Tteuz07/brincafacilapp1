import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Shuffle, Heart, Clock, Users, Sparkles, Brain, Users as UsersIcon, Star } from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import ActivityCard from '../../components/ActivityCard/ActivityCard'
import CartoonCard from '../../components/CartoonCard/CartoonCard'
import QuickFilters from '../../components/QuickFilters/QuickFilters'


const HomePage = () => {
  const { 
    child, 
    activities, 
    cartoons, 
    loadActivities, 
    loadCartoons,
    isLoading 
  } = useAppStore()
  
  const [dailyActivity, setDailyActivity] = useState(null)
  const [recommendedActivities, setRecommendedActivities] = useState([])
  const [featuredCartoons, setFeaturedCartoons] = useState([])
  
  // DEBUG: Log quando HomePage é renderizada
  console.log('🏠 HOMEPAGE RENDERIZADA:', {
    child: !!child,
    activitiesCount: activities.length,
    cartoonsCount: cartoons.length,
    isLoading
  })
  


  useEffect(() => {
    // Carregar dados se ainda não foram carregados
    if (activities.length === 0) {
      loadActivities()
    }
    if (cartoons.length === 0) {
      loadCartoons()
    }

  }, [activities.length, cartoons.length, loadActivities, loadCartoons])

  useEffect(() => {
    if (activities.length > 0) {
      // Gerar recomendações baseadas no perfil da criança
      generateRecommendations()
      // Selecionar atividade do dia
      selectDailyActivity()
    }
  }, [activities, child])

  useEffect(() => {
    if (cartoons.length > 0) {
      // Selecionar desenhos em destaque
      selectFeaturedCartoons()
    }
  }, [cartoons, child])

  const generateRecommendations = () => {
    if (!child || activities.length === 0) return

    // Filtrar atividades baseadas nos interesses da criança
    let filtered = activities.filter(activity => {
      // Verificar se a atividade é adequada para a idade
      if (activity.min_age && child.age < activity.min_age) return false
      if (activity.max_age && child.age > activity.max_age) return false

      // Verificar se combina com os interesses
      if (child.interests && child.interests.length > 0) {
        return activity.categories?.some(cat => child.interests.includes(cat))
      }

      return true
    })

    // Se não há atividades filtradas, usar todas
    if (filtered.length === 0) {
      filtered = activities
    }

    // Ordenar por popularidade/rating e pegar as top 4
    const recommended = filtered
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4)

    setRecommendedActivities(recommended)
  }

  const selectDailyActivity = () => {
    if (activities.length === 0) return

    // Usar data como seed para sempre mostrar a mesma atividade do dia
    const today = new Date().toDateString()
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const randomIndex = seed % activities.length
    
    setDailyActivity(activities[randomIndex])
  }

  const selectFeaturedCartoons = () => {
    if (!child || cartoons.length === 0) return

    // Filtrar desenhos por faixa etária
    let filtered = cartoons.filter(cartoon => {
      if (cartoon.min_age && child.age < cartoon.min_age) return false
      if (cartoon.max_age && child.age > cartoon.max_age) return false
      return true
    })

    // Se não há desenhos filtrados, usar todos
    if (filtered.length === 0) {
      filtered = cartoons
    }

    // Pegar os 6 primeiros
    setFeaturedCartoons(filtered.slice(0, 6))
  }

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  if (isLoading) {
    return (
      <div className="container-app py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-app py-6 space-y-8">


      {/* Atividade do Dia */}
      {dailyActivity && (
        <section className="relative">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white relative overflow-hidden">
            {/* Elementos decorativos */}
            <div className="absolute top-2 right-2 text-2xl animate-pulse">✨</div>
            <div className="absolute bottom-2 left-2 text-xl animate-bounce-soft">🎯</div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-3">
                <Sparkles size={20} />
                <span className="text-sm font-medium uppercase tracking-wide">
                  Brincadeira do Dia
                </span>
              </div>
              
              <h2 className="text-xl font-bold mb-2">{dailyActivity.title}</h2>
              <p className="text-primary-100 text-sm mb-4 line-clamp-2">
                {dailyActivity.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span>{dailyActivity.duration || '15'} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={16} />
                    <span>{dailyActivity.participants || '1-2'}</span>
                  </div>
                </div>
                
                <Link
                  to={`/activities/${dailyActivity.id}`}
                  className="bg-white text-primary-500 px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary-50 transition-colors"
                >
                  Vamos brincar! 🎉
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filtros Rápidos */}
      <QuickFilters />

      {/* Brincadeiras Recomendadas */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Recomendadas para {child?.name} 🎯
          </h2>
          <Link 
            to="/activities"
            className="text-primary-500 font-medium text-sm hover:text-primary-600"
          >
            Ver todas
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {recommendedActivities.map(activity => (
            <ActivityCard 
              key={activity.id} 
              activity={activity} 
              compact 
            />
          ))}
        </div>
        
        {recommendedActivities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Shuffle size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Carregando recomendações...</p>
          </div>
        )}
      </section>

      {/* Desenhos para Acalmar */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Desenhos para Acalmar 📺
          </h2>
          <Link 
            to="/cartoons"
            className="text-primary-500 font-medium text-sm hover:text-primary-600"
          >
            Ver todos
          </Link>
        </div>
        
        <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
          {featuredCartoons.map(cartoon => (
            <div key={cartoon.id} className="flex-shrink-0 w-32">
              <CartoonCard cartoon={cartoon} compact />
            </div>
          ))}
        </div>
        
        {featuredCartoons.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">📺</div>
            <p>Carregando desenhos...</p>
          </div>
        )}
      </section>

      {/* Promoção da Lojinha */}
      <section>
        <div className="card bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">🛍️</div>
            <div className="flex-1">
              <h3 className="font-bold mb-1">Lojinha BrincaFácil</h3>
              <p className="text-purple-100 text-sm mb-3">
                Brinquedos educativos selecionados especialmente para {child?.name || 'sua criança'}
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <span>🎯</span>
                  <span>Produtos seguros</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>💝</span>
                  <span>Descontos especiais</span>
                </div>
              </div>
            </div>
            <Link
              to="/shop"
              className="bg-white text-purple-500 px-4 py-2 rounded-lg font-medium text-sm hover:bg-purple-50 transition-colors"
            >
              Ver Produtos
            </Link>
          </div>
        </div>
      </section>

      {/* Botão Flutuante - Nova Brincadeira */}
      <button
        onClick={() => setDailyActivity(activities[Math.floor(Math.random() * activities.length)])}
        className="fixed bottom-24 right-6 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-110 z-40"
        title="Sortear nova brincadeira"
      >
        <Shuffle size={24} />
      </button>


    </div>
  )
}

export default HomePage
