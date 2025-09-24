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
    // Verificar se há usuário salvo no localStorage
    const checkStoredUser = async () => {
      try {
        // Sempre iniciar deslogado no deploy
        const storedUser = localStorage.getItem('brincafacil-user')
        const storedChild = localStorage.getItem('brincafacil-child')
        
        if (storedUser && storedChild) {
          const user = JSON.parse(storedUser)
          const child = JSON.parse(storedChild)
          
          console.log('👤 USUÁRIO ENCONTRADO NO LOCALSTORAGE:', user)
          setUser(user)
          setChild(child)
          await initializeApp()
        } else {
          console.log('🔐 NENHUM USUÁRIO SALVO - INICIANDO DESLOGADO')
          setUser(null)
        }
      } catch (error) {
        console.error('Erro ao verificar usuário salvo:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkStoredUser()

    // Listener para mudanças de autenticação via localStorage
    const handleAuthChange = async (event) => {
      console.log('🔐 HANDLE AUTH CHANGE:', event.detail)
      const { user, child } = event.detail
      
      if (user && child) {
        console.log('👤 USUÁRIO LOGADO VIA EVENT:', user)
        setUser(user)
        setChild(child)
        await initializeApp()
      } else {
        console.log('👤 USUÁRIO DESLOGADO VIA EVENT')
        setUser(null)
        setChild(null)
        // Limpar localStorage
        localStorage.removeItem('brincafacil-user')
        localStorage.removeItem('brincafacil-child')
      }
      setLoading(false)
    }

    window.addEventListener('brincafacil-auth-change', handleAuthChange)

    return () => {
      window.removeEventListener('brincafacil-auth-change', handleAuthChange)
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
