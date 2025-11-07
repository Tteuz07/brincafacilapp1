# 🔧 Verificar Configuração do Supabase

## ⚠️ Erro: "Email address is invalid"

Se você está vendo o erro "Email address 'teste@gmail.com' is invalid", pode ser:

1. **Configuração do Supabase bloqueando emails de teste**
2. **Email com espaços ou caracteres invisíveis**
3. **Configuração de confirmação de email muito restritiva**

## ✅ Como Verificar e Corrigir

### 1. Verificar Configuração de Email no Supabase

1. Acesse o **Supabase Dashboard**
2. Vá em **Authentication** → **Settings**
3. Procure por **"Email Auth"** ou **"Email Templates"**
4. Verifique se há alguma restrição de domínio

### 2. Desabilitar Confirmação de Email (Para Testes)

1. Vá em **Authentication** → **Settings**
2. Procure por **"Enable email confirmations"**
3. **Desabilite** temporariamente para testes
4. Salve as alterações

### 3. Verificar Se Email Está na Tabela `licencas`

```sql
-- Verificar se o email está na tabela (com espaços?)
SELECT 
  email,
  LENGTH(email) as tamanho,
  status,
  LOWER(TRIM(email)) as email_limpo
FROM public.licencas 
WHERE LOWER(TRIM(email)) = LOWER(TRIM('teste@gmail.com'));
```

### 4. Testar Função RPC

```sql
-- Testar com email limpo
SELECT * FROM verificar_licenca(LOWER(TRIM('teste@gmail.com')));
```

### 5. Limpar e Reinserir Email na Tabela

```sql
-- Deletar email antigo (se houver espaços)
DELETE FROM public.licencas WHERE email LIKE '%teste@gmail.com%';

-- Inserir email limpo
INSERT INTO public.licencas (email, status, origem, updated_at)
VALUES (LOWER(TRIM('teste@gmail.com')), 'pago', NULL, NOW())
ON CONFLICT (email) DO UPDATE 
SET status = 'pago', updated_at = NOW();
```

## 🧪 Teste com Email Real

Se `teste@gmail.com` não funcionar, tente com um email real:

```sql
-- Inserir email real
INSERT INTO public.licencas (email, status, origem, updated_at)
VALUES ('seu-email-real@gmail.com', 'pago', NULL, NOW())
ON CONFLICT (email) DO UPDATE 
SET status = 'pago', updated_at = NOW();
```

Depois, tente cadastrar com esse email real.

## 🔍 Debug no Console

No console do navegador (F12), você deve ver:

```
[LOGIN] Tentando cadastrar: {
  emailOriginal: "teste@gmail.com",
  emailLimpo: "teste@gmail.com",
  emailLength: 16
}
```

Se o `emailLength` estiver diferente de 16, pode haver espaços ou caracteres invisíveis.

## ✅ Solução Rápida

1. **Desabilite confirmação de email** no Supabase (temporariamente)
2. **Limpe o email na tabela** e reinsira sem espaços
3. **Use um email real** em vez de `teste@gmail.com`
4. **Teste novamente**

