# 🚨 CORREÇÃO URGENTE: Credenciais do Supabase

## ⚠️ Problema Detectado

O erro mostra que está usando a conta **ANTIGA** do Supabase:
- ❌ **Errado:** `upogaucjpritgyhunpdz.supabase.co`
- ✅ **Correto:** `medixxzluqpbdgnjcmyz.supabase.co`

## ✅ O Que Foi Feito

Atualizei o código para **FORÇAR** o uso da conta nova, mesmo se o `.env` estiver com credenciais antigas.

## 🛠️ Ainda Precisa Fazer

### 1. Atualizar Arquivo `.env` Local

Abra o arquivo `.env` na raiz do projeto e **SUBSTITUA** tudo por:

```env
VITE_SUPABASE_URL=https://medixxzluqpbdgnjcmyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZGl4eHpsdXFwYmRnbmpjbXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0ODIyNDIsImV4cCI6MjA3ODA1ODI0Mn0.46493DxiLSr2wN9CcwWPJw7m8ZF3E9_8KI-q0RHDB3I
```

### 2. Atualizar na Vercel (IMPORTANTE!)

1. Acesse [vercel.com](https://vercel.com)
2. Vá no seu projeto
3. Vá em **Settings** → **Environment Variables**
4. **DELETE** as variáveis antigas:
   - `VITE_SUPABASE_URL` (se tiver a URL antiga)
   - `VITE_SUPABASE_ANON_KEY` (se tiver a chave antiga)
5. **ADICIONE** as novas:
   - **Key:** `VITE_SUPABASE_URL`
   - **Value:** `https://medixxzluqpbdgnjcmyz.supabase.co`
   - **Environments:** Production, Preview, Development
   
   - **Key:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZGl4eHpsdXFwYmRnbmpjbXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0ODIyNDIsImV4cCI6MjA3ODA1ODI0Mn0.46493DxiLSr2wN9CcwWPJw7m8ZF3E9_8KI-q0RHDB3I`
   - **Environments:** Production, Preview, Development
6. Clique em **Save**
7. **Redeploy** o projeto (ou aguarde alguns minutos para atualizar automaticamente)

### 3. Limpar Cache do Navegador

1. Pressione **Ctrl + Shift + Delete**
2. Marque "Imagens e arquivos em cache"
3. Marque "Cookies e outros dados do site"
4. Clique em "Limpar dados"
5. Ou use **modo anônimo** (Ctrl + Shift + N)

### 4. Reiniciar o Servidor Local

```bash
# Pare o servidor (Ctrl + C)
# Inicie novamente
npm run dev
```

## ✅ Verificar se Funcionou

1. Abra o app no navegador
2. Pressione **F12** para abrir o DevTools
3. Vá na aba **Console**
4. Procure por: `🔍 DEBUG Supabase Env:`
5. Verifique:
   - `urlCompleto` deve ser: `https://medixxzluqpbdgnjcmyz.supabase.co`
   - `isNewAccount` deve ser: `true`
   - **NÃO deve aparecer:** `upogaucjpritgyhunpdz`

## 🎯 Teste Final

1. Limpe o usuário no Supabase (se necessário):
   ```sql
   DELETE FROM auth.users WHERE email = 'teste@gmail.com';
   ```

2. Insira a licença:
   ```sql
   INSERT INTO public.licencas (email, status, origem, updated_at)
   VALUES ('teste@gmail.com', 'pago', NULL, NOW())
   ON CONFLICT (email) DO UPDATE 
   SET status = 'pago', updated_at = NOW();
   ```

3. Tente cadastrar com `teste@gmail.com`

4. O erro 422 **NÃO deve mais aparecer** se estiver usando a conta correta!

## ⚠️ Importante

O código agora **FORÇA** o uso da conta nova, mas você ainda precisa:
- ✅ Atualizar o `.env` local
- ✅ Atualizar na Vercel
- ✅ Limpar cache do navegador

Isso garante que tudo funcione corretamente!

