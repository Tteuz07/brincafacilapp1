import React, { useState, useEffect } from 'react'
import { ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

const LoginPage = () => {
  const [mode, setMode] = useState('signup'); // padrão: Cadastrar
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Pré-preencher email se vier em ?email=
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam.toLowerCase());
    }

    // Se já houver sessão ao abrir /login, redireciona para /gate
    // Mas só se não veio de um logout explícito
    const checkExistingSession = async () => {
      // Verificar se foi um logout explícito (verificando se há um timestamp recente)
      const lastLogout = sessionStorage.getItem('last_logout')
      const now = Date.now()
      // Se foi logout há menos de 3 segundos, não redirecionar
      if (lastLogout && (now - parseInt(lastLogout)) < 3000) {
        console.log('🔐 Logout recente detectado, não redirecionando')
        sessionStorage.removeItem('last_logout')
        return
      }
      
      // Aguardar um pouco para garantir que o signOut foi processado
      await new Promise(r => setTimeout(r, 500))
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        console.log('✅ Sessão já existe, redirecionando para /gate');
        window.location.replace('/gate');
      } else {
        console.log('🔐 Nenhuma sessão encontrada após logout')
      }
    };
    checkExistingSession();
  }, [location.search]);

  // Função para traduzir mensagens de erro do Supabase
  const translateError = (errorMessage) => {
    if (!errorMessage) return 'Erro ao autenticar';
    
    const errorLower = errorMessage.toLowerCase();
    
    // Traduções comuns do Supabase Auth
    if (errorLower.includes('invalid login credentials') || errorLower.includes('invalid credentials')) {
      return 'E-mail ou senha incorretos';
    }
    if (errorLower.includes('email not confirmed') || errorLower.includes('email_not_confirmed')) {
      return 'Por favor, confirme seu e-mail antes de entrar';
    }
    if (errorLower.includes('user already registered') || errorLower.includes('already registered')) {
      return 'Este e-mail já está cadastrado. Tente entrar em vez de cadastrar';
    }
    if (errorLower.includes('password')) {
      if (errorLower.includes('too short') || errorLower.includes('minimum')) {
        return 'A senha precisa ter pelo menos 6 caracteres';
      }
      if (errorLower.includes('weak')) {
        return 'A senha é muito fraca. Use uma senha mais forte';
      }
    }
    if (errorLower.includes('email')) {
      if (errorLower.includes('invalid') || errorLower.includes('malformed')) {
        return 'E-mail inválido';
      }
    }
    if (errorLower.includes('too many requests') || errorLower.includes('rate limit')) {
      return 'Muitas tentativas. Tente novamente em alguns minutos';
    }
    
    return errorMessage;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validação
      if (!email.includes('@')) {
        throw new Error('E-mail inválido');
      }
      if (password.length < 6) {
        throw new Error('A senha precisa ter pelo menos 6 caracteres');
      }

      if (mode === 'signup') {
        // ✅ LIMPAR EMAIL: Remover espaços e normalizar
        const emailClean = email.trim().toLowerCase();
        console.log('[LOGIN] Tentando cadastrar:', {
          emailOriginal: email,
          emailLimpo: emailClean,
          emailLength: emailClean.length
        });
        
        // Validação básica de email
        if (!emailClean.includes('@') || !emailClean.includes('.')) {
          throw new Error('E-mail inválido. Verifique se digitou corretamente.');
        }
        
        // ✅ FLUXO CORRETO: Verificar licença PRIMEIRO, depois cadastrar
        console.log('[LOGIN] Verificando se email está autorizado na tabela licencas...');
        const emailLower = emailClean;
        
        try {
          // Verificar se o email está na tabela licencas com status 'pago'
          const { data: licencaData, error: licencaError } = await supabase
            .rpc('verificar_licenca', { 
              user_email: emailLower 
            });
          
          console.log('[LOGIN] Resultado verificar_licenca:', {
            hasData: !!licencaData,
            dataLength: licencaData?.length,
            hasError: !!licencaError,
            errorMessage: licencaError?.message
          });
          
          if (licencaError) {
            console.error('[LOGIN] Erro ao verificar licença:', licencaError);
            throw new Error('Erro ao verificar autorização. Tente novamente.');
          }
          
          // Verificar se a licença é válida
          const licenca = licencaData?.[0];
          if (!licenca || licenca.valido !== true) {
            console.log('[LOGIN] Email não autorizado ou licença não paga:', licenca);
            throw new Error('Este e-mail não está autorizado. Verifique se você completou a compra e aguarde até 30 minutos para liberação automática.');
          }
          
          console.log('✅ Email autorizado! Prosseguindo com cadastro...');
        } catch (licencaErr) {
          // Se for erro de autorização, mostrar mensagem e parar
          if (licencaErr.message?.includes('não está autorizado') || 
              licencaErr.message?.includes('não paga')) {
            throw licencaErr;
          }
          // Outros erros também param
          throw licencaErr;
        }
        
        // Se chegou aqui, o email está autorizado - tentar cadastrar
        console.log('[LOGIN] Email autorizado, tentando cadastrar no Supabase Auth...');
        console.log('[LOGIN] Dados do cadastro:', {
          email: emailLower,
          emailLength: emailLower.length,
          passwordLength: password.length,
          hasPassword: !!password
        });
        
        const { data, error } = await supabase.auth.signUp({ 
          email: emailLower.trim(), // Garantir que não tem espaços
          password: password.trim() // Garantir que não tem espaços
        });
        
        console.log('[LOGIN] Resposta do signUp:', { 
          hasData: !!data, 
          hasError: !!error,
          errorCode: error?.code,
          errorMessage: error?.message,
          userId: data?.user?.id,
          userEmail: data?.user?.email
        });
        
        if (error) {
          console.error('[LOGIN] Erro no cadastro:', error);
          
          // Se o erro for que o usuário já existe, tentar fazer login automaticamente
          if (error.message?.toLowerCase().includes('already registered') || 
              error.message?.toLowerCase().includes('user already registered') ||
              error.code === 'signup_disabled' ||
              error.message?.toLowerCase().includes('email already') ||
              error.status === 422) {
            console.log('[LOGIN] Usuário já existe no Supabase Auth, tentando fazer login...');
            
            // Tentar fazer login automaticamente
            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
              email: emailLower,
              password
            });
            
            if (loginError) {
              // Se o login também falhar, mostrar mensagem clara
              console.error('[LOGIN] Login também falhou:', loginError);
              
              if (loginError.message?.toLowerCase().includes('invalid') || 
                  loginError.message?.toLowerCase().includes('credentials')) {
                throw new Error('Este e-mail já está cadastrado, mas a senha está incorreta. Use a aba "Entrar" e digite a senha correta.');
              }
              
              throw new Error('Este e-mail já está cadastrado. Use a aba "Entrar" e digite sua senha.');
            } else {
              // Login funcionou!
              console.log('✅ Login automático realizado:', loginData);
              toast.success('Login realizado com sucesso!');
              await new Promise(r => setTimeout(r, 500));
              window.location.replace('/gate');
              return;
            }
          }
          
          const translatedError = translateError(error.message);
          throw new Error(translatedError || 'Erro ao cadastrar. Tente novamente.');
        }
        
        console.log('✅ Cadastro realizado:', data);
        
        // Verificar se o usuário foi criado (pode não ter email confirmado)
        if (data?.user) {
          console.log('✅ Usuário criado no Supabase Auth:', data.user.id);
          toast.success('Cadastro realizado! Redirecionando...');
        } else {
          console.warn('⚠️ Usuário criado mas sem confirmação de email');
          toast.success('Cadastro realizado! Verifique seu e-mail para confirmar.');
        }
        
        // Pequeno delay para o toast aparecer antes de redirecionar
        await new Promise(r => setTimeout(r, 500));
      } else {
        // Modo LOGIN
        console.log('[LOGIN] Tentando fazer login:', email.toLowerCase());
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email: email.toLowerCase(), 
          password 
        });
        
        console.log('[LOGIN] Resposta do signIn:', { 
          hasData: !!data, 
          hasError: !!error,
          errorCode: error?.code,
          errorMessage: error?.message,
          errorStatus: error?.status,
          userId: data?.user?.id
        });
        
        if (error) {
          console.error('[LOGIN] Erro no login:', error);
          
          // Tratamento específico para erro 400 (Bad Request)
          if (error.status === 400) {
            if (error.message?.toLowerCase().includes('invalid') || 
                error.message?.toLowerCase().includes('credentials')) {
              throw new Error('Email ou senha incorretos. Verifique suas credenciais.');
            } else if (error.message?.toLowerCase().includes('email not confirmed')) {
              throw new Error('Email não confirmado. Verifique sua caixa de entrada.');
            } else {
              throw new Error('Erro ao fazer login. Verifique se o email está cadastrado.');
            }
          }
          
          const translatedError = translateError(error.message);
          throw new Error(translatedError || 'Erro ao fazer login. Tente novamente.');
        }
        console.log('✅ Login realizado:', data);
        toast.success('Login realizado com sucesso!');
        
        // Aguardar a sessão ser salva no localStorage
        let sessionSaved = false;
        for (let i = 0; i < 10; i++) {
          await new Promise(r => setTimeout(r, 200));
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            console.log('✅ Sessão salva!');
            sessionSaved = true;
            break;
          }
        }
        
        if (!sessionSaved) {
          console.warn('⚠️ Sessão não foi salva rapidamente, mas continuando...');
        }
        
        // Pequeno delay adicional
        await new Promise(r => setTimeout(r, 300));
      }

      // Redireciona para /gate
      console.log('🔄 Redirecionando para /gate...');
      window.location.replace('/gate');
    } catch (err) {
      const errorMessage = translateError(err?.message) || 'Erro ao autenticar';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 flex-col">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-orange-400/30 to-yellow-400/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-gradient-to-r from-orange-300/30 to-yellow-300/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>
      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-0">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <img src="/logo.png" alt="BrincaFácil" className="h-12 w-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Bem-vindo ao BrincaFácil!</h1>
            <p className="text-gray-500 text-sm leading-relaxed">Descubra brincadeiras personalizadas para seu pequeno</p>
          </div>

          {/* Tabs Cadastrar/Entrar */}
          <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                mode === 'signup'
                  ? 'bg-white text-orange-500 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="text-sm">Cadastrar</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                mode === 'signin'
                  ? 'bg-white text-orange-500 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="text-sm">Entrar</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail da compra</label>
              <input
                type="email"
                placeholder="E-mail da compra"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                className="w-full px-4 py-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {mode === 'signup' ? 'Crie sua senha' : 'Sua senha'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'signup' ? 'Crie sua senha' : 'Sua senha'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 pr-12 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>{mode === 'signup' ? 'Cadastrando...' : 'Entrando...'}</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signup' ? 'Cadastrar' : 'Entrar'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Mensagem informativa no rodapé */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              Use o mesmo e-mail da compra. A liberação do acesso acontece automaticamente em até 30 minutos após a confirmação do pagamento.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage