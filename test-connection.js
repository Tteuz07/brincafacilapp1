import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Lê o arquivo .env
const envPath = join(__dirname, '.env');
let envContent = '';
try {
  envContent = readFileSync(envPath, 'utf-8');
} catch (error) {
  console.error('Erro ao ler .env:', error.message);
  process.exit(1);
}

// Parse simples do .env
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    envVars[key] = value;
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseAnonKey = envVars.VITE_SUPABASE_ANON;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON não encontradas no .env');
  process.exit(1);
}

console.log('🔌 Conectando ao Supabase...');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

(async () => {
  console.log('📊 Testando conexão com a tabela licencas...');
  const { data, error } = await supabase.from('licencas').select('*').limit(1);
  
  if (error) {
    console.error('❌ Erro Supabase:', error.message);
    console.error('Detalhes:', error);
    process.exit(1);
  } else {
    console.log('✅ Conexão OK!');
    console.log('Dados retornados:', data);
  }
})();










