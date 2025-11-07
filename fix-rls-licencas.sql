-- ============================================
-- CORREÇÃO: RLS para tabela licencas
-- ============================================
-- Este script remove todas as políticas existentes e cria novas
-- Execute este script se você receber erro de "policy already exists"

-- 1. Remover TODAS as políticas existentes (se houver)
DROP POLICY IF EXISTS "Leitura bloqueada no frontend" ON public.licencas;
DROP POLICY IF EXISTS "Usuários podem ver apenas sua licença" ON public.licencas;
DROP POLICY IF EXISTS "Apenas sistema pode modificar licenças" ON public.licencas;
DROP POLICY IF EXISTS "select_own_licenca" ON public.licencas;
DROP POLICY IF EXISTS "Modificação apenas via Apps Script" ON public.licencas;

-- 2. Garantir que RLS está habilitado
ALTER TABLE public.licencas ENABLE ROW LEVEL SECURITY;

-- 3. Criar política que bloqueia TODAS as leituras diretas do frontend
-- (A única forma de acessar será via função RPC verificar_licenca)
CREATE POLICY "Leitura bloqueada no frontend" 
ON public.licencas 
FOR SELECT 
USING (false);

-- 4. Criar política que bloqueia TODAS as modificações do frontend
-- (Modificações só podem ser feitas via webhook/backend)
CREATE POLICY "Modificação apenas via sistema" 
ON public.licencas 
FOR ALL 
USING (false) 
WITH CHECK (false);

-- Verificar se as políticas foram criadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'licencas';

