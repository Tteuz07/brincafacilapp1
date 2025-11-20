-- ============================================
-- TESTAR FUNÇÃO verificar_licenca PARA h@gmail.com
-- ============================================

-- 1. Verificar se o email existe na tabela
SELECT 
  email,
  status,
  origem,
  updated_at
FROM public.licencas
WHERE email = 'h@gmail.com';

-- 2. Verificar se o email existe com LOWER
SELECT 
  email,
  status,
  origem,
  updated_at
FROM public.licencas
WHERE LOWER(email) = LOWER('h@gmail.com');

-- 3. Testar a função RPC diretamente
SELECT * FROM verificar_licenca('h@gmail.com');

-- 4. Testar com email em maiúsculas
SELECT * FROM verificar_licenca('H@GMAIL.COM');

-- 5. Verificar se há espaços ou caracteres especiais
SELECT 
  email,
  LENGTH(email) as email_length,
  status
FROM public.licencas
WHERE email LIKE '%h@gmail.com%';


