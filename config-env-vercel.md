# 🔧 Configurar Variáveis de Ambiente na Vercel

## Via Painel Web (Recomendado)

1. Acesse: https://vercel.com
2. Faça login na sua conta
3. Vá para o projeto: **brincafacilapp1**
4. Clique em **Settings** → **Environment Variables**
5. Adicione as seguintes variáveis:

### Variáveis Necessárias:

```
VITE_SUPABASE_URL = https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY = sua-chave-anonima-aqui
```

**Importante:** 
- ✅ Marque **Production**
- ✅ Marque **Preview** 
- ✅ Marque **Development**

6. Clique em **Save**
7. Faça um novo deploy ou aguarde o próximo deploy automático

## Via CLI (Alternativa)

Se você tiver as credenciais do Supabase, pode configurar via terminal:

```bash
vercel env add VITE_SUPABASE_URL production
# Cole a URL quando solicitado: https://seu-projeto.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production
# Cole a chave anônima quando solicitado
```

## Onde encontrar as credenciais do Supabase?

1. Acesse: https://supabase.com
2. Faça login
3. Selecione seu projeto
4. Vá em **Settings** → **API**
5. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

## Após Configurar

Após adicionar as variáveis, faça um novo deploy:

```bash
vercel --prod --yes
```

Ou aguarde o próximo deploy automático quando você fizer push no git.








