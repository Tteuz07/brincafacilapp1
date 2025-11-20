# 🔍 Verificar Credenciais Exatas - Passo a Passo

## ⚠️ Problema Comum

O frontend pode estar usando credenciais de um projeto, mas você está olhando o dashboard de outro projeto!

## ✅ Como Verificar (Passo a Passo)

### 1. Pegar Credenciais do Dashboard do Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Vá no projeto que você está usando
3. Vá em **Settings** → **API**
4. Copie **EXATAMENTE** (sem espaços, sem quebras de linha):
   - **Project URL** (exemplo: `https://xxxxx.supabase.co`)
   - **anon public** key (a chave longa que começa com `eyJ...`)

### 2. Verificar no Código

Abra o arquivo: `src/lib/supabaseClient.ts`

Procure por:
- `SUPABASE_URL_NOVA = '...'`
- `SUPABASE_KEY_NOVA = '...'`

**Compare CARACTERE POR CARACTERE** com o que você copiou do dashboard!

### 3. Verificar no Arquivo `.env`

No terminal, execute:
```powershell
Get-Content .env | Select-String "VITE_SUPABASE"
```

Ou abra o arquivo `.env` na raiz do projeto e verifique:
- `VITE_SUPABASE_URL=...`
- `VITE_SUPABASE_ANON_KEY=...`

### 4. Comparar Tudo

| Local | URL | Key |
|-------|-----|-----|
| **Dashboard Supabase** | `https://?????.supabase.co` | `eyJ...` |
| **supabaseClient.ts** | `https://?????.supabase.co` | `eyJ...` |
| **.env** | `https://?????.supabase.co` | `eyJ...` |

**TODOS devem ser IDÊNTICOS!**

## 🚨 Se Houver Diferença

### Se a URL for diferente:
- Atualize o `.env`
- Atualize o `supabaseClient.ts`
- Atualize na Vercel

### Se a Key for diferente:
- Atualize o `.env`
- Atualize o `supabaseClient.ts`
- Atualize na Vercel

## 📋 Checklist

- [ ] Copiei o **Project URL** do dashboard
- [ ] Copiei o **anon public** key do dashboard
- [ ] Comparei com `supabaseClient.ts` - **100% igual?**
- [ ] Comparei com `.env` - **100% igual?**
- [ ] Verifiquei na Vercel - **100% igual?**
- [ ] Fiz build e testei novamente

## 🎯 Depois de Corrigir

1. **Pare o servidor** (Ctrl+C)
2. **Limpe o cache:**
   ```bash
   # Windows PowerShell
   Remove-Item -Recurse -Force node_modules/.vite
   ```
3. **Reinicie o servidor:**
   ```bash
   npm run dev
   ```
4. **Limpe o cache do navegador** (Ctrl+Shift+Delete)
5. **Teste novamente**

## 💡 Dica

Se ainda não funcionar, abra o console do navegador (F12) e procure por:
```
🔍 DEBUG Supabase Env:
```

Verifique se `urlCompleto` está **EXATAMENTE** igual ao Project URL do dashboard!


