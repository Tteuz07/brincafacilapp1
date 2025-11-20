-- ============================================
-- VERIFICAR USUÁRIOS NO SUPABASE AUTH
-- ============================================
-- Execute no SQL Editor do Supabase para verificar se há usuários

-- Ver todos os usuários
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;

-- Contar total de usuários
SELECT COUNT(*) as total_usuarios FROM auth.users;

-- Verificar usuário específico
-- Substitua 'teste@gmail.com' pelo email que você está tentando usar
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at
FROM auth.users
WHERE email = 'teste@gmail.com';

-- ============================================
-- VERIFICAR LICENÇAS
-- ============================================

-- Ver todas as licenças
SELECT 
  email,
  status,
  origem,
  updated_at
FROM public.licencas
ORDER BY updated_at DESC;

-- Verificar licença específica
-- Substitua 'teste@gmail.com' pelo email
SELECT 
  email,
  status,
  origem,
  updated_at
FROM public.licencas
WHERE email = 'teste@gmail.com';


