# 🚀 Deploy Simples do BrincaFácil

## 📋 Opções de Deploy

### **Opção 1: Vercel (Recomendado)**
1. Acesse [vercel.com](https://vercel.com)
2. Conecte sua conta GitHub
3. Importe o repositório `brincafacilapp1`
4. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Clique em "Deploy"

### **Opção 2: Netlify**
1. Acesse [netlify.com](https://netlify.com)
2. Conecte sua conta GitHub
3. Importe o repositório `brincafacilapp1`
4. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Clique em "Deploy"

### **Opção 3: GitHub Pages**
1. No repositório GitHub, vá em "Settings" > "Pages"
2. Escolha "GitHub Actions" como source
3. Crie um arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## ✅ Pronto!

O PWA estará disponível em:
- **Vercel**: `https://brincafacilapp1.vercel.app`
- **Netlify**: `https://brincafacilapp1.netlify.app`
- **GitHub Pages**: `https://tteuz07.github.io/brincafacilapp1`

## 🔧 Configuração Final

1. **Configure o Supabase** (siga `SUPABASE-SETUP.md`)
2. **Faça o deploy** (escolha uma opção acima)
3. **Teste o PWA** com os emails autorizados
4. **Adicione mais emails** no painel do Supabase conforme necessário

## 📱 Funcionalidades

- ✅ Login por email autorizado
- ✅ Brincadeiras personalizadas
- ✅ Desenhos educativos
- ✅ Sistema de favoritos
- ✅ PWA completo (offline, instalável)