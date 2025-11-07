import { createClient } from '@supabase/supabase-js';

// ✅ FORÇAR CREDENCIAIS CORRETAS (NOVA CONTA)
// Se as variáveis de ambiente não estiverem configuradas, usar as credenciais corretas
const SUPABASE_URL_NOVA = 'https://medixxzluqpbdgnjcmyz.supabase.co';
const SUPABASE_KEY_NOVA = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZGl4eHpsdXFwYmRnbmpjbXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0ODIyNDIsImV4cCI6MjA3ODA1ODI0Mn0.46493DxiLSr2wN9CcwWPJw7m8ZF3E9_8KI-q0RHDB3I';

// Ler das variáveis de ambiente, mas se estiver usando conta antiga, forçar a nova
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON || '';

// ✅ CORREÇÃO: Se estiver usando conta antiga, forçar a nova
if (supabaseUrl.includes('upogaucjprjtgyhunpdz') || supabaseUrl.includes('upogaucjpritgyhunpdz')) {
  console.warn('⚠️ Detectada conta ANTIGA do Supabase! Forçando uso da NOVA conta...');
  supabaseUrl = SUPABASE_URL_NOVA;
  supabaseAnonKey = SUPABASE_KEY_NOVA;
}

// Se não tiver URL configurada, usar a nova conta
if (!supabaseUrl || supabaseUrl === '') {
  console.warn('⚠️ Variáveis de ambiente não configuradas! Usando credenciais da NOVA conta...');
  supabaseUrl = SUPABASE_URL_NOVA;
  supabaseAnonKey = SUPABASE_KEY_NOVA;
}

// Debug: verificar se as variáveis estão sendo lidas
const urlPreview = supabaseUrl ? supabaseUrl.substring(0, 50) : 'vazio';
const keyPreview = supabaseAnonKey ? supabaseAnonKey.substring(0, 30) + '...' : 'vazio';

console.log('🔍 DEBUG Supabase Env:', {
  hasUrl: !!supabaseUrl,
  urlLength: supabaseUrl.length,
  hasKey: !!supabaseAnonKey,
  keyLength: supabaseAnonKey.length,
  urlPreview: urlPreview,
  keyPreview: keyPreview,
  urlCompleto: supabaseUrl, // Mostrar URL completo para verificar
  isNewAccount: supabaseUrl.includes('medixxzluqpbdgnjcmyz') // Verificar se está usando a nova conta
});

// Criar um client mock se as variáveis não estiverem configuradas
let supabase;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variáveis de ambiente do Supabase não configuradas! Criando client mock...');
  console.warn('⚠️ Verifique se VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão configuradas na Vercel');
  
  // Criar um client mock que não quebra a aplicação
  supabase = createClient(
    'https://placeholder.supabase.co',
    'placeholder-key',
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
  
  // Sobrescrever métodos críticos para evitar erros
  supabase.auth.getSession = async () => ({ data: { session: null }, error: null });
  supabase.auth.signInWithPassword = async () => ({ data: null, error: { message: 'Supabase não configurado' } });
  supabase.auth.signUp = async () => ({ data: null, error: { message: 'Supabase não configurado' } });
  supabase.auth.signOut = async () => ({ error: null });
} else {
  supabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  );
}

export { supabase };



