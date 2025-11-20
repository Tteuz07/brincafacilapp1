# ✅ Verificar Credenciais do Supabase

## 🎯 Problema: "Este e-mail já está cadastrado"

Se você está vendo esse erro mesmo após limpar os usuários, pode ser que:

1. **As credenciais estão apontando para a conta ANTIGA**
2. **As credenciais não foram atualizadas na Vercel**
3. **Há cache no navegador**

## 🔍 Como Verificar

### 1. Verificar no Console do Navegador

1. Abra o app no navegador
2. Pressione **F12** para abrir o DevTools
3. Vá na aba **Console**
4. Procure por: `🔍 DEBUG Supabase Env:`
5. Verifique se o `urlCompleto` contém: `medixxzluqpbdgnjcmyz`

**Se NÃO contém `medixxzluqpbdgnjcmyz`**, as credenciais estão erradas!

### 2. Verificar Arquivo `.env` Local

Abra o arquivo `.env` na raiz do projeto e verifique:

```env
VITE_SUPABASE_URL=https://medixxzluqpbdgnjcmyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Deve começar com:** `https://medixxzluqpbdgnjcmyz.supabase.co`

### 3. Verificar na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Vá no seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Verifique se:
   - `VITE_SUPABASE_URL` = `https://medixxzluqpbdgnjcmyz.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = (a chave que você recebeu)

### 4. Verificar no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Entre na sua conta
3. Vá no projeto
4. Vá em **Settings** → **API**
5. Verifique se o **Project URL** é: `https://medixxzluqpbdgnjcmyz.supabase.co`

## 🛠️ Como Corrigir

### Se as Credenciais Estão Erradas

1. **Atualizar `.env` local:**
   ```env
   VITE_SUPABASE_URL=https://medixxzluqpbdgnjcmyz.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZGl4eHpsdXFwYmRnbmpjbXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0ODIyNDIsImV4cCI6MjA3ODA1ODI0Mn0.46493DxiLSr2wN9CcwWPJw7m8ZF3E9_8KI-q0RHDB3I
   ```

2. **Atualizar na Vercel:**
   - Vá em **Settings** → **Environment Variables**
   - Edite `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
   - Clique em **Save**
   - **Redeploy** o projeto (ou aguarde alguns minutos)

3. **Limpar cache do navegador:**
   - Pressione **Ctrl + Shift + Delete**
   - Marque "Imagens e arquivos em cache"
   - Clique em "Limpar dados"
   - Ou use **modo anônimo** (Ctrl + Shift + N)

4. **Reiniciar o servidor local:**
   ```bash
   # Pare o servidor (Ctrl + C)
   # Inicie novamente
   npm run dev
   ```

## ✅ Teste Final

1. Limpe o usuário no Supabase:
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

4. Verifique no console se está usando a conta correta:
   - Procure por: `isNewAccount: true`
   - Se for `false`, as credenciais estão erradas!

## 🚨 Se Ainda Não Funcionar

1. Verifique se o email está na tabela `licencas`:
   ```sql
   SELECT * FROM public.licencas WHERE email = 'teste@gmail.com';
   ```

2. Verifique se há usuários no `auth.users`:
   ```sql
   SELECT email FROM auth.users WHERE email = 'teste@gmail.com';
   ```

3. Se houver usuário, remova:
   ```sql
   DELETE FROM auth.users WHERE email = 'teste@gmail.com';
   ```

4. Tente novamente!


