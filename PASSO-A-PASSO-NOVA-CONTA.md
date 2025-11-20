# 🚀 Passo a Passo - Nova Conta Supabase

## ✅ Credenciais Recebidas

```
URL: https://medixxzluqpbdgnjcmyz.supabase.co
KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZGl4eHpsdXFwYmRnbmpjbXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0ODIyNDIsImV4cCI6MjA3ODA1ODI0Mn0.46493DxiLSr2wN9CcwWPJw7m8ZF3E9_8KI-q0RHDB3I
```

## 📋 Checklist Completo

### ✅ Passo 1: Executar Script SQL no Supabase

1. Acesse: https://supabase.com
2. Faça login na nova conta
3. Vá no projeto
4. Clique em **SQL Editor** (menu lateral)
5. Clique em **New query**
6. Abra o arquivo `SETUP-COMPLETO-NOVA-CONTA.sql`
7. Copie TODO o conteúdo
8. Cole no SQL Editor
9. Clique em **Run** (ou `Ctrl+Enter`)
10. Aguarde a execução (pode levar alguns segundos)
11. Verifique se apareceu "Success" ou "Query executed successfully"

### ✅ Passo 2: Inserir Licenças

No SQL Editor, execute:

```sql
INSERT INTO public.licencas (email, status, origem, updated_at)
VALUES 
  ('h@gmail.com', 'pago', NULL, NOW()),
  ('dan@gmail.com', 'pago', NULL, NOW()),
  ('teste@brincafacil.com', 'pago', 'eduzz', NOW())
ON CONFLICT (email) DO NOTHING;
```

### ✅ Passo 3: Testar Função RPC

Execute no SQL Editor:

```sql
SELECT * FROM verificar_licenca('h@gmail.com');
```

**Resultado esperado:**
```
valido: true
nome: '' (ou origem se tiver)
data_compra: timestamp
status: 'pago'
```

### ✅ Passo 4: Atualizar Variáveis na Vercel

1. Acesse: https://vercel.com
2. Vá no seu projeto
3. **Settings** → **Environment Variables**
4. Atualize:
   - `VITE_SUPABASE_URL` → `https://medixxzluqpbdgnjcmyz.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` → `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZGl4eHpsdXFwYmRnbmpjbXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0ODIyNDIsImV4cCI6MjA3ODA1ODI0Mn0.46493DxiLSr2wN9CcwWPJw7m8ZF3E9_8KI-q0RHDB3I`
5. Marque: ✅ Production, ✅ Preview, ✅ Development
6. Clique em **Save**

### ✅ Passo 5: Fazer Novo Deploy

1. Na Vercel, vá em **Deployments**
2. Clique nos **três pontinhos** (⋯) do último deploy
3. Clique em **Redeploy**
4. Aguarde o deploy terminar

### ✅ Passo 6: Testar no Site

1. Acesse o site em produção
2. Abra o console (F12)
3. Verifique se aparece:
   - `🔍 DEBUG Supabase Env:` com `hasUrl: true` e `hasKey: true`
4. Tente fazer login
5. Verifique se a verificação de licença funciona

## 🎯 Ordem de Execução

1. ✅ Executar `SETUP-COMPLETO-NOVA-CONTA.sql` no Supabase
2. ✅ Inserir licenças manualmente
3. ✅ Testar função RPC no SQL Editor
4. ✅ Atualizar variáveis na Vercel
5. ✅ Fazer novo deploy
6. ✅ Testar no site

## 🆘 Se Algo Der Errado

### Erro no SQL Editor:
- Verifique se copiou o script completo
- Verifique se não há erros de sintaxe
- Execute parte por parte se necessário

### Variáveis não funcionam:
- Aguarde alguns minutos após atualizar
- Limpe o cache do navegador
- Verifique se marcou Production na Vercel

### Função RPC não funciona:
- Execute novamente o script `SETUP-COMPLETO-NOVA-CONTA.sql`
- Verifique se a função foi criada: `SELECT * FROM verificar_licenca('h@gmail.com');`


