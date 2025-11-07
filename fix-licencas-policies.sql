-- ============================================
-- CORRIGIR POLÍTICAS RLS DA TABELA LICENÇAS
-- ============================================
-- Remove a política conflitante que permite leitura direta
-- e mantém apenas as políticas que bloqueiam acesso do frontend

-- 1. Remover TODAS as políticas existentes
-- IMPORTANTE: A política "user_le_licenca_propria" permite acesso direto e deve ser removida
DROP POLICY IF EXISTS "user_le_licenca_propria" ON public.licencas;
DROP POLICY IF EXISTS "Leitura bloqueada no frontend" ON public.licencas;
DROP POLICY IF EXISTS "Usuários podem ver apenas sua licença" ON public.licencas;
DROP POLICY IF EXISTS "Apenas sistema pode modificar licenças" ON public.licencas;
DROP POLICY IF EXISTS "select_own_licenca" ON public.licencas;
DROP POLICY IF EXISTS "Modificação apenas via Apps Script" ON public.licencas;
DROP POLICY IF EXISTS "Modificação apenas via sistema" ON public.licencas;

-- 2. Garantir que RLS está habilitado
ALTER TABLE public.licencas ENABLE ROW LEVEL SECURITY;

-- 3. Criar política que bloqueia TODAS as leituras diretas do frontend
-- IMPORTANTE: Isso força o uso da função RPC verificar_licenca
CREATE POLICY "Leitura bloqueada no frontend" 
ON public.licencas 
FOR SELECT 
USING (false);

-- 4. Criar política que permite modificações APENAS via App Script/Backend
-- IMPORTANTE: O nome deve ser exatamente "Modificação apenas via Apps Script" 
-- para o App Script funcionar corretamente
CREATE POLICY "Modificação apenas via Apps Script" 
ON public.licencas 
FOR ALL 
USING (false) 
WITH CHECK (false);

-- 5. Verificar as políticas criadas (deve mostrar apenas 2 políticas)
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'licencas'
ORDER BY policyname;

-- Resultado esperado:
-- 1. "Leitura bloqueada no frontend" - SELECT - false
-- 2. "Modificação apenas via Apps Script" - ALL - false
-- 
-- NÃO deve aparecer "user_le_licenca_propria" ou outras políticas que permitam acesso

