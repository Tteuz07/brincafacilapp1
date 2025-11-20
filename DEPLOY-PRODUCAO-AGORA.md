# 🚀 Deploy em Produção - Guia Rápido

## ⚡ Passos para Deploy

### 1. Preparação Local

```powershell
# Navegar para o diretório do projeto
cd "D:\App em contrução\brincafacilapp1- Pronto\brincafacilapp1"

# Testar build localmente
npm run build

# Se o build funcionar, continue. Se não, corrija os erros primeiro.
```

### 2. Verificar Variáveis de Ambiente na Vercel

1. Acesse: https://vercel.com
2. Vá em **Settings** → **Environment Variables**
3. Verifique/Adicione estas variáveis:

```
VITE_SUPABASE_URL = https://medixxzluqpbdgnjcmyz.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZGl4eHpsdXFwYmRnbmpjbXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0ODIyNDIsImV4cCI6MjA3ODA1ODI0Mn0.46493DxiLSr2wN9CcwWPJw7m8ZF3E9_8KI-q0RHDB3I
```

**Importante:** Marque para **Production**, **Preview** e **Development**!

### 3. Opção A: Deploy via Git (Recomendado)

```powershell
# Navegar para o diretório
cd "D:\App em contrução\brincafacilapp1- Pronto\brincafacilapp1"

# Verificar status do Git
git status

# Adicionar todas as alterações
git add .

# Fazer commit
git commit -m "Deploy em produção - melhorias de persistência de login"

# Fazer push
git push origin main
```

Após o push, a Vercel fará deploy automático se o repositório estiver conectado.

### 4. Opção B: Deploy via Vercel CLI

```powershell
# Instalar Vercel CLI (se ainda não tiver)
npm install -g vercel

# Navegar para o diretório
cd "D:\App em contrução\brincafacilapp1- Pronto\brincafacilapp1"

# Fazer login na Vercel
vercel login

# Deploy em produção
vercel --prod
```

### 5. Verificar Deploy

1. Acesse o painel da Vercel: https://vercel.com
2. Vá em **Deployments**
3. Aguarde o build terminar (2-5 minutos)
4. Clique no deploy para ver os logs
5. Acesse a URL do projeto

### 6. Testar em Produção

1. Acesse a URL do seu projeto
2. Abra o console do navegador (F12)
3. Verifique se aparece: `🔍 DEBUG Supabase Env:`
4. Teste fazer login/cadastro
5. Verifique se a persistência de login está funcionando

## ✅ Checklist Final

- [ ] Build local funciona (`npm run build`)
- [ ] Variáveis de ambiente estão configuradas na Vercel
- [ ] Commit e push feitos (se usar Git)
- [ ] Deploy concluído na Vercel
- [ ] Site testado e funcionando
- [ ] Login e persistência de sessão funcionando

## 🆘 Solução de Problemas

### Erro no Build
- Verifique os logs na Vercel
- Teste o build localmente primeiro
- Verifique se todas as dependências estão no `package.json`

### Variáveis de Ambiente Não Funcionam
- Verifique se as variáveis estão marcadas para **Production**
- Faça um **Redeploy** após atualizar as variáveis
- Verifique se os nomes das variáveis estão corretos (começam com `VITE_`)

### Site Não Carrega
- Verifique o `vercel.json`
- Verifique se o `outputDirectory` está correto (`dist`)
- Verifique os logs de erro na Vercel

### Problemas com Autenticação
- Verifique se as credenciais do Supabase estão corretas
- Verifique se o Supabase Auth está habilitado
- Verifique os logs do console do navegador

## 📝 Notas Importantes

- As melhorias de persistência de login foram implementadas e estarão ativas após o deploy
- O sistema agora renova tokens automaticamente a cada 5 minutos
- O listener de auth state monitora eventos de autenticação
- Usuários já logados não serão afetados

## 🎉 Pronto!

Após seguir estes passos, seu app estará em produção com todas as melhorias implementadas!

