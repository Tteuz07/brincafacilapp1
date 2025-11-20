-- ============================================
-- INSERIR LICENÇA - EXEMPLO
-- ============================================
-- Use este script para inserir emails na tabela licencas
-- Execute ANTES do usuário fazer o cadastro

-- ============================================
-- INSERIR EMAIL COM STATUS PAGO
-- ============================================

-- Substitua 'teste@gmail.com' pelo email real
INSERT INTO public.licencas (email, status, origem, updated_at)
VALUES 
  ('teste@gmail.com', 'pago', NULL, NOW())
ON CONFLICT (email) DO UPDATE 
SET 
  status = 'pago',
  updated_at = NOW();

-- ============================================
-- INSERIR MÚLTIPLOS EMAILS
-- ============================================

INSERT INTO public.licencas (email, status, origem, updated_at)
VALUES 
  ('h@gmail.com', 'pago', NULL, NOW()),
  ('dan@gmail.com', 'pago', NULL, NOW()),
  ('teste@brincafacil.com', 'pago', 'eduzz', NOW())
ON CONFLICT (email) DO UPDATE 
SET 
  status = 'pago',
  updated_at = NOW();

-- ============================================
-- VERIFICAR SE FOI INSERIDO
-- ============================================

SELECT 
  email,
  status,
  origem,
  updated_at
FROM public.licencas
WHERE email = 'teste@gmail.com';

-- ============================================
-- TESTAR FUNÇÃO RPC
-- ============================================

SELECT * FROM verificar_licenca('teste@gmail.com');

-- Deve retornar:
-- valido: true
-- status: 'pago'

-- ============================================
-- LISTAR TODAS AS LICENÇAS
-- ============================================

SELECT 
  email,
  status,
  origem,
  updated_at
FROM public.licencas
ORDER BY updated_at DESC;


