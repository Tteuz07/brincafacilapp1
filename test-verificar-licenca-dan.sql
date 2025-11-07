-- ============================================
-- TESTAR FUNÇÃO verificar_licenca PARA dan@gmail.com
-- ============================================

-- 1. Verificar se a função existe
SELECT 
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public' 
  AND routine_name = 'verificar_licenca';

-- 2. Verificar se o email existe na tabela licencas
SELECT 
  email,
  status,
  origem,
  updated_at
FROM public.licencas
WHERE email = 'dan@gmail.com';

-- 3. Testar a função RPC diretamente
SELECT * FROM verificar_licenca('dan@gmail.com');

-- 4. Verificar permissões da função
SELECT 
  p.proname AS function_name,
  pg_get_function_identity_arguments(p.oid) AS arguments,
  CASE 
    WHEN p.prosecdef THEN 'SECURITY DEFINER'
    ELSE 'SECURITY INVOKER'
  END AS security_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
  AND p.proname = 'verificar_licenca';

-- 5. Verificar permissões de execução
SELECT 
  grantee,
  privilege_type
FROM information_schema.routine_privileges
WHERE routine_schema = 'public' 
  AND routine_name = 'verificar_licenca';

