-- ============================================
-- RECRIAR TABELA LICENÇAS (ESTRUTURA ORIGINAL)
-- ============================================
-- Este script recria a tabela licencas exatamente como estava antes
-- Compatível com App Script e função RPC verificar_licenca

-- 1. Criar a tabela licencas com a estrutura original
CREATE TABLE IF NOT EXISTS public.licencas (
  email TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'pendente', -- 'pago' | 'pendente' | 'estornado'
  origem TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.licencas ENABLE ROW LEVEL SECURITY;

-- 3. Remover políticas antigas (se existirem)
-- IMPORTANTE: Remover TODAS as políticas, incluindo a que permite acesso direto
DROP POLICY IF EXISTS "user_le_licenca_propria" ON public.licencas;
DROP POLICY IF EXISTS "Leitura bloqueada no frontend" ON public.licencas;
DROP POLICY IF EXISTS "Usuários podem ver apenas sua licença" ON public.licencas;
DROP POLICY IF EXISTS "Apenas sistema pode modificar licenças" ON public.licencas;
DROP POLICY IF EXISTS "select_own_licenca" ON public.licencas;
DROP POLICY IF EXISTS "Modificação apenas via Apps Script" ON public.licencas;
DROP POLICY IF EXISTS "Modificação apenas via sistema" ON public.licencas;

-- 4. Criar política que bloqueia TODAS as leituras diretas do frontend
-- (A única forma de acessar será via função RPC verificar_licenca)
CREATE POLICY "Leitura bloqueada no frontend" 
ON public.licencas 
FOR SELECT 
USING (false);

-- 5. Criar política que permite modificações APENAS via App Script/Backend
-- IMPORTANTE: O nome deve ser exatamente "Modificação apenas via Apps Script" 
-- para o App Script funcionar corretamente
CREATE POLICY "Modificação apenas via Apps Script" 
ON public.licencas 
FOR ALL 
USING (false) 
WITH CHECK (false);

-- 6. Verificar se a tabela foi criada corretamente
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'licencas'
ORDER BY ordinal_position;

-- 7. Verificar as políticas criadas
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

-- 8. Teste: Verificar se a função RPC ainda funciona
-- (Execute separadamente substituindo o email)
-- SELECT * FROM verificar_licenca('seu-email@exemplo.com');

