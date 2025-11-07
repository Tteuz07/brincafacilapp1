
import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import useAppStore from './store/useAppStore'

// Components
import Layout from './components/Layout/Layout'
import LoadingScreen from './components/LoadingScreen/LoadingScreen'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'

// Pages
import LoginPage from './pages/LoginPage/LoginPage'
import Gate from './pages/Gate'
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
import StoriesPage from './pages/StoriesPage/StoriesPage'
import DrawingsPage from './pages/DrawingsPage/DrawingsPage'
import WorkshopPage from './pages/WorkshopPage/WorkshopPage'

function App() {
  const { 
    user, 
    child,
    setUser, 
    setChild, 
    initializeApp 
  } = useAppStore()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('🔍 VERIFICANDO SESSÃO SALVA...')
        
        // Verificar se há sessão do Supabase primeiro
        const { supabase } = await import('./lib/supabaseClient')
        const { data: { session } } = await supabase.auth.getSession()
        
        // ❌ NÃO CARREGAR CHILD DO LOCALSTORAGE - dados vêm apenas do Supabase
        // O child será carregado automaticamente pelo loadChild() que busca do Supabase
        
        console.log('📊 VERIFICANDO SESSÃO:', {
          hasSupabaseSession: !!session,
          userEmail: session?.user?.email
        })
        
        // ✅ CRÍTICO: Se tiver sessão Supabase, carregar usuário no store
        if (session?.user) {
          console.log('✅ Sessão Supabase encontrada, carregando usuário no store...')
          setUser(session.user)
          console.log('✅ Usuário carregado no store:', session.user.email)
        } else {
          console.log('⚠️ Nenhuma sessão encontrada, usuário não autenticado')
          setUser(null)
        }
        
        // Inicializar app sempre (vai carregar child do Zustand persist ou localStorage)
        await initializeApp()
        
        // Após inicializar, verificar se child foi carregado corretamente
        // Aguardar um pouco para garantir que o Zustand persist foi carregado
        await new Promise(r => setTimeout(r, 100))
        
        const storeState = useAppStore.getState()
        if (storeState.child && storeState.child.name) {
          console.log('✅ CHILD CARREGADO DO STORE:', storeState.child.name)
          // ❌ NÃO SINCRONIZAR COM LOCALSTORAGE - dados ficam apenas no Supabase
        }
      } catch (error) {
        console.error('❌ ERRO AO VERIFICAR SESSÃO:', error)
      } finally {
        setIsLoading(false)
        console.log('✅ VERIFICAÇÃO DE SESSÃO CONCLUÍDA')
      }
    }

    // Escutar evento de mudança de autenticação
    const handleAuthChange = (event) => {
      console.log('🔔 EVENTO DE AUTENTICAÇÃO RECEBIDO:', event.detail)
      const { user, child } = event.detail
      
      if (user) {
        console.log('👤 USUÁRIO DO EVENTO:', user)
        setUser(user)
      }
      if (child) {
        console.log('👶 CRIANÇA DO EVENTO:', child)
        setChild(child)
      }
      if (user) {
        initializeApp()
      }
    }

    // Adicionar listener para o evento
    window.addEventListener('brincafacil-auth-change', handleAuthChange)

    checkSession()

    // Cleanup
    return () => {
      window.removeEventListener('brincafacil-auth-change', handleAuthChange)
    }
  }, [setUser, setChild, initializeApp])

  if (isLoading) {
    return <LoadingScreen />
  }

  try {
    return (
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          
          <Routes>
            {/* Rota de login */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rota /gate - verificação de licença (DEVE VIR ANTES DO CATCH-ALL) */}
            <Route path="/gate" element={<Gate />} />
            
            {/* Rota de configuração inicial da criança (onboarding/quiz) */}
            <Route path="/child-setup" element={<ChildSetupPage />} />
            
            {/* Rotas protegidas do app - todas precisam de licença paga */}
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/app" element={<HomePage />} />
                      <Route path="/activities" element={<ActivitiesPage />} />
                      <Route path="/activities/:id" element={<ActivityDetailPage />} />
                      <Route path="/cartoons" element={<CartoonsPage />} />
                      <Route path="/shop" element={<ShopPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/favorites" element={<FavoritesPage />} />
                      <Route path="/support" element={<SupportPage />} />
                      <Route path="/stories" element={<StoriesPage />} />
                      <Route path="/drawings" element={<DrawingsPage />} />
                      <Route path="/workshop" element={<WorkshopPage />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback: se nenhuma rota corresponder, vai para login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    )
  } catch (error) {
    console.error('❌ ERRO NO APP:', error)
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border-0">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Erro ao carregar</h2>
            <p className="text-gray-500 text-sm mb-6">
              {error.message || 'Ocorreu um erro ao carregar a aplicação.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default App