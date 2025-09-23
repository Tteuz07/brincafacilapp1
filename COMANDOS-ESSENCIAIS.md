# 🚀 Comandos Essenciais - BrincaFácil

## ⚡ Início Rápido

```bash
# 1. Instalar dependências
npm install

# 2. Configurar ambiente (criar arquivo .env)
cp .env.example .env
# Editar .env com suas credenciais do Supabase

# 3. Executar em desenvolvimento
npm run dev

# 4. Abrir no navegador
# http://localhost:5173
```

## 🔧 Comandos de Desenvolvimento

### Executar o projeto
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview da build local
```

### Qualidade do código
```bash
npm run lint         # Verificar erros de linting
npm run lint:fix     # Corrigir erros automaticamente (se disponível)
```

## 📊 Testing & Debugging

### PWA Testing
```bash
# 1. Build e preview
npm run build && npm run preview

# 2. No Chrome DevTools:
# - F12 → Application → Manifest
# - Network → Offline (testar modo offline)
# - Lighthouse → Generate report
```

### Performance Check
```bash
# Lighthouse CLI (instalar globalmente)
npm install -g lighthouse
lighthouse http://localhost:5173 --view

# Bundle Analyzer
npx vite-bundle-analyzer dist
```

## 🎯 Configuração do Supabase

### 1. Criar Projeto
- Acesse https://supabase.com
- Crie novo projeto
- Anote URL e chave anônima

### 2. Executar SQL
```sql
-- Copie e cole o conteúdo de database-setup.sql
-- no SQL Editor do Supabase
```

### 3. Adicionar Email de Teste
```sql
INSERT INTO authorized_emails (email) VALUES ('seu-email@teste.com');
```

## 📱 Teste de PWA

### Instalação Local
1. Abra Chrome/Edge
2. Acesse http://localhost:5173
3. Ícone de instalação na barra de endereço
4. "Instalar BrincaFácil"

### Teste Offline
1. F12 → Network → Offline
2. Navegue pelo app
3. Deve funcionar normalmente

## 🚀 Deploy Rápido

### Vercel (1 clique)
```bash
# 1. Push para GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Conectar no Vercel.com
# 3. Adicionar variáveis de ambiente
# 4. Deploy automático!
```

### Netlify
```bash
# Via CLI
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod --dir=dist
```

## 🔍 Debug Comum

### Problemas de Autenticação
```bash
# Verificar se email está autorizado
SELECT * FROM authorized_emails WHERE email = 'seu-email@teste.com';

# Verificar configuração Supabase
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

### PWA não Funciona
```bash
# 1. Verificar manifest
curl http://localhost:5173/manifest.json

# 2. Verificar service worker
# Chrome DevTools → Application → Service Workers

# 3. Clear cache
# DevTools → Application → Storage → Clear storage
```

### Build Falha
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar versões Node
node --version  # Deve ser 16+
npm --version
```

## 📋 Checklist Antes do Deploy

- [ ] ✅ `npm run build` sem erros
- [ ] ✅ `npm run preview` funcionando
- [ ] ✅ Supabase configurado
- [ ] ✅ Email autorizado adicionado
- [ ] ✅ Variáveis de ambiente definidas
- [ ] ✅ PWA instalável localmente
- [ ] ✅ Funciona offline
- [ ] ✅ Responsivo (mobile/desktop)

## 🎨 Customização Rápida

### Alterar Cores
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: {
        500: '#SUA_COR_AQUI', // Mude aqui
      }
    }
  }
}
```

### Alterar Nome do App
```json
// package.json
"name": "seu-nome-aqui"

// public/manifest.json
"name": "Seu Nome Aqui"
"short_name": "SeuApp"
```

## 🆘 Comandos de Emergência

### Reset Completo
```bash
# Limpar tudo e reinstalar
rm -rf node_modules package-lock.json .next dist
npm install
npm run dev
```

### Backup do Banco
```bash
# Exportar dados do Supabase
# Dashboard → Settings → Database → Export
```

### Rollback Git
```bash
# Voltar para commit anterior
git log --oneline
git reset --hard HASH_DO_COMMIT
```

---

## 🎯 Resumo para Produção

```bash
# Setup completo em 5 comandos:
git clone <repo-url>
cd brincafacil-app
npm install
# Configurar .env com Supabase
npm run dev
```

**✨ Pronto! Seu BrincaFácil está rodando!**















