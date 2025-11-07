# 📝 Criar Arquivo .env Local

## ✅ Credenciais para o arquivo .env

Crie um arquivo chamado `.env` na **raiz do projeto** (mesma pasta onde está o `package.json`) com este conteúdo:

```env
VITE_SUPABASE_URL=https://medixxzluqpbdgnjcmyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZGl4eHpsdXFwYmRnbmpjbXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0ODIyNDIsImV4cCI6MjA3ODA1ODI0Mn0.46493DxiLSr2wN9CcwWPJw7m8ZF3E9_8KI-q0RHDB3I
```

## 📋 Passos

1. Na raiz do projeto, crie um arquivo chamado `.env` (sem extensão)
2. Cole o conteúdo acima
3. Salve o arquivo
4. Reinicie o servidor de desenvolvimento (`npm run dev`)

## ⚠️ Importante

- O arquivo `.env` não deve ser commitado no Git (já está no .gitignore)
- Para produção, use as variáveis de ambiente na Vercel

