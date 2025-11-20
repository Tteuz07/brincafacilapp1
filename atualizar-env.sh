#!/bin/bash
# Script Bash para atualizar o arquivo .env
# Execute: chmod +x atualizar-env.sh && ./atualizar-env.sh

ENV_CONTENT='# Supabase - NOVA CONTA
VITE_SUPABASE_URL=https://medixxzluqpbdgnjcmyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZGl4eHpsdXFwYmRnbmpjbXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0ODIyNDIsImV4cCI6MjA3ODA1ODI0Mn0.46493DxiLSr2wN9CcwWPJw7m8ZF3E9_8KI-q0RHDB3I

# Hotmart - Configuração para consulta direta
# Para obter as credenciais, acesse: https://app-vlc.hotmart.com/tools/api
# O BASIC AUTH deve ser: Base64(CLIENT_ID:CLIENT_SECRET)
VITE_HOTMART_API_URL=https://developers.hotmart.com/payments/api/v1
VITE_HOTMART_CLIENT_ID=SEU_CLIENT_ID_AQUI
VITE_HOTMART_CLIENT_SECRET=SEU_CLIENT_SECRET_AQUI
VITE_HOTMART_BASIC_AUTH=SEU_BASIC_AUTH_BASE64_AQUI
VITE_HOTMART_PRODUCT_ID=brincafacil-premium

# Backend
PORT=3001
NODE_ENV=development

# Token da Hotmart para webhook (opcional)
HOTMART_WEBHOOK_SECRET=brincafacil01'

echo "🔄 Atualizando arquivo .env..."

# Verificar se arquivo existe
if [ -f .env ]; then
    echo "⚠️ Arquivo .env já existe. Fazendo backup..."
    cp .env ".env.backup.$(date +%Y%m%d-%H%M%S)"
    echo "✅ Backup criado"
fi

# Escrever novo conteúdo
echo "$ENV_CONTENT" > .env

echo "✅ Arquivo .env atualizado com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Reinicie o servidor (Ctrl+C e depois npm run dev)"
echo "2. Limpe o cache do navegador"
echo "3. Atualize as credenciais na Vercel também!"


