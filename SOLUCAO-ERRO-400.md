# 🔧 Solução: Erro 400 (Bad Request) no Login

## ✅ Progresso

**Boa notícia:** O app agora está usando a conta **CORRETA** do Supabase!
- ✅ URL correta: `medixxzluqpbdgnjcmyz.supabase.co`
- ❌ Mas está dando erro 400 ao tentar fazer login

## 🎯 O Que Significa o Erro 400

O erro 400 (Bad Request) geralmente significa:

1. **Usuário não existe** na nova conta do Supabase
2. **Email ou senha incorretos**
3. **Formato da requisição incorreto**

## 🛠️ Soluções

### Opção 1: Cadastrar um Novo Usuário (Recomendado)

Como migramos para uma nova conta, você precisa **cadastrar novamente**:

1. Vá na aba **"Cadastrar"**
2. Digite o email (ex: `teste@gmail.com`)
3. Crie uma senha
4. Clique em "Cadastrar"

**Importante:** Antes de cadastrar, certifique-se de que o email está na tabela `licencas`:

```sql
-- Verificar se o email está na tabela licencas
SELECT * FROM public.licencas WHERE email = 'teste@gmail.com';

-- Se não estiver, inserir:
INSERT INTO public.licencas (email, status, origem, updated_at)
VALUES ('teste@gmail.com', 'pago', NULL, NOW())
ON CONFLICT (email) DO UPDATE 
SET status = 'pago', updated_at = NOW();
```

### Opção 2: Verificar se o Usuário Existe

No SQL Editor do Supabase, execute:

```sql
-- Verificar usuários no Supabase Auth
SELECT email, created_at, email_confirmed_at
FROM auth.users
ORDER BY created_at DESC;
```

Se não houver usuários, você precisa **cadastrar novamente**.

### Opção 3: Limpar e Recriar (Se Necessário)

Se quiser limpar tudo e começar do zero:

```sql
-- Limpar usuários (CUIDADO: remove TODOS)
DELETE FROM auth.users;

-- Limpar licenças (se necessário)
-- DELETE FROM public.licencas;
```

Depois, cadastre novamente.

## 📋 Passo a Passo Completo

1. **Inserir email na tabela `licencas`:**
   ```sql
   INSERT INTO public.licencas (email, status, origem, updated_at)
   VALUES ('teste@gmail.com', 'pago', NULL, NOW())
   ON CONFLICT (email) DO UPDATE 
   SET status = 'pago', updated_at = NOW();
   ```

2. **Cadastrar no app:**
   - Abra o app
   - Vá na aba "Cadastrar"
   - Email: `teste@gmail.com`
   - Senha: (qualquer senha com 6+ caracteres)
   - Clique em "Cadastrar"

3. **Verificar no console:**
   - Pressione F12
   - Vá na aba "Console"
   - Procure por: `✅ Cadastro realizado`
   - Não deve aparecer erro 400

## ✅ O Que Foi Melhorado

Atualizei o código para:
- ✅ Mostrar mensagens de erro mais claras
- ✅ Tratar especificamente o erro 400
- ✅ Distinguir entre "usuário não existe" e "senha incorreta"
- ✅ Adicionar mais logs para debug

## 🎯 Teste Agora

1. Certifique-se de que o email está na tabela `licencas` com status `pago`
2. Tente **cadastrar** (não fazer login) com um email novo
3. Se der erro, verifique o console para ver a mensagem específica

O erro 400 deve desaparecer após cadastrar um novo usuário na nova conta!


