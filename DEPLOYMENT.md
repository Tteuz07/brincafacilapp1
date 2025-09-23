# 🚀 Guia de Deploy - BrincaFácil

## Pré-requisitos

- [ ] Projeto configurado localmente
- [ ] Banco Supabase configurado
- [ ] Ícones PWA gerados (ver `icons-generation.md`)
- [ ] Variáveis de ambiente definidas

## 1. Preparação para Produção

### Verificar Build Local
```bash
npm run build
npm run preview
```

### Checklist de Produção
- [ ] Todas as funcionalidades testadas
- [ ] PWA funcionando offline
- [ ] Responsividade verificada
- [ ] Performance otimizada (Lighthouse > 90)
- [ ] Acessibilidade verificada

## 2. Deploy no Vercel (Recomendado)

### Configuração Inicial

1. **Conectar Repositório**:
   - Acesse [vercel.com](https://vercel.com)
   - Importe o projeto do GitHub
   - Escolha o repositório `brincafacil-app`

2. **Configurações de Build**:
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Variáveis de Ambiente**:
   ```
   VITE_SUPABASE_URL=sua_url_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_supabase
   ```

### Deploy Automático
- Cada push na branch `main` fará deploy automático
- Preview deployments para PRs
- Domínio personalizado disponível

## 3. Deploy no Netlify

### Via Dashboard

1. **Conectar Repositório**:
   - Acesse [netlify.com](https://netlify.com)
   - "New site from Git"
   - Conecte com GitHub

2. **Configurações de Build**:
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Variáveis de Ambiente**:
   - Site settings > Environment variables
   - Adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

### Via CLI
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy inicial
netlify deploy --prod --dir=dist
```

## 4. Deploy Manual (VPS/Servidor)

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name brincafacil.com;
    
    root /var/www/brincafacil/dist;
    index index.html;
    
    # PWA Support
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
}
```

### SSL com Let's Encrypt
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Gerar certificado
sudo certbot --nginx -d brincafacil.com
```

## 5. Configurações de Domínio

### DNS Records
```
Type    Name    Value
A       @       IP_DO_SERVIDOR
A       www     IP_DO_SERVIDOR
CNAME   api     supabase-project-url
```

### Redirects (Netlify)
```toml
# _redirects file
/api/*  https://seu-projeto.supabase.co/rest/v1/:splat  200
/*      /index.html   200
```

## 6. Monitoramento e Analytics

### Performance Monitoring
- **Lighthouse CI**: Auditorias automáticas de performance
- **Web Vitals**: Monitoramento de métricas core
- **Vercel Analytics**: Analytics integrado (se usando Vercel)

### Error Tracking
```bash
# Adicionar Sentry (opcional)
npm install @sentry/react @sentry/tracing
```

### Example Sentry Config
```javascript
// src/lib/sentry.js
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
});
```

## 7. PWA Checklist

### Manifest Validation
- [ ] Arquivo manifest.json válido
- [ ] Ícones em todos os tamanhos
- [ ] Start URL configurada
- [ ] Display mode "standalone"

### Service Worker
- [ ] Cache de assets estáticos
- [ ] Funcionalidade offline
- [ ] Estratégias de cache configuradas

### Testing PWA
```bash
# Usando Lighthouse
npx lighthouse https://brincafacil.com --view

# Verificar instalabilidade
# Chrome DevTools > Application > Manifest
```

## 8. Backup e Segurança

### Backup do Banco (Supabase)
```sql
-- Backup manual via SQL
pg_dump -h db.projeto.supabase.co -U postgres -d postgres > backup.sql
```

### Variáveis de Ambiente Seguras
- Nunca commitar arquivos `.env`
- Usar secrets do provedor (Vercel/Netlify)
- Rotacionar chaves periodicamente

## 9. Post-Deploy Checklist

### Funcionalidades
- [ ] Login funcionando
- [ ] Criação de perfil
- [ ] Navegação entre páginas
- [ ] Sistema de favoritos
- [ ] PWA instalável
- [ ] Modo offline

### Performance
- [ ] Lighthouse Score > 90
- [ ] Core Web Vitals otimizados
- [ ] Imagens otimizadas
- [ ] Bundle size < 1MB

### SEO e Acessibilidade
- [ ] Meta tags configuradas
- [ ] Aria labels implementados
- [ ] Contraste adequado
- [ ] Navegação por teclado

## 10. Comandos Úteis

### Build e Test
```bash
# Build local
npm run build

# Preview da build
npm run preview

# Lint check
npm run lint

# Test PWA offline
# 1. Build e serve
# 2. Chrome DevTools > Network > Offline
# 3. Testar funcionalidades
```

### Debugging
```bash
# Verificar tamanho do bundle
npx vite-bundle-analyzer dist

# Analisar performance
npx lighthouse-ci autorun

# Verificar PWA
npx pwa-asset-generator
```

## 11. Rollback Plan

### Vercel
- Dashboard > Deployments
- Selecionar versão anterior
- "Promote to Production"

### Netlify
- Site deploys > Selecionar build anterior
- "Publish deploy"

### Manual
```bash
# Git rollback
git revert HEAD
git push origin main

# Rebuild e redeploy
npm run build
# Upload da pasta dist
```

---

## 🎯 Próximos Passos

1. **Configurar domínio personalizado**
2. **Implementar analytics**
3. **Configurar monitoramento de erros**
4. **Otimizar performance**
5. **Configurar CI/CD pipeline**

---

**Importante**: Teste sempre em ambiente de staging antes de fazer deploy em produção!















