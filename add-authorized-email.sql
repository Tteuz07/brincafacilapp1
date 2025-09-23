-- ============================================
-- ADICIONAR EMAIL AUTORIZADO - BRINCAFÁCIL
-- ============================================
-- Script para adicionar o email mateus@kirvano.com à tabela de emails autorizados

-- Adicionar o email mateus@kirvano.com à tabela authorized_emails
INSERT INTO authorized_emails (email) VALUES 
('mateus@kirvano.com')
ON CONFLICT (email) DO UPDATE SET 
  active = TRUE,
  created_at = CASE 
    WHEN authorized_emails.created_at IS NULL THEN NOW()
    ELSE authorized_emails.created_at 
  END;

-- Verificar se o email foi adicionado corretamente
SELECT 
  'Email adicionado com sucesso!' as status,
  email,
  active,
  created_at
FROM authorized_emails 
WHERE email = 'mateus@kirvano.com';

-- Listar todos os emails autorizados para verificação
SELECT 
  'Lista de emails autorizados:' as info,
  COUNT(*) as total_emails
FROM authorized_emails 
WHERE active = TRUE;

SELECT 
  email,
  active,
  created_at
FROM authorized_emails 
WHERE active = TRUE
ORDER BY created_at DESC;






