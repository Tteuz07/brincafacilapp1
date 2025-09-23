#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando deploy do BrincaFácil...\n');

try {
  // 1. Verificar se o build existe
  console.log('📦 Verificando build...');
  if (!fs.existsSync('dist')) {
    console.log('🔨 Fazendo build...');
    execSync('npm run build', { stdio: 'inherit' });
  }
  
  // 2. Verificar se as variáveis de ambiente estão configuradas
  console.log('🔧 Verificando configurações...');
  const envFile = '.env';
  if (!fs.existsSync(envFile)) {
    console.log('⚠️  Arquivo .env não encontrado!');
    console.log('📝 Crie um arquivo .env com as seguintes variáveis:');
    console.log('   VITE_SUPABASE_URL=https://seu-projeto.supabase.co');
    console.log('   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui');
    console.log('\n💡 Use o arquivo env.example como referência.');
    process.exit(1);
  }
  
  // 3. Deploy no Vercel
  console.log('🌐 Fazendo deploy no Vercel...');
  execSync('vercel --prod --yes', { stdio: 'inherit' });
  
  console.log('\n✅ Deploy concluído com sucesso!');
  console.log('🎉 Seu app está online!');
  
} catch (error) {
  console.error('❌ Erro durante o deploy:', error.message);
  process.exit(1);
}
