# 🔧 Atualizar Credenciais Exatas

## 📋 Instruções

1. **Pegue as credenciais EXATAS do dashboard do Supabase:**
   - Settings → API
   - Project URL
   - anon public key

2. **Me envie aqui:**
   - Project URL: `https://?????.supabase.co`
   - anon public key: `eyJ...`

3. **Eu atualizo tudo para você!**

## 🔍 Ou Atualize Manualmente

### 1. Atualizar `.env`

Substitua no arquivo `.env`:
```env
VITE_SUPABASE_URL=https://SEU_PROJECT_URL_AQUI.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_EXATA_AQUI
```

### 2. Atualizar `supabaseClient.ts`

Abra `src/lib/supabaseClient.ts` e atualize:
```typescript
const SUPABASE_URL_NOVA = 'https://SEU_PROJECT_URL_AQUI.supabase.co';
const SUPABASE_KEY_NOVA = 'SUA_CHAVE_EXATA_AQUI';
```

### 3. Atualizar na Vercel

1. Vá em Settings → Environment Variables
2. Atualize `VITE_SUPABASE_URL`
3. Atualize `VITE_SUPABASE_ANON_KEY`
4. Salve e aguarde alguns minutos

### 4. Reiniciar

```bash
# Pare o servidor (Ctrl+C)
# Limpe cache
Remove-Item -Recurse -Force node_modules/.vite
# Reinicie
npm run dev
```

## ⚠️ Importante

- **Copie EXATAMENTE** - sem espaços, sem quebras de linha
- **Compare CARACTERE POR CARACTERE**
- **Atualize em TODOS os lugares** (.env, código, Vercel)

