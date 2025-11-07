# 🚨 Solução: "Email address is invalid"

## ⚠️ Problema

O Supabase está rejeitando o email `teste@gmail.com` como inválido, mesmo sendo um email válido.

## ✅ Soluções (Tente na Ordem)

### Solução 1: Desabilitar Confirmação de Email (Mais Rápido)

1. Acesse o **Supabase Dashboard**
2. Vá em **Authentication** → **Settings**
3. Procure por **"Enable email confirmations"**
4. **DESABILITE** (toggle OFF)
5. Clique em **Save**
6. Tente cadastrar novamente

### Solução 2: Usar Email Real

O Supabase pode estar bloqueando emails de teste. Tente com um email real:

1. No SQL Editor, insira um email real:
   ```sql
   INSERT INTO public.licencas (email, status, origem, updated_at)
   VALUES ('seu-email-real@gmail.com', 'pago', NULL, NOW())
   ON CONFLICT (email) DO UPDATE 
   SET status = 'pago', updated_at = NOW();
   ```

2. Tente cadastrar com esse email real

### Solução 3: Verificar Configuração de Domínios Permitidos

1. Vá em **Authentication** → **Settings**
2. Procure por **"Allowed email domains"** ou **"Email restrictions"**
3. Se houver alguma restrição, **remova** ou adicione `gmail.com`
4. Salve

### Solução 4: Limpar Email na Tabela

```sql
-- Deletar email antigo
DELETE FROM public.licencas WHERE email LIKE '%teste@gmail.com%';

-- Inserir email limpo (sem espaços)
INSERT INTO public.licencas (email, status, origem, updated_at)
VALUES ('teste@gmail.com', 'pago', NULL, NOW())
ON CONFLICT (email) DO UPDATE 
SET status = 'pago', updated_at = NOW();

-- Verificar
SELECT email, LENGTH(email) as tamanho FROM public.licencas WHERE email = 'teste@gmail.com';
-- O tamanho deve ser 16 (sem espaços)
```

## 🧪 Teste Rápido

1. **Desabilite confirmação de email** (Solução 1)
2. **Limpe o cache do navegador** (Ctrl+Shift+Delete)
3. **Tente cadastrar novamente**

## 📋 Checklist

- [ ] Confirmação de email está **DESABILITADA** no Supabase
- [ ] Email está na tabela `licencas` com status `'pago'`
- [ ] Email não tem espaços (verificar com `LENGTH(email)`)
- [ ] Testou com email real (não `teste@gmail.com`)
- [ ] Limpou cache do navegador

## 💡 Dica

Se ainda não funcionar, o problema pode ser:
- **Configuração do Supabase muito restritiva**
- **Email já existe no Supabase Auth** (mesmo que não apareça no dashboard)

Nesse caso, tente:
1. Deletar o usuário do `auth.users`:
   ```sql
   DELETE FROM auth.users WHERE email = 'teste@gmail.com';
   ```
2. Tentar cadastrar novamente

