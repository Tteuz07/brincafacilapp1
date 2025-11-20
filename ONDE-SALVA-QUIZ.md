# 📍 Onde os Dados do Quiz São Salvos

## ✅ Resposta: **SUPABASE** (Principal) + **localStorage** (Flag)

### 1. **Dados do Perfil → Supabase** ✅

Os dados do quiz (nome, idade, avatar, interesses, etc.) são salvos no **Supabase**, na tabela `perfis_criancas`.

**Código:**
- `ChildSetupPage.jsx` → chama `updateChild(childData)`
- `useAppStore.js` → função `updateChild` → chama `salvarPerfil` do `storageService`
- `storageService.js` → função `salvarPerfil` → salva na tabela `perfis_criancas` do Supabase

**Tabela no Supabase:**
```sql
perfis_criancas (
  email_usuario TEXT PRIMARY KEY,
  nome_crianca TEXT,
  idade INTEGER,
  avatar TEXT,
  interesses TEXT[],
  espaco_disponivel TEXT[],
  companhia TEXT[],
  pontos_cognitivo INTEGER,
  pontos_motor INTEGER,
  pontos_social INTEGER,
  pontos_emocional INTEGER,
  nivel INTEGER,
  meta_semanal INTEGER,
  dias_consecutivos INTEGER,
  ultima_atividade_data TIMESTAMP,
  updated_at TIMESTAMP
)
```

### 2. **Flag de Onboarding → localStorage** ⚠️

Uma flag simples é salva no `localStorage` para indicar que o quiz foi feito:

```javascript
localStorage.setItem('bf_onboarding_done', '1')
```

**Por quê?**
- Verificação rápida se o quiz já foi feito
- Não precisa fazer requisição ao Supabase toda vez
- Usado para redirecionamento

## 📋 Fluxo Completo

1. **Usuário preenche o quiz** (`ChildSetupPage.jsx`)
2. **Clica em "Começar agora"**
3. **Dados são salvos:**
   - ✅ **Supabase** → Tabela `perfis_criancas` (dados completos)
   - ⚠️ **localStorage** → Flag `bf_onboarding_done = '1'` (apenas flag)
4. **Redireciona para home (`/`)**

## 🔍 Como Verificar

### Verificar no Supabase:

```sql
-- Ver todos os perfis salvos
SELECT 
  email_usuario,
  nome_crianca,
  idade,
  avatar,
  interesses,
  updated_at
FROM public.perfis_criancas
ORDER BY updated_at DESC;
```

### Verificar no localStorage:

No console do navegador (F12):
```javascript
localStorage.getItem('bf_onboarding_done')
// Deve retornar: "1" se o quiz foi feito
```

## ⚠️ Importante

- **Dados principais** (nome, idade, avatar, etc.) → **Supabase** ✅
- **Flag de onboarding** → **localStorage** ⚠️ (apenas para verificação rápida)
- Se limpar o `localStorage`, a flag some, mas os dados continuam no Supabase
- O app verifica o Supabase para carregar o perfil completo

## 🎯 Resumo

**Onde fica salvo:**
- ✅ **Supabase** → Dados completos do perfil (principal)
- ⚠️ **localStorage** → Apenas flag `bf_onboarding_done` (verificação rápida)

**Tabela no Supabase:** `perfis_criancas`


