# 🚀 Deploy em Produção - Guia Completo

## ✅ Checklist Antes do Deploy

- [ ] Credenciais do Supabase estão corretas no `.env` local
- [ ] Código está funcionando localmente (`npm run dev`)
- [ ] Build funciona sem erros (`npm run build`)
- [ ] Todas as alterações foram commitadas no Git

## 📋 Passo 1: Verificar Build Local

Antes de fazer deploy, teste o build localmente:

```bash
# Limpar build anterior
rm -rf dist

# Fazer build
npm run build

# Verificar se o build foi criado
ls -la dist
```

**Se der erro no build, corrija antes de continuar!**

## 📋 Passo 2: Verificar Variáveis de Ambiente

Certifique-se de que as variáveis estão corretas no `.env`:

```env
VITE_SUPABASE_URL=https://medixxzluqpbdgnjcmyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZGl4eHpsdXFwYmRnbmpjbXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0ODIyNDIsImV4cCI6MjA3ODA1ODI0Mn0.46493DxiLSr2wN9CcwWPJw7m8ZF3E9_8KI-q0RHDB3I
```

## 📋 Passo 3: Fazer Commit e Push

```bash
# Adicionar todas as alterações
git add .

# Fazer commit
git commit -m "Deploy em produção - versão final"

# Fazer push
git push origin main
```

## 📋 Passo 4: Configurar Variáveis na Vercel

### 4.1. Acessar o Painel da Vercel

1. Acesse: https://vercel.com
2. Faça login
3. Vá no seu projeto

### 4.2. Atualizar Variáveis de Ambiente

1. Clique em **Settings** (no menu superior)
2. Clique em **Environment Variables** (no menu lateral)
3. Verifique/Adicione as seguintes variáveis:

**Variáveis Obrigatórias:**
```
VITE_SUPABASE_URL = https://medixxzluqpbdgnjcmyz.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZGl4eHpsdXFwYmRnbmpjbXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0ODIyNDIsImV4cCI6MjA3ODA1ODI0Mn0.46493DxiLSr2wN9CcwWPJw7m8ZF3E9_8KI-q0RHDB3I
```

**Para cada variável:**
1. Se já existe, clique nos **três pontinhos** (⋯) → **Edit**
2. Se não existe, clique em **Add New**
3. Cole o valor
4. Marque os ambientes:
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development**
5. Clique em **Save**

## 📋 Passo 5: Fazer Deploy

### Opção A: Deploy Automático (Recomendado)

Se o projeto já está conectado ao Git:
1. O deploy acontece automaticamente após o `git push`
2. Acesse **Deployments** para ver o progresso
3. Aguarde o build terminar

### Opção B: Deploy Manual

1. Vá em **Deployments**
2. Clique em **Add New...** → **Deploy**
3. Selecione o branch `main`
4. Clique em **Deploy**

## 📋 Passo 6: Verificar Deploy

### 6.1. Verificar Build

1. Vá em **Deployments**
2. Clique no último deploy
3. Verifique os **Build Logs**
4. Deve aparecer: `Build completed successfully`

### 6.2. Testar o Site

1. Acesse a URL do deploy (ex: `https://seu-projeto.vercel.app`)
2. Abra o console do navegador (F12)
3. Procure por: `🔍 DEBUG Supabase Env:`
4. Verifique:
   - `hasUrl: true`
   - `hasKey: true`
   - `urlCompleto: "https://medixxzluqpbdgnjcmyz.supabase.co"`
   - `isNewAccount: true`

### 6.3. Testar Funcionalidades

- [ ] Página de login carrega
- [ ] Cadastro funciona
- [ ] Quiz aparece para novos usuários
- [ ] Atividades carregam
- [ ] Favoritos funcionam
- [ ] Perfil carrega

## 🔧 Se Houver Problemas

### Erro no Build

1. Verifique os **Build Logs** na Vercel
2. Procure por erros específicos
3. Teste o build localmente: `npm run build`

### Variáveis de Ambiente Não Funcionam

1. Verifique se as variáveis estão marcadas para **Production**
2. Faça um **Redeploy** após atualizar as variáveis
3. Aguarde alguns minutos (propagação)

### Site Não Carrega

1. Verifique se o `vercel.json` está correto
2. Verifique se o build foi criado na pasta `dist`
3. Verifique os logs de erro no console do navegador

## 📱 URLs de Teste

Após o deploy, teste estas rotas:

- **Home:** `https://seu-projeto.vercel.app/`
- **Login:** `https://seu-projeto.vercel.app/login`
- **Atividades:** `https://seu-projeto.vercel.app/activities`
- **Desenhos:** `https://seu-projeto.vercel.app/cartoons`
- **Favoritos:** `https://seu-projeto.vercel.app/favorites`
- **Perfil:** `https://seu-projeto.vercel.app/profile`

## ✅ Deploy Concluído!

Após verificar tudo, seu app está em produção! 🎉

## 🔄 Atualizações Futuras

Para atualizar o app em produção:

1. Faça as alterações no código
2. Commit e push: `git add . && git commit -m "Atualização" && git push`
3. O deploy acontece automaticamente
4. Aguarde alguns minutos e teste

