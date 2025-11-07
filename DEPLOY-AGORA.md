# 🚀 Deploy Agora - Passos Rápidos

## ⚡ Passos Rápidos (5 minutos)

### 1. Fazer Build Local (Teste)

```bash
npm run build
```

**Se der erro, corrija antes de continuar!**

### 2. Verificar Variáveis na Vercel

1. Acesse: https://vercel.com
2. Vá em **Settings** → **Environment Variables**
3. Verifique se estas variáveis existem e estão corretas:

```
VITE_SUPABASE_URL = https://medixxzluqpbdgnjcmyz.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZGl4eHpsdXFwYmRnbmpjbXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0ODIyNDIsImV4cCI6MjA3ODA1ODI0Mn0.46493DxiLSr2wN9CcwWPJw7m8ZF3E9_8KI-q0RHDB3I
```

**Importante:** Marque para **Production**, **Preview** e **Development**!

### 3. Fazer Commit e Push

```bash
git add .
git commit -m "Deploy em produção"
git push
```

### 4. Aguardar Deploy Automático

1. Vá em **Deployments** na Vercel
2. Aguarde o build terminar (2-5 minutos)
3. Clique no deploy para ver os logs

### 5. Testar

1. Acesse a URL do seu projeto
2. Abra o console (F12)
3. Verifique se aparece: `🔍 DEBUG Supabase Env:`
4. Teste fazer login/cadastro

## ✅ Pronto!

Se tudo funcionou, seu app está em produção! 🎉

## 🆘 Se Der Erro

1. **Erro no build:** Verifique os logs na Vercel
2. **Variáveis não funcionam:** Faça um **Redeploy** após atualizar
3. **Site não carrega:** Verifique o `vercel.json`

## 📋 Checklist Final

- [ ] Build local funciona (`npm run build`)
- [ ] Variáveis estão na Vercel
- [ ] Commit e push feitos
- [ ] Deploy concluído na Vercel
- [ ] Site testado e funcionando
