# 🐛 Debug: Erro ao Verificar Licença

## ❌ Problema

O email `dan@gmail.com` está na tabela `licencas` com status `pago`, mas a função RPC `verificar_licenca` está retornando um erro.

## 🔍 Passos para Debug

### 1. Verificar se a função existe no Supabase

Execute no SQL Editor do Supabase:

```sql
-- Verificar se a função existe
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public' 
  AND routine_name = 'verificar_licenca';
```

**Se não existir**, execute o script `fix-verificar-licenca-function.sql`.

### 2. Testar a função diretamente

Execute no SQL Editor:

```sql
-- Testar com o email dan@gmail.com
SELECT * FROM verificar_licenca('dan@gmail.com');
```

**Resultado esperado:**
```
valido: true
nome: '' (ou origem se tiver)
data_compra: timestamp
status: 'pago'
```

### 3. Verificar permissões

Execute:

```sql
-- Verificar permissões de execução
SELECT 
  grantee,
  privilege_type
FROM information_schema.routine_privileges
WHERE routine_schema = 'public' 
  AND routine_name = 'verificar_licenca';
```

**Deve ter:**
- `grantee: authenticated` com `privilege_type: EXECUTE`
- `grantee: anon` com `privilege_type: EXECUTE`

### 4. Verificar dados na tabela

```sql
SELECT * FROM public.licencas WHERE email = 'dan@gmail.com';
```

**Deve retornar:**
- `email: dan@gmail.com`
- `status: pago`
- `origem: NULL` (ou algum valor)
- `updated_at: timestamp`

### 5. Verificar no console do navegador

Abra o console (F12) e procure por:
- `[GATE] Chamando verificar_licenca com email: dan@gmail.com`
- `[GATE] Resultado da função RPC:`
- `❌ [GATE] Erro ao verificar licença:`

## ✅ Soluções Possíveis

### Solução 1: Recriar a função RPC

Execute o script `fix-verificar-licenca-function.sql` no SQL Editor do Supabase.

### Solução 2: Verificar RLS da tabela licencas

A tabela `licencas` deve ter RLS habilitado e a política deve bloquear acesso direto (a função RPC usa `SECURITY DEFINER` para contornar isso).

Execute:

```sql
-- Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'licencas';
```

### Solução 3: Verificar se o email está em lowercase

A função usa `LOWER(user_email)`, então `dan@gmail.com` deve funcionar. Mas verifique se não há espaços ou caracteres especiais.

## 📋 Checklist

- [ ] Função `verificar_licenca` existe no Supabase
- [ ] Função retorna resultado quando testada diretamente no SQL Editor
- [ ] Permissões de execução estão corretas (authenticated e anon)
- [ ] Email `dan@gmail.com` existe na tabela `licencas` com status `pago`
- [ ] RLS está configurado corretamente na tabela `licencas`
- [ ] Console do navegador mostra o erro detalhado

