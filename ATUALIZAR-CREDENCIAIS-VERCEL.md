# 🔧 Atualizar Credenciais na Vercel

## ✅ Credenciais Novas

```
VITE_SUPABASE_URL=https://medixxzluqpbdgnjcmyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZGl4eHpsdXFwYmRnbmpjbXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0ODIyNDIsImV4cCI6MjA3ODA1ODI0Mn0.46493DxiLSr2wN9CcwWPJw7m8ZF3E9_8KI-q0RHDB3I
```

## 📋 Passos para Atualizar na Vercel

### 1. Acessar o Painel da Vercel

1. Acesse: https://vercel.com
2. Faça login
3. Vá no seu projeto `brincafacilapp1` (ou o nome do seu projeto)

### 2. Atualizar Variáveis de Ambiente

1. Clique em **Settings** (no menu superior)
2. Clique em **Environment Variables** (no menu lateral)
3. Procure por:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### 3. Editar Cada Variável

Para cada variável:

1. Clique nos **três pontinhos** (⋯) ao lado da variável
2. Clique em **Edit**
3. Cole o novo valor:
   - `VITE_SUPABASE_URL` → `https://medixxzluqpbdgnjcmyz.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` → `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZGl4eHpsdXFwYmRnbmpjbXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0ODIyNDIsImV4cCI6MjA3ODA1ODI0Mn0.46493DxiLSr2wN9CcwWPJw7m8ZF3E9_8KI-q0RHDB3I`
4. Marque os ambientes:
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development**
5. Clique em **Save**

### 4. Fazer Novo Deploy

Após atualizar as variáveis:

1. Vá em **Deployments** (no menu superior)
2. Clique nos **três pontinhos** (⋯) do último deploy
3. Clique em **Redeploy**
4. Ou faça um novo commit e push (deploy automático)

## ✅ Verificação

Após o deploy, verifique:

1. Acesse o site em produção
2. Abra o console (F12)
3. Procure por: `🔍 DEBUG Supabase Env:`
4. Deve mostrar:
   - `hasUrl: true`
   - `hasKey: true`
   - `urlPreview: "https://medixxzluqpbdgnjcmyz.sup..."`

## 🆘 Se Não Funcionar

1. **Limpe o cache do navegador** (`Ctrl + Shift + Delete`)
2. **Aguarde alguns minutos** (as variáveis podem levar tempo para propagar)
3. **Verifique se as variáveis estão marcadas para Production**

