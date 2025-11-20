# 🚀 Deploy em Produção - BrincaFácil

## ✅ **Pré-Deploy - Limpeza Realizada**

- ✅ Removido `TestImage` do App.jsx
- ✅ Removida rota `/test-image`
- ✅ Verificado `vercel.json` configurado corretamente
- ✅ Verificado build sem erros de linter

## 📋 **Checklist de Deploy**

### 1. **Configuração da Vercel**

#### **Opção A: Deploy via Git (Recomendado)**
1. Faça commit das alterações:
```bash
git add .
git commit -m "Preparação para deploy em produção"
git push
```

2. Conecte o repositório na Vercel:
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "Add New Project"
   - Conecte seu repositório Git
   - A Vercel detectará automaticamente as configurações do `vercel.json`

#### **Opção B: Deploy via CLI**
```bash
# Instalar Vercel CLI (se ainda não tiver)
npm i -g vercel

# Fazer login
vercel login

# Deploy em produção
vercel --prod
```

### 2. **Variáveis de Ambiente**

Configure as seguintes variáveis no painel da Vercel (Settings → Environment Variables):

```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

**Opcional (se usar Kirvano/Hotmart):**
```
VITE_KIRVANO_API_KEY=sua_api_key
VITE_KIRVANO_PRODUCT_ID=seu_product_id
VITE_HOTMART_CLIENT_ID=seu_client_id
VITE_HOTMART_CLIENT_SECRET=seu_client_secret
```

### 3. **Configurações de Build**

A Vercel detectará automaticamente:
- ✅ **Framework**: Vite
- ✅ **Build Command**: `npm run build`
- ✅ **Output Directory**: `dist`
- ✅ **Node Version**: 18.x (ou superior)

### 4. **Verificar Deploy**

Após o deploy, verifique:
- ✅ Build executado com sucesso
- ✅ Todas as rotas funcionando
- ✅ Imagens carregando corretamente
- ✅ localStorage funcionando
- ✅ Autenticação funcionando

## 🔧 **Arquivos de Configuração**

### **vercel.json** ✅
```json
{
  "version": 2,
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### **public/_redirects** (se necessário)
```
/*    /index.html   200
```

## 🚨 **Problemas Comuns e Soluções**

### **Erro: Build falha**
- Verifique se todas as dependências estão no `package.json`
- Execute `npm install` localmente para verificar
- Verifique logs de build na Vercel

### **Erro: 404 em rotas**
- Verifique se `vercel.json` tem o `rewrites` configurado
- Verifique se `public/_redirects` existe (se necessário)

### **Erro: Variáveis de ambiente não encontradas**
- Verifique se as variáveis estão configuradas no painel da Vercel
- Verifique se os nomes começam com `VITE_` (necessário para Vite)

### **Erro: Imagens não carregam**
- Verifique se as imagens estão na pasta `public/`
- Verifique se os caminhos estão corretos (usar `/` no início)

## 📊 **Monitoramento Pós-Deploy**

1. **Verificar Logs**:
   - Acesse o painel da Vercel
   - Vá em "Functions" → "View Function Logs"
   - Verifique erros em produção

2. **Testar Funcionalidades**:
   - Login
   - Navegação entre páginas
   - Carregamento de atividades
   - Sistema de favoritos
   - Histórico de atividades

3. **Performance**:
   - Verificar tempo de carregamento
   - Verificar tamanho do bundle
   - Verificar uso de cache

## 🎯 **URLs de Teste**

Após o deploy, teste:
- `https://seu-projeto.vercel.app/` - Home
- `https://seu-projeto.vercel.app/login` - Login
- `https://seu-projeto.vercel.app/activities` - Atividades
- `https://seu-projeto.vercel.app/drawings` - Desenhos
- `https://seu-projeto.vercel.app/workshop` - Oficina

## ✅ **Status do Projeto**

- ✅ Código limpo (TestImage removido)
- ✅ Build configurado
- ✅ Vercel.json configurado
- ✅ Rotas configuradas
- ✅ Error Boundary implementado
- ✅ Otimizações aplicadas

**Pronto para deploy em produção!** 🚀




