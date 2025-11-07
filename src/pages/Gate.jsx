import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const QUIZ_PATH = '/child-setup';
const APP_PATH = '/app';
const ONBOARDING_KEY = 'bf_onboarding_done';

export default function Gate() {
  const [stage, setStage] = useState('loading');
  const [msg, setMsg] = useState('Preparando sua sessão...');
  const pollRef = useRef(null);

  async function waitForSession() {
    console.log('[GATE] Aguardando sessão do Supabase...');
    
    // Tentar obter sessão imediatamente
    let { data, error } = await supabase.auth.getSession();
    console.log('[GATE] Primeira tentativa de sessão:', {
      hasSession: !!data?.session,
      hasUser: !!data?.session?.user,
      userEmail: data?.session?.user?.email,
      error: error?.message
    });
    
    if (data?.session?.user) {
      console.log('[GATE] ✅ Sessão encontrada imediatamente:', data.session.user.email);
      return data.session.user;
    }
    
    // Se não encontrou, aguardar um pouco mais (até 5 segundos)
    for (let i = 0; i < 50; i++) {
      await new Promise(r => setTimeout(r, 100));
      const { data: newData, error: newError } = await supabase.auth.getSession();
      
      if (newData?.session?.user) {
        console.log('[GATE] ✅ Sessão encontrada após aguardar:', newData.session.user.email);
        return newData.session.user;
      }
      
      if (i % 10 === 0) {
        console.log(`[GATE] Aguardando sessão... (tentativa ${i + 1}/50)`);
      }
    }
    
    console.warn('[GATE] ⚠️ Sessão não encontrada após 5 segundos');
    return null;
  }

  async function checkLicense() {
    try {
      setStage('checking');
      setMsg('Verificando sua licença...');
      const user = await waitForSession();
      console.log('[GATE] Resultado waitForSession:', {
        hasUser: !!user,
        userEmail: user?.email,
        userId: user?.id
      });

      if (!user?.email) {
        console.warn('[GATE] ⚠️ Nenhuma sessão encontrada. Redirecionando para login...');
        console.warn('[GATE] ⚠️ Você precisa fazer login primeiro!');
        setStage('error');
        setMsg('Sessão não encontrada. Redirecionando para login...');
        
        // Redirecionar imediatamente (sem delay)
        console.log('[GATE] Redirecionando para /login agora...');
        window.location.href = '/login';
        return;
      }

      const email = user.email.toLowerCase();
      
      // ✅ SEGURO - Usa função protegida do banco
      console.log('[GATE] Chamando verificar_licenca com email:', email);
      
      let data, error, licenca;
      
      try {
        // ✅ CRÍTICO: Usar APENAS função RPC, NUNCA acessar tabela diretamente
        console.log('[GATE] Chamando função RPC verificar_licenca...');
        const result = await supabase
          .rpc('verificar_licenca', { 
            user_email: email 
          });
        
        data = result.data;
        error = result.error;
        
        // Log detalhado para debug
        console.log('[GATE] Resposta completa do Supabase:', {
          hasData: !!data,
          dataType: Array.isArray(data) ? 'array' : typeof data,
          dataLength: Array.isArray(data) ? data.length : 'N/A',
          hasError: !!error,
          errorCode: error?.code,
          errorMessage: error?.message
        });

        console.log('[GATE] Resultado da função RPC:', { 
          data, 
          error,
          errorCode: error?.code,
          errorMessage: error?.message,
          errorDetails: error?.details,
          errorHint: error?.hint,
          hasData: !!data,
          dataLength: data?.length
        });

        if (error) {
          console.error('❌ [GATE] Erro ao verificar licença via RPC:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
            fullError: error
          });
          
          // Erro PGRST116 significa que a função retornou 0 linhas
          // Isso pode acontecer se o email não está na tabela ou se há problema na função
          if (error.code === 'PGRST116' || error.message?.includes('0 rows')) {
            console.warn('[GATE] ⚠️ Função RPC retornou 0 linhas. Verificando se o email está na tabela...');
            console.warn('[GATE] Email usado:', email);
            console.warn('[GATE] Isso pode significar:');
            console.warn('[GATE] 1. O email não está na tabela licencas');
            console.warn('[GATE] 2. Há diferença de case (maiúsculas/minúsculas)');
            console.warn('[GATE] 3. Há espaços ou caracteres especiais no email');
            setStage('pending');
            setMsg('Acesso pendente. Verifique se o email da sua conta corresponde ao email da compra.');
            return;
          }
          
          // Outros erros
          setStage('error');
          setMsg(`Erro ao verificar licença: ${error.message || 'A função RPC não está disponível. Verifique se a função verificar_licenca existe no Supabase.'}`);
          return;
        }
        
        // Verificar se recebeu dados
        if (!data || data.length === 0) {
          console.log('[GATE] Função RPC retornou sem dados');
          console.log('[GATE] Isso pode significar que:');
          console.log('[GATE] 1. O email não está na tabela licencas');
          console.log('[GATE] 2. A função RPC não está funcionando corretamente');
          console.log('[GATE] 3. Há um problema com a comparação de email (case sensitivity)');
          setStage('pending');
          setMsg('Acesso pendente. Liberação automática em até 30 minutos após a confirmação do pagamento.');
          return;
        }
        
        // Pegar a primeira licença retornada
        licenca = data[0];
        console.log('[GATE] Licença retornada pela função RPC:', licenca);
        console.log('[GATE] Detalhes da licença:', {
          valido: licenca?.valido,
          nome: licenca?.nome,
          data_compra: licenca?.data_compra,
          status: licenca?.status,
          tipoValido: typeof licenca?.valido,
          validoStrict: licenca?.valido === true
        });
        
      } catch (rpcError) {
        console.error('❌ [GATE] Erro ao chamar RPC (catch):', rpcError);
        setStage('error');
        setMsg('Erro de conexão ao verificar licença. Verifique sua internet e tente novamente.');
        return;
      }
      
      // Se chegou aqui sem licenca, algo deu errado
      if (!licenca) {
        console.error('❌ [GATE] Nenhuma licença encontrada após chamar RPC');
        setStage('error');
        setMsg('Erro ao verificar licença. Tente novamente.');
        return;
      }
      
      // Verificar se a licença é válida
      if (!licenca.valido) {
        console.log('[GATE] Licença não válida:', { 
          valido: licenca.valido,
          status: licenca.status 
        });
        setStage('pending');
        setMsg('Acesso pendente. Liberação automática em até 30 minutos após a confirmação do pagamento.');
        return;
      }
      
      console.log('[GATE] ✅ Licença válida encontrada, prosseguindo para verificação de onboarding...');

      // Licença válida - salvar informações da sessão
      if (licenca.nome || licenca.data_compra) {
        localStorage.setItem('brincafacil_session', JSON.stringify({
          email: email,
          nome: licenca.nome,
          data_compra: licenca.data_compra,
          validado_em: new Date().toISOString()
        }));
      }

      // ✅ NOVO: Migrar dados do LocalStorage para Supabase (uma vez)
      try {
        const { migrarLocalStorage } = await import('../lib/storageService');
        const resultado = await migrarLocalStorage(email);
        if (resultado.success) {
          if (resultado.migrados) {
            console.log('✅ Dados migrados para Supabase:', resultado.migrados);
          } else {
            console.log('ℹ️ Dados já foram migrados anteriormente');
          }
        }
      } catch (error) {
        console.warn('⚠️ Erro na migração (não crítico, app continua funcionando):', error);
      }

      // Pago → verificar onboarding e redirecionar
      // ✅ CRÍTICO: Verificar se o quiz já foi feito buscando do Supabase (NÃO do LocalStorage)
      const onboardingFlag = localStorage.getItem(ONBOARDING_KEY) === '1'
      console.log('[GATE] Verificando onboarding:', { 
        onboardingFlag, 
        localStorageValue: localStorage.getItem(ONBOARDING_KEY),
        ONBOARDING_KEY 
      })
      
      // Tentar buscar perfil do Supabase para verificar se já existe
      let hasChild = false
      try {
        const { buscarPerfil } = await import('../lib/storageService')
        const { success, data: perfil } = await buscarPerfil(email)
        hasChild = success && !!perfil
        console.log('[GATE] Verificação de perfil no Supabase:', { 
          success, 
          hasChild, 
          perfilExiste: !!perfil,
          perfilNome: perfil?.nome_crianca 
        })
      } catch (e) {
        console.warn('[GATE] Erro ao verificar perfil no Supabase:', e)
      }
      
      const done = onboardingFlag || hasChild
      const nextPath = done ? '/' : QUIZ_PATH; // Se onboarding feito, vai para home (/) que está protegida

      console.log('[GATE] 🔍 Decisão de redirecionamento:', {
        onboardingFlag,
        hasChild,
        done,
        nextPath,
        QUIZ_PATH,
        APP_PATH: '/'
      });
      
      // ✅ GARANTIR: Se não tem onboarding, SEMPRE vai para o quiz
      if (!done) {
        console.log('[GATE] ✅ Novo usuário detectado! Redirecionando para o quiz...');
        setStage('redirecting');
        setMsg('Acesso liberado! Redirecionando para o quiz...');
        await new Promise(r => setTimeout(r, 800));
        console.log('[GATE] Executando redirecionamento para QUIZ:', QUIZ_PATH);
        window.location.replace(QUIZ_PATH);
        return; // IMPORTANTE: Sair da função aqui para não continuar
      }
      
      // Se já tem onboarding, vai para o app
      console.log('[GATE] ✅ Onboarding já feito! Redirecionando para o app...');
      setStage('redirecting');
      setMsg('Acesso liberado! Redirecionando para o app...');
      await new Promise(r => setTimeout(r, 800));
      console.log('[GATE] Executando redirecionamento para APP:', '/');
      window.location.replace('/');
    } catch (err) {
      console.error('[GATE] erro:', err);
      setStage('error');
      setMsg('Algo deu errado. Tente novamente.');
    }
  }

  useEffect(() => {
    setStage('loading');
    setMsg('Carregando sessão...');
    checkLicense();
    return () => {
      if (pollRef.current) window.clearTimeout(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stage === 'pending') {
      pollRef.current = window.setTimeout(checkLicense, 86400000); // rechecagem uma vez por dia (24h)
    }
    return () => {
      if (pollRef.current) window.clearTimeout(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  // UI seguindo o design system do app
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
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-3xl">
                  {stage === 'pending' ? '⏳' : 
                   stage === 'redirecting' ? '✅' : 
                   stage === 'error' ? '⚠️' : 
                   '🔄'}
                </span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {stage === 'pending' ? 'Acesso pendente' :
               stage === 'redirecting' ? 'Redirecionando' :
               'Verificando acesso'}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              {msg}
            </p>
          </div>

          {stage === 'pending' && (
            <div className="space-y-4">
              <button 
                onClick={checkLicense}
                disabled={stage === 'checking' || stage === 'loading'}
                className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(stage === 'checking' || stage === 'loading') ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Verificando...</span>
                  </>
                ) : (
                  <span>Tentar novamente</span>
                )}
              </button>
              <button 
                onClick={async () => {
                  console.log('[GATE] Limpando sessão e redirecionando para /login (trocar conta)...')
                  // Marcar logout explícito ANTES de fazer signOut
                  sessionStorage.setItem('last_logout', Date.now().toString())
                  
                  try {
                    // Limpar sessão do Supabase
                    await supabase.auth.signOut()
                    console.log('[GATE] ✅ Sessão do Supabase removida')
                    // Aguardar um pouco para garantir que o signOut foi processado
                    await new Promise(r => setTimeout(r, 300))
                  } catch (e) {
                    console.warn('[GATE] ⚠️ Erro ao fazer signOut:', e)
                  }
                  // Limpar localStorage apenas de sessão (mantém onboarding se já foi feito)
                  // O onboarding só é removido quando o usuário realmente trocar de conta
                  // Redirecionar
                  window.location.replace('/login')
                }}
                className="w-full py-3 rounded-xl font-medium bg-white hover:bg-gray-50 text-gray-600 border-2 border-gray-200 transition-all duration-200 text-center"
              >
                Trocar conta
              </button>
            </div>
          )}

          {stage === 'error' && (
            <div className="space-y-4">
              <button 
                onClick={async () => {
                  console.log('[GATE] Limpando sessão e redirecionando para /login...')
                  // Marcar logout explícito ANTES de fazer signOut
                  sessionStorage.setItem('last_logout', Date.now().toString())
                  
                  try {
                    // Limpar sessão do Supabase
                    await supabase.auth.signOut()
                    console.log('[GATE] ✅ Sessão do Supabase removida')
                    // Aguardar um pouco para garantir que o signOut foi processado
                    await new Promise(r => setTimeout(r, 300))
                  } catch (e) {
                    console.warn('[GATE] ⚠️ Erro ao fazer signOut:', e)
                  }
                  // Limpar localStorage apenas de sessão (mantém onboarding se já foi feito)
                  // O onboarding só é removido quando o usuário realmente trocar de conta
                  // Redirecionar
                  window.location.replace('/login')
                }}
                className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white transition-all duration-200 shadow-lg hover:shadow-xl text-center"
              >
                Voltar ao login
              </button>
            </div>
          )}

          {(stage === 'checking' || stage === 'loading' || stage === 'redirecting') && (
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin text-orange-500" size={24} />
            </div>
          )}

          {(stage === 'pending' || stage === 'error') && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                Use o mesmo e-mail da compra. A liberação do acesso acontece automaticamente em até 30 minutos após a confirmação do pagamento.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
