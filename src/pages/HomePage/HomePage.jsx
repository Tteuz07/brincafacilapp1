import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shuffle, Heart, Clock, Users, Sparkles, Brain, Users as UsersIcon, Star, ArrowRight } from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import ActivityCard from '../../components/ActivityCard/ActivityCard'
import CartoonCard from '../../components/CartoonCard/CartoonCard'
import QuickFilters from '../../components/QuickFilters/QuickFilters'


const HomePage = () => {
  const navigate = useNavigate()
  const { 
    child, 
    activities, 
    cartoons, 
    loadActivities, 
    loadCartoons,
    isLoading,
    user,
    isAuthenticated,
    loadChildProfile
  } = useAppStore()
  
  const [dailyActivity, setDailyActivity] = useState(null)
  const [recommendedActivities, setRecommendedActivities] = useState([])
  const [featuredCartoons, setFeaturedCartoons] = useState([])
  const [checkingOnboarding, setCheckingOnboarding] = useState(true)
  
  // DEBUG: Log quando HomePage é renderizada
  console.log('🏠 HOMEPAGE RENDERIZADA:', {
    child: !!child,
    activitiesCount: activities.length,
    cartoonsCount: cartoons.length,
    isLoading,
    isAuthenticated,
    user: !!user
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
      // Se não houver child, ainda pode gerar recomendações gerais
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
  
  // ✅ VERIFICAR SE PRECISA FAZER QUIZ (DEPOIS DE TODOS OS HOOKS)
  // IMPORTANTE: Executar quando o usuário estiver carregado OU quando o componente montar
  useEffect(() => {
    console.log('🔍 [HomePage] useEffect de verificação de quiz EXECUTADO', {
      isAuthenticated,
      hasUser: !!user,
      hasChild: !!child
    })
    
    const checkOnboarding = async () => {
      try {
        console.log('🔍 [HomePage] ========== VERIFICANDO QUIZ ==========')
        console.log('🔍 [HomePage] Estado atual:', {
          isAuthenticated,
          hasUser: !!user,
          userEmail: user?.email,
          hasChild: !!child,
          childName: child?.name
        })
        
        // Se não está autenticado, não precisa verificar (mas não bloquear)
        if (!isAuthenticated || !user) {
          console.log('⚠️ [HomePage] Usuário não autenticado ainda, aguardando...')
          // Não setar checkingOnboarding como false ainda - pode estar carregando
          return
        }
        
        // Verificar flag de onboarding no localStorage
        const onboardingFlag = localStorage.getItem('bf_onboarding_done') === '1'
        console.log('📋 [HomePage] Flag de onboarding no localStorage:', onboardingFlag, 'Valor:', localStorage.getItem('bf_onboarding_done'))
        
        // Se já tem flag, não precisa verificar
        if (onboardingFlag) {
          console.log('✅ [HomePage] Onboarding já feito (flag encontrada no localStorage)')
          setCheckingOnboarding(false)
          return
        }
        
        // Se já tem child no store, não precisa verificar
        if (child && child.name) {
          console.log('✅ [HomePage] Perfil de criança encontrado no store:', child.name)
          setCheckingOnboarding(false)
          return
        }
        
        // Tentar carregar perfil do Supabase
        console.log('🔍 [HomePage] Tentando carregar perfil do Supabase para:', user.email)
        const result = await loadChildProfile()
        console.log('📊 [HomePage] Resultado do loadChildProfile:', {
          success: !!result?.data,
          hasData: !!result?.data,
          childName: result?.data?.name,
          fullResult: result
        })
        
        if (result?.data && result.data.name) {
          console.log('✅ [HomePage] Perfil encontrado no Supabase:', result.data.name)
          setCheckingOnboarding(false)
          return
        }
        
        // Se chegou aqui, não tem perfil - precisa fazer quiz
        console.log('⚠️ [HomePage] ========== NENHUM PERFIL ENCONTRADO! ==========')
        console.log('⚠️ [HomePage] Redirecionando para /child-setup AGORA...')
        console.log('🔄 [HomePage] Executando: window.location.href = "/child-setup"')
        
        // Redirecionar IMEDIATAMENTE - não esperar nada
        setCheckingOnboarding(false)
        
        // Redirecionar diretamente (sem setTimeout para ser mais rápido)
        window.location.href = '/child-setup'
        
      } catch (error) {
        console.error('❌ [HomePage] Erro ao verificar onboarding:', error)
        setCheckingOnboarding(false)
        // Em caso de erro, também redirecionar para o quiz
        console.log('🔄 [HomePage] Erro detectado, redirecionando para quiz como fallback...')
        window.location.href = '/child-setup'
      }
    }
    
    // Executar quando o usuário estiver disponível OU após um pequeno delay
    if (isAuthenticated && user) {
      // Usuário já está carregado, verificar imediatamente
      checkOnboarding()
    } else {
      // Aguardar um pouco para o usuário carregar, depois verificar
      const timer = setTimeout(() => {
        checkOnboarding()
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, user, child, loadChildProfile]) // ✅ Executar quando usuário ou child mudarem

  const generateRecommendations = () => {
    if (activities.length === 0) return

    let filtered = activities

    // Se houver perfil da criança, filtrar baseado nele
    if (child && child.name) {
      // Filtrar atividades baseadas nos interesses da criança
      filtered = activities.filter(activity => {
        // Verificar se a atividade é adequada para a idade
        if (child.age) {
          if (activity.min_age && child.age < activity.min_age) return false
          if (activity.max_age && child.age > activity.max_age) return false
        }

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
    if (cartoons.length === 0) return

    let filtered = cartoons

    // Se houver perfil da criança, filtrar baseado nele
    if (child && child.name && child.age) {
      // Filtrar desenhos por faixa etária
      filtered = cartoons.filter(cartoon => {
        if (cartoon.min_age && child.age < cartoon.min_age) return false
        if (cartoon.max_age && child.age > cartoon.max_age) return false
        return true
      })

      // Se não há desenhos filtrados, usar todos
      if (filtered.length === 0) {
        filtered = cartoons
      }
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

  // Se está verificando onboarding, mostrar loading (DEPOIS DE TODOS OS HOOKS)
  if (checkingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando perfil...</p>
        </div>
      </div>
    )
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
            Recomendadas para {child?.name || 'sua criança'} 🎯
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
        <Link to="/shop">
          <div className="relative overflow-hidden rounded-3xl bg-white cursor-pointer transition-all duration-300 hover:scale-[1.01] shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] border-[3px] border-yellow-400">
            {/* Badge Superior */}
            <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 px-5 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🛍️</span>
                  <span className="text-white text-sm font-bold">
                    Lojinha BrincaFácil
                  </span>
                </div>
                <div className="bg-white/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
                  NOVIDADE
                </div>
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="p-5">
              <div className="flex items-center justify-between">
                {/* Texto e Features */}
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-900 mb-2">
                    Brinquedos educativos selecionados especialmente para {child?.name || 'sua criança'}
                  </h3>
                  
                  {/* Features em Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-xl">
                      <span className="text-lg">🎯</span>
                      <span className="text-xs font-semibold text-green-700">Produtos seguros</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-purple-50 px-3 py-2 rounded-xl">
                      <span className="text-lg">💝</span>
                      <span className="text-xs font-semibold text-purple-700">Descontos especiais</span>
                    </div>
                  </div>
                </div>

                {/* Botão de Ação */}
                <div className="flex-shrink-0 ml-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
                    <ArrowRight size={24} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
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
