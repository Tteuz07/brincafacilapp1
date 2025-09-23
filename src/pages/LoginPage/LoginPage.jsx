import React, { useState } from 'react'
import { Mail, ArrowRight, Star, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { signInWithEmail, checkEmailAccess, supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailStatus, setEmailStatus] = useState(null)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)

  // Verificar se o email tem acesso
  const checkEmailAccessStatus = async (emailToCheck) => {
    if (!emailToCheck) {
      setEmailStatus(null)
      return
    }

    setIsCheckingEmail(true)
    try {
      const hasAccess = await checkEmailAccess(emailToCheck)
      
      setEmailStatus({
        hasAccess: hasAccess,
        source: 'supabase'
      })
    } catch (error) {
      console.error('Erro ao verificar email:', error)
      setEmailStatus({
        hasAccess: false,
        source: 'error',
        error: error.message
      })
    } finally {
      setIsCheckingEmail(false)
    }
  }

  // Verificar se o email tem acesso antes de permitir login
  const canProceedWithLogin = () => {
    if (!email) return false
    if (isCheckingEmail) return false
    if (!emailStatus) return false
    return emailStatus.hasAccess === true
  }

  // Verificar email quando mudar
  React.useEffect(() => {
    setEmailStatus(null)
    
    if (email) {
      const timeoutId = setTimeout(() => {
        checkEmailAccessStatus(email)
      }, 1000) // Aguardar 1 segundo após parar de digitar
      
      return () => clearTimeout(timeoutId)
    }
  }, [email])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Digite seu email')
      return
    }

    // Verificação adicional de segurança
    if (!canProceedWithLogin()) {
      if (emailStatus && !emailStatus.hasAccess) {
        toast.error('Este email não possui acesso ao BrincaFácil.')
      } else {
        toast.error('Aguarde a verificação do email ser concluída.')
      }
      return
    }

    setIsLoading(true)
    
    try {
      const { data, error } = await signInWithEmail(email)
      
      if (error) {
        if (error.message.includes('não autorizado')) {
          toast.error('Este email não tem acesso ao BrincaFácil')
        } else {
          toast.error('Erro ao fazer login. Tente novamente.')
        }
        console.error('Erro de login:', error)
      } else if (data?.user) {
        toast.success(`Bem-vindo(a)! Redirecionando...`)
        
        // Simular o processo de autenticação do Supabase
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('supabase-auth-change', {
            detail: { 
              event: 'SIGNED_IN', 
              session: data.session || { user: data.user }
            }
          }))
        }, 1000)
      }
    } catch (error) {
      toast.error('Erro inesperado. Tente novamente.')
      console.error('Erro inesperado:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Fundo animado com gradiente laranja */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-orange-200 to-yellow-100"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-300/20 via-transparent to-yellow-300/20 animate-pulse"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-orange-400/30 to-yellow-400/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-gradient-to-r from-orange-300/30 to-yellow-300/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-lg">
        
        {/* Banner de Modo Demonstração */}
        {!supabase && (
          <div className="mb-8 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg border-0">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle size={18} />
              <span className="font-semibold text-sm">Versão Demo</span>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed">
              Teste grátis! Digite qualquer email para explorar o app.
            </p>
          </div>
        )}

        {/* Card principal de login */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-0">
          {/* Header com logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <img 
                src="/logo.png" 
                alt="BrincaFácil" 
                className="h-12 w-auto"
              />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Acesse sua conta para descobrir brincadeiras<br />
              personalizadas para seu pequeno
            </p>
          </div>

          {/* Formulário de login */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                Faça seu login
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Digite seu email abaixo para acessar
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-400"
                  disabled={isLoading}
                  required
                />
                
                {/* Indicador de verificação de email */}
                {email && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {isCheckingEmail ? (
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : emailStatus ? (
                      emailStatus.hasAccess ? (
                        <CheckCircle className="text-green-500" size={20} />
                      ) : (
                        <XCircle className="text-red-500" size={20} />
                      )
                    ) : null}
                  </div>
                )}
              </div>

              {/* Status do email */}
              {emailStatus && (
                <div className={`p-3 rounded-lg border ${
                  emailStatus.hasAccess 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    {emailStatus.hasAccess ? (
                      <>
                        <CheckCircle className="text-green-600" size={18} />
                        <div className="flex-1">
                          <p className="text-green-800 text-sm font-medium">
                            ✅ Email Autorizado
                          </p>
                          <p className="text-green-600 text-xs">
                            Este email tem acesso ao BrincaFácil
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <XCircle className="text-red-600" size={18} />
                        <div className="flex-1">
                          <p className="text-red-800 text-sm font-medium">
                            ❌ Email não autorizado
                          </p>
                          <p className="text-red-600 text-xs">
                            Este email não possui acesso ao sistema
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !canProceedWithLogin()}
                className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl ${
                  !canProceedWithLogin()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>
                      {!canProceedWithLogin() 
                        ? emailStatus && !emailStatus.hasAccess
                          ? 'Acesso Negado'
                          : 'Verificando...'
                        : 'Entrar'
                      }
                    </span>
                    {canProceedWithLogin() && <ArrowRight size={18} />}
                  </>
                )}
              </button>
            </form>

            {/* Info box */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm">💡</span>
                </div>
                <div>
                  <p className="text-blue-800 text-sm font-medium mb-1">
                    Como funciona?
                  </p>
                  <p className="text-blue-600 text-xs leading-relaxed">
                    Digite seu email para verificar se possui acesso. O sistema verifica automaticamente se você está na lista de emails autorizados.
                  </p>
                </div>
              </div>
            </div>

            {/* Box de contato */}
            {emailStatus && !emailStatus.hasAccess && (
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-orange-600 text-sm">📧</span>
                  </div>
                  <div>
                    <p className="text-orange-800 text-sm font-medium mb-1">
                      Precisa de acesso?
                    </p>
                    <p className="text-orange-600 text-xs leading-relaxed mb-2">
                      Entre em contato conosco para solicitar acesso ao BrincaFácil.
                    </p>
                    <button
                      onClick={() => window.open('/support', '_blank')}
                      className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors duration-200"
                    >
                      Solicitar Acesso
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features preview */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-md border-0">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-lg">🎮</span>
            </div>
            <p className="text-xs text-gray-700 font-medium leading-tight">Brincadeiras Personalizadas</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-md border-0">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-lg">📺</span>
            </div>
            <p className="text-xs text-gray-700 font-medium leading-tight">Desenhos Educativos</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-md border-0">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-lg">💡</span>
            </div>
            <p className="text-xs text-gray-700 font-medium leading-tight">Dicas para Pais</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage