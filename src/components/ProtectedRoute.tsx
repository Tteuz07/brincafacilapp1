import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { checkLicense } from '../utils/checkLicense';
import { verificarSessao } from '../lib/supabaseClient';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ ok: boolean; msg?: string; loading: boolean }>({
    ok: false,
    msg: 'Verificando seu acesso...',
    loading: true,
  });
  const navigate = useNavigate();

  async function verify() {
    try {
      console.log('[ProtectedRoute] Iniciando verificação...');
      setState(s => ({ ...s, loading: true }));
      
      // ✅ PRIMEIRO: Verificar se há sessão do Supabase usando função melhorada
      const session = await verificarSessao();
      
      if (!session?.user) {
        console.log('[ProtectedRoute] ❌ Nenhuma sessão encontrada, redirecionando para /login...');
        setState({ ok: false, msg: 'Faça login para continuar.', loading: false });
        // Aguardar um pouco para mostrar a mensagem
        await new Promise(r => setTimeout(r, 500));
        window.location.replace('/login');
        return;
      }
      
      console.log('[ProtectedRoute] ✅ Sessão encontrada, verificando licença...');
      const res = await checkLicense();
      console.log('[ProtectedRoute] Resultado:', res);
      
      if (res.allowed) {
        console.log('[ProtectedRoute] ✅ Acesso permitido');
        setState({ ok: true, loading: false });
      } else {
        console.log('[ProtectedRoute] ❌ Acesso negado:', res.reason);
        // Se não está logado, redireciona automaticamente para /login
        if (res.reason === 'Faça login.') {
          console.log('[ProtectedRoute] Redirecionando para /login...');
          window.location.replace('/login');
          return;
        }
        // Se licença pendente, redireciona para /gate
        if (res.reason?.includes('pendente') || res.reason?.includes('Liberação')) {
          console.log('[ProtectedRoute] Licença pendente, redirecionando para /gate...');
          window.location.replace('/gate');
          return;
        }
        setState({ ok: false, msg: res.reason, loading: false });
      }
    } catch (err) {
      console.error('[ProtectedRoute] Erro na verificação:', err);
      setState({ ok: false, msg: 'Erro ao verificar acesso. Tente novamente.', loading: false });
      // Em caso de erro, redirecionar para login após um tempo
      setTimeout(() => {
        window.location.replace('/login');
      }, 2000);
    }
  }

  useEffect(() => {
    verify();
    const id = setInterval(verify, 86400000); // rechecagem automática uma vez por dia (24h)
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mostrar loading enquanto verifica
  if (state.loading) {
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
                  <Loader2 className="animate-spin text-white" size={32} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Verificando acesso...</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                {state.msg || 'Por favor, aguarde...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!state.ok) {
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
                  <span className="text-3xl">⏳</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Acesso pendente</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                {state.msg || 'Liberação automática em até 30 minutos após a confirmação do pagamento.'}
              </p>
            </div>

            <button
              onClick={verify}
              disabled={state.loading}
              className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Verificando...</span>
                </>
              ) : (
                <span>Tentar novamente</span>
              )}
            </button>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                Use o mesmo e-mail da compra. A liberação do acesso acontece automaticamente em até 30 minutos após a confirmação do pagamento.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

