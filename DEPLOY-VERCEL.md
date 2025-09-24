# 🚀 Deploy na Vercel - BrincaFácil

## ✅ **Arquivos de Configuração Criados:**

### 1. **vercel.json** - Configuração principal da Vercel
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. **public/_redirects** - Redirecionamentos para SPA
```
/*    /index.html   200
```

### 3. **.vercelignore** - Arquivos ignorados no deploy
```
node_modules
.env
*.log
.DS_Store
```

## 🔧 **Configuração no Painel da Vercel:**

### **Variáveis de Ambiente:**
1. Acesse o painel da Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione as seguintes variáveis:

```
VITE_SUPABASE_URL = https://zbrqgtxrtbsezlutxopz.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpicnFndHhydGJzZXpsdXR4b3B6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMTE1MDQsImV4cCI6MjA3MzY4NzUwNH0.SD8gwzrOvglLUF7fGYwQAN_VGzClLJlHDkn0TJQZogE
VITE_KIRVANO_API_KEY = 12345
VITE_KIRVANO_PRODUCT_ID = seu-produto-id
VITE_KIRVANO_WEBHOOK_SECRET = brincafacil01
```

## 🚀 **Passos para Deploy:**

### **1. Fazer Commit das Alterações:**
```bash
git add .
git commit -m "Configuração para deploy na Vercel"
git push
```

### **2. Deploy Automático:**
- A Vercel detectará automaticamente as mudanças
- O build será executado com `npm run build`
- Os arquivos serão servidos da pasta `dist`

### **3. Verificar Deploy:**
- Acesse: `https://brincafacil1.vercel.app`
- Teste a rota: `https://brincafacil1.vercel.app/login`

## 🔍 **Se Ainda Der 404:**

### **Verificar:**
1. ✅ **vercel.json** está na raiz do projeto
2. ✅ **public/_redirects** está na pasta public
3. ✅ **Variáveis de ambiente** estão configuradas
4. ✅ **Build** foi executado com sucesso

### **Logs da Vercel:**
- Acesse **Functions** → **View Function Logs**
- Verifique se há erros no build

## 🎯 **URLs de Teste:**
- **Home:** `https://brincafacil1.vercel.app/`
- **Login:** `https://brincafacil1.vercel.app/login`
- **Atividades:** `https://brincafacil1.vercel.app/activities`

## 📱 **Teste de Login:**
Use os emails autorizados:
- `admin@brincafacil.com`
- `teste@exemplo.com`
- `mateus@kirvano.com`

