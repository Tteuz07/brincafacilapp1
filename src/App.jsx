import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import useAppStore from './store/useAppStore'
import { supabase } from './lib/supabase'

// Components
import Layout from './components/Layout/Layout'
import LoadingScreen from './components/LoadingScreen/LoadingScreen'

// Pages
import LoginPage from './pages/LoginPage/LoginPage'
import HomePage from './pages/HomePage/HomePage'
import ActivitiesPage from './pages/ActivitiesPage/ActivitiesPage'
import ActivityDetailPage from './pages/ActivityDetailPage/ActivityDetailPage'
import CartoonsPage from './pages/CartoonsPage/CartoonsPage'
import ShopPage from './pages/ShopPage/ShopPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import SettingsPage from './pages/SettingsPage/SettingsPage'
import ChildSetupPage from './pages/ChildSetupPage/ChildSetupPage'
import FavoritesPage from './pages/FavoritesPage/FavoritesPage'
import SupportPage from './pages/SupportPage/SupportPage'
import TestImage from './components/TestImage'

function App() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    child,
    setUser, 
    setLoading, 
    initializeApp 
  } = useAppStore()

  // DEBUG: Log do estado da aplicação
  console.log('🔍 APP STATE:', {
    user: !!user,
    isAuthenticated,
    isLoading,
    child: !!child,
    hasSupabase: !!supabase,
    userEmail: user?.email,
    childName: child?.name
  })

  useEffect(() => {
    // Verificar sessão atual
    const checkSession = async () => {
      try {
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession()
          setUser(session?.user || null)
          
          if (session?.user) {
            await initializeApp()
          }
        } else {
          console.warn('🎯 BrincaFácil - Modo Demonstração')
          console.log('Para configurar o Supabase:')
          console.log('1. Crie uma conta em supabase.com')
          console.log('2. Configure as variáveis de ambiente')
          console.log('3. Execute o script database-setup.sql')
          
          // No modo demonstração, criar um usuário fictício
          const demoUser = {
            id: 'demo-user-123',
            email: 'demo@brincafacil.com',
            user_metadata: {
              name: 'Usuário Demo'
            }
          }
          
          console.log('👤 CRIANDO USUÁRIO DEMO:', demoUser)
          setUser(demoUser)
          
          // Criar perfil da criança demo
          const demoChild = {
            id: 'demo-child-123',
            name: 'Mateus',
            age: 5,
            avatar: '🧒',
            interests: ['brincadeiras', 'desenhos'],
            space: 'casa',
            companionship: 'sozinho'
          }
          
          console.log('👶 CRIANDO PERFIL DEMO DA CRIANÇA:', demoChild)
          // Simular carregamento do perfil da criança
          setTimeout(() => {
            const { setChild } = useAppStore.getState()
            setChild(demoChild)
          }, 1000)
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Listener para mudanças de autenticação (apenas se Supabase estiver configurado)
    let subscription = null
    
    if (supabase) {
      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user || null)
          
          if (session?.user) {
            await initializeApp()
          }
          
          setLoading(false)
        }
      )
      subscription = sub
    }

    // Listener para autenticação customizada (modo demonstração)
    const handleCustomAuth = async (event) => {
      console.log('🔐 HANDLE CUSTOM AUTH:', event.detail)
      const { session } = event.detail
      if (session?.user) {
        console.log('👤 USUÁRIO ENCONTRADO NO CUSTOM AUTH:', session.user)
        setUser(session.user)
        await initializeApp()
      }
      setLoading(false)
    }

    window.addEventListener('supabase-auth-change', handleCustomAuth)

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
      window.removeEventListener('supabase-auth-change', handleCustomAuth)
    }
  }, [setUser, setLoading, initializeApp])

  if (isLoading) {
    console.log('⏳ MOSTRANDO LOADING SCREEN')
    return <LoadingScreen />
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#333',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
            }
          }}
        />
        
        <Routes>
          {/* Rota de login */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
            } 
          />
          
          {/* Rota de configuração inicial da criança */}
          <Route 
            path="/child-setup" 
            element={
              !isAuthenticated ? <Navigate to="/login" replace /> :
              child ? <Navigate to="/" replace /> : <ChildSetupPage />
            } 
          />
          
          {/* Rotas protegidas */}
          <Route 
            path="/*" 
            element={
              !isAuthenticated ? (
                console.log('❌ USUÁRIO NÃO AUTENTICADO - REDIRECIONANDO PARA LOGIN'),
                <Navigate to="/login" replace />
              ) : !child ? (
                console.log('👶 CRIANÇA NÃO CONFIGURADA - REDIRECIONANDO PARA SETUP'),
                <Navigate to="/child-setup" replace />
              ) : (
                console.log('✅ USUÁRIO AUTENTICADO E CRIANÇA CONFIGURADA - MOSTRANDO LAYOUT'),
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/activities" element={<ActivitiesPage />} />
                    <Route path="/activities/:id" element={<ActivityDetailPage />} />
                    <Route path="/cartoons" element={<CartoonsPage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="/test-image" element={<TestImage />} />
                  </Routes>
                </Layout>
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
