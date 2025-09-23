# 🚀 Deploy Simples - BrincaFácil

## Opção 1: Deploy no Vercel (Recomendado)

### Passo 1: Preparar o projeto
```bash
# 1. Fazer build
npm run build

# 2. Verificar se funcionou
npm run preview
```

### Passo 2: Deploy via Vercel CLI
```bash
# 1. Instalar Vercel CLI (se não tiver)
npm install -g vercel

# 2. Fazer login
vercel login

# 3. Deploy
vercel --prod
```

### Passo 3: Configurar variáveis de ambiente
No dashboard do Vercel:
1. Vá em Settings > Environment Variables
2. Adicione:
   - `VITE_SUPABASE_URL` = sua URL do Supabase
   - `VITE_SUPABASE_ANON_KEY` = sua chave anônima do Supabase

## Opção 2: Deploy no Netlify

### Passo 1: Preparar build
```bash
npm run build
```

### Passo 2: Deploy via Netlify CLI
```bash
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Deploy
netlify deploy --prod --dir=dist
```

### Passo 3: Configurar variáveis
No dashboard do Netlify:
1. Site settings > Environment variables
2. Adicione as mesmas variáveis do Supabase

## Opção 3: Deploy Manual (GitHub Pages)

### Passo 1: Configurar GitHub Actions
Crie o arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Passo 2: Configurar secrets
No GitHub:
1. Settings > Secrets and variables > Actions
2. Adicione as variáveis do Supabase

## ✅ Checklist Pós-Deploy

- [ ] App carrega corretamente
- [ ] Login funciona
- [ ] PWA instalável
- [ ] Modo offline funciona
- [ ] Todas as páginas navegam
- [ ] Imagens carregam
- [ ] Performance boa (Lighthouse > 90)

## 🔧 Troubleshooting

### Build falha
```bash
# Limpar cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

### PWA não funciona
- Verificar se o service worker está sendo servido
- Testar no Chrome DevTools > Application > Service Workers

### Imagens não carregam
- Verificar se os caminhos estão corretos
- Usar caminhos relativos: `./imagem.png`

## 📱 Testando PWA

1. Abra o app no Chrome
2. F12 > Application > Manifest
3. Verificar se está instalável
4. Testar modo offline (Network > Offline)

---

**🎯 Recomendação**: Use o Vercel para começar - é o mais simples e rápido!
