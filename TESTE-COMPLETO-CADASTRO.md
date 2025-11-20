# 🧪 Teste Completo de Cadastro

## ✅ Credenciais Verificadas

As credenciais estão **100% corretas** e idênticas ao dashboard!

## 🎯 Próximo Passo: Testar Cadastro

### 1. Verificar se o Email Está na Tabela `licencas`

No SQL Editor do Supabase, execute:

```sql
-- Verificar se o email está na tabela licencas
SELECT * FROM public.licencas WHERE email = 'teste@gmail.com';
```

**Se NÃO estiver**, insira:

```sql
INSERT INTO public.licencas (email, status, origem, updated_at)
VALUES ('teste@gmail.com', 'pago', NULL, NOW())
ON CONFLICT (email) DO UPDATE 
SET status = 'pago', updated_at = NOW();
```

### 2. Verificar se o Usuário Já Existe no Auth

```sql
SELECT * FROM auth.users WHERE email = 'teste@gmail.com';
```

**Se existir**, você pode:
- **Opção A:** Usar a aba "Entrar" e digitar a senha
- **Opção B:** Deletar o usuário e cadastrar novamente:
  ```sql
  DELETE FROM auth.users WHERE email = 'teste@gmail.com';
  ```

### 3. Testar Cadastro no App

1. **Abra o app** no navegador
2. **Vá na aba "Cadastrar"** (NÃO "Entrar")
3. **Email:** `teste@gmail.com`
4. **Senha:** (qualquer senha com 6+ caracteres)
5. **Clique em "Cadastrar"**

### 4. Verificar no Console

Pressione **F12** e vá na aba **Console**. Você deve ver:

```
[LOGIN] Tentando cadastrar: teste@gmail.com
[LOGIN] Verificando se email já está cadastrado...
[LOGIN] Email não encontrado, tentando cadastrar...
✅ Cadastro realizado: ...
✅ Usuário criado no Supabase Auth: ...
```

**Se aparecer erro 400**, é porque o usuário já existe. Nesse caso:
- Use a aba "Entrar" e digite a senha
- Ou delete o usuário e tente cadastrar novamente

## 🔍 Debug Completo

Se ainda não funcionar, execute no SQL Editor:

```sql
-- 1. Verificar usuários
SELECT email, created_at FROM auth.users ORDER BY created_at DESC;

-- 2. Verificar licenças
SELECT email, status FROM public.licencas ORDER BY updated_at DESC;

-- 3. Testar função RPC
SELECT * FROM verificar_licenca('teste@gmail.com');
```

## ✅ Resultado Esperado

Após cadastrar:
- ✅ Não deve aparecer erro 400
- ✅ Deve redirecionar para `/gate`
- ✅ Deve verificar a licença
- ✅ Deve redirecionar para o quiz (`/child-setup`)

## 🚨 Se Ainda Der Erro

1. **Limpe o cache do navegador** (Ctrl+Shift+Delete)
2. **Use modo anônimo** (Ctrl+Shift+N)
3. **Reinicie o servidor:**
   ```bash
   # Pare (Ctrl+C)
   # Inicie novamente
   npm run dev
   ```
4. **Verifique o console** para ver a mensagem de erro exata
5. **Me envie** o que aparece no console


