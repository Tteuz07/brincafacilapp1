# ✅ Fluxo Correto de Cadastro e Acesso

## 🎯 Como Funciona

### Passo 1: Inserir Email na Tabela `licencas` (ANTES do cadastro)

O email precisa estar na tabela `licencas` com status `pago` **ANTES** do usuário fazer o cadastro.

**No SQL Editor do Supabase, execute:**

```sql
-- Inserir email na tabela licencas
INSERT INTO public.licencas (email, status, origem, updated_at)
VALUES 
  ('teste@gmail.com', 'pago', NULL, NOW())
ON CONFLICT (email) DO UPDATE 
SET status = 'pago', updated_at = NOW();
```

### Passo 2: Usuário Faz Cadastro

1. Usuário acessa `/login`
2. Clica em "Cadastrar"
3. Digita o email (ex: `teste@gmail.com`)
4. Cria uma senha
5. Clica em "Cadastrar"

### Passo 3: Sistema Verifica Licença

1. O sistema cria o usuário no Supabase Auth
2. Redireciona para `/gate`
3. O `/gate` chama a função RPC `verificar_licenca('teste@gmail.com')`
4. A função verifica na tabela `licencas` se o email tem status `pago`
5. Se sim, libera o acesso
6. Se não, mostra "Acesso pendente"

### Passo 4: Liberação de Acesso

Se a licença estiver `pago`:
- ✅ Usuário é redirecionado para o app
- ✅ Se for novo usuário, vai para o quiz (`/child-setup`)
- ✅ Se já fez o quiz, vai para a home (`/`)

## 📋 Exemplo Completo

### 1. Inserir Licença no Supabase

```sql
-- Inserir email com status pago
INSERT INTO public.licencas (email, status, origem, updated_at)
VALUES 
  ('teste@gmail.com', 'pago', NULL, NOW())
ON CONFLICT (email) DO UPDATE 
SET status = 'pago', updated_at = NOW();

-- Verificar se foi inserido
SELECT * FROM public.licencas WHERE email = 'teste@gmail.com';
```

### 2. Testar a Função RPC

```sql
-- Testar se a função encontra a licença
SELECT * FROM verificar_licenca('teste@gmail.com');
```

**Resultado esperado:**
```
valido: true
status: 'pago'
```

### 3. Usuário Faz Cadastro

- Email: `teste@gmail.com`
- Senha: (qualquer senha com 6+ caracteres)

### 4. Sistema Verifica e Libera

- ✅ Email está na tabela `licencas` com status `pago`
- ✅ Função RPC retorna `valido: true`
- ✅ Acesso liberado!

## ⚠️ Importante

- **A ordem importa:** Email na tabela `licencas` **ANTES** do cadastro
- **Status deve ser `pago`:** Apenas emails com status `pago` têm acesso
- **Email deve ser exato:** Use o mesmo email (case-insensitive, mas melhor usar lowercase)

## 🔄 Fluxo Visual

```
1. Admin insere email na tabela licencas (status='pago')
   ↓
2. Usuário acessa /login e faz cadastro
   ↓
3. Sistema cria usuário no Supabase Auth
   ↓
4. Redireciona para /gate
   ↓
5. /gate chama verificar_licenca(email)
   ↓
6. Função verifica na tabela licencas
   ↓
7. Se status='pago' → Acesso liberado ✅
   Se status!='pago' → Acesso pendente ⏳
```

## 🎯 Resumo

**SIM, você está correto!** O fluxo é:

1. ✅ Inserir email na tabela `licencas` com status `pago`
2. ✅ Usuário faz cadastro (cria usuário no Supabase Auth)
3. ✅ Sistema verifica licença na tabela `licencas`
4. ✅ Se `pago`, libera acesso

