-- ============================================
-- LIMPAR TODOS OS USUÁRIOS DO SUPABASE AUTH
-- ============================================
-- ⚠️ ATENÇÃO: Este script remove TODOS os usuários da tabela auth.users
-- Use apenas se realmente quiser limpar tudo e começar do zero

-- IMPORTANTE: Você precisa ter permissões de administrador no Supabase
-- Este script deve ser executado no SQL Editor do Supabase

-- ============================================
-- MÉTODO 1: Via SQL (se tiver permissão)
-- ============================================

-- Verificar usuários existentes
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  deleted_at
FROM auth.users
ORDER BY created_at DESC;

-- ⚠️ CUIDADO: Descomente apenas se quiser DELETAR TODOS os usuários
-- DELETE FROM auth.users;

-- ============================================
-- MÉTODO 2: Via Dashboard (RECOMENDADO)
-- ============================================

-- 1. Acesse: https://supabase.com
-- 2. Vá no seu projeto
-- 3. Vá em "Authentication" → "Users"
-- 4. Para cada usuário:
--    - Clique nos três pontinhos (⋯)
--    - Clique em "Delete user"
--    - Confirme a exclusão

-- ============================================
-- MÉTODO 3: Deletar Usuário Específico
-- ============================================

-- Deletar usuário específico por email
-- Substitua 'teste@gmail.com' pelo email que quer deletar

/*
DO $$
DECLARE
  user_id UUID;
BEGIN
  -- Buscar ID do usuário
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = 'teste@gmail.com';
  
  -- Se encontrou, deletar
  IF user_id IS NOT NULL THEN
    DELETE FROM auth.users WHERE id = user_id;
    RAISE NOTICE 'Usuário % deletado', 'teste@gmail.com';
  ELSE
    RAISE NOTICE 'Usuário não encontrado';
  END IF;
END $$;
*/

-- ============================================
-- VERIFICAÇÃO
-- ============================================

-- Verificar se não há mais usuários
SELECT COUNT(*) as total_usuarios FROM auth.users;

-- Se retornar 0, todos os usuários foram deletados

