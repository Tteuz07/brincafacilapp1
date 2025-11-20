# 🚀 Comandos para Deploy em Produção

## ✅ **Pré-Deploy - Concluído**

- ✅ Removido `TestImage` do App.jsx
- ✅ Removida rota `/test-image`
- ✅ Build testado e funcionando
- ✅ `vercel.json` configurado
- ✅ `public/_redirects` configurado

## 📋 **Opções de Deploy**

### **Opção 1: Deploy via Git (Recomendado)**

1. **Fazer commit das alterações:**
```bash
git add .
git commit -m "Preparação para deploy em produção"
git push
```

2. **Na Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Conecte seu repositório Git
   - A Vercel detectará automaticamente as configurações
   - Configure as variáveis de ambiente
   - Deploy automático será executado

### **Opção 2: Deploy via CLI**

```bash
# Instalar Vercel CLI (se ainda não tiver)
npm i -g vercel

# Fazer login
vercel login

# Deploy em produção
vercel --prod
```

### **Opção 3: Deploy via Dashboard Vercel**

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Add New Project"
3. Conecte seu repositório Git
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Adicione variáveis de ambiente
6. Clique em "Deploy"

## 🔧 **Variáveis de Ambiente Necessárias**

Configure no painel da Vercel (Settings → Environment Variables):

### **Obrigatórias:**
```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

### **Opcionais (se usar):**
```
VITE_KIRVANO_API_KEY=sua_api_key
VITE_KIRVANO_PRODUCT_ID=seu_product_id
VITE_HOTMART_CLIENT_ID=seu_client_id
VITE_HOTMART_CLIENT_SECRET=seu_client_secret
```

## ✅ **Status do Build**

- ✅ Build executado com sucesso
- ✅ 2051 módulos transformados
- ✅ Arquivos gerados na pasta `dist/`
- ⚠️ Aviso sobre chunks grandes (normal, não impede deploy)

## 🎯 **Próximos Passos**

1. **Fazer commit e push** das alterações
2. **Conectar repositório na Vercel** (se ainda não conectou)
3. **Configurar variáveis de ambiente** no painel da Vercel
4. **Aguardar deploy automático** ou executar manualmente
5. **Testar a aplicação** após o deploy

## 📊 **Verificação Pós-Deploy**

Após o deploy, verifique:
- ✅ Home carrega corretamente
- ✅ Login funciona
- ✅ Navegação entre páginas funciona
- ✅ Imagens carregam
- ✅ localStorage funciona
- ✅ Todas as rotas funcionam

## 🚨 **Se Der Erro**

1. **Verificar logs** na Vercel (Functions → View Function Logs)
2. **Verificar variáveis de ambiente** estão configuradas
3. **Verificar build local** (`npm run build`)
4. **Verificar console do navegador** para erros

**Projeto pronto para deploy em produção!** 🚀




