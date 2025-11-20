-- ============================================
-- LIMPAR USUÁRIOS DO SUPABASE AUTH
-- ============================================
-- ⚠️ ATENÇÃO: Este script remove TODOS os usuários do Supabase Auth
-- Use apenas se precisar limpar completamente a autenticação
-- Execute no SQL Editor do Supabase

-- ============================================
-- VERIFICAR USUÁRIOS EXISTENTES
-- ============================================

SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;

-- ============================================
-- REMOVER USUÁRIO ESPECÍFICO POR EMAIL
-- ============================================

-- Substitua 'teste@gmail.com' pelo email que deseja remover
DELETE FROM auth.users
WHERE email = 'teste@gmail.com';

-- ============================================
-- REMOVER TODOS OS USUÁRIOS (CUIDADO!)
-- ============================================

-- ⚠️ DESCOMENTE APENAS SE REALMENTE QUISER REMOVER TUDO
-- DELETE FROM auth.users;

-- ============================================
-- VERIFICAR SE FOI REMOVIDO
-- ============================================

SELECT COUNT(*) as total_usuarios FROM auth.users;


