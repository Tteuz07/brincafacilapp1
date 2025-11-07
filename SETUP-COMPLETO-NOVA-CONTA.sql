-- ============================================
-- SETUP COMPLETO - NOVA CONTA SUPABASE
-- ============================================
-- Execute este script COMPLETO no SQL Editor do Supabase
-- Ele cria TODAS as tabelas, funções e políticas necessárias
-- ============================================

-- ============================================
-- PARTE 1: TABELA DE LICENÇAS
-- ============================================

-- 1. Criar a tabela licencas
CREATE TABLE IF NOT EXISTS public.licencas (
  email TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'pendente', -- 'pago' | 'pendente' | 'estornado'
  origem TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.licencas ENABLE ROW LEVEL SECURITY;

-- 3. Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "user_le_licenca_propria" ON public.licencas;
DROP POLICY IF EXISTS "Leitura bloqueada no frontend" ON public.licencas;
DROP POLICY IF EXISTS "Usuários podem ver apenas sua licença" ON public.licencas;
DROP POLICY IF EXISTS "Apenas sistema pode modificar licenças" ON public.licencas;
DROP POLICY IF EXISTS "select_own_licenca" ON public.licencas;
DROP POLICY IF EXISTS "Modificação apenas via Apps Script" ON public.licencas;
DROP POLICY IF EXISTS "Modificação apenas via sistema" ON public.licencas;

-- 4. Criar política que bloqueia TODAS as leituras diretas do frontend
CREATE POLICY "Leitura bloqueada no frontend" 
ON public.licencas 
FOR SELECT 
USING (false);

-- 5. Criar política que permite modificações APENAS via App Script/Backend
CREATE POLICY "Modificação apenas via Apps Script" 
ON public.licencas 
FOR ALL 
USING (false) 
WITH CHECK (false);

-- ============================================
-- PARTE 2: FUNÇÃO RPC VERIFICAR LICENÇA
-- ============================================

-- Remover função antiga (se existir)
DROP FUNCTION IF EXISTS verificar_licenca(TEXT);

-- Criar função que SEMPRE retorna pelo menos 1 linha
CREATE OR REPLACE FUNCTION verificar_licenca(user_email TEXT)
RETURNS TABLE (
  valido BOOLEAN,
  nome TEXT,
  data_compra TIMESTAMP WITH TIME ZONE,
  status TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  licenca_record RECORD;
  email_lower TEXT;
BEGIN
  -- Normalizar email para lowercase
  email_lower := LOWER(TRIM(user_email));
  
  -- Buscar a licença do usuário
  SELECT 
    l.email,
    l.status as licenca_status,
    l.updated_at,
    COALESCE(l.origem, '') as origem
  INTO licenca_record
  FROM public.licencas l
  WHERE LOWER(TRIM(l.email)) = email_lower
  LIMIT 1;

  -- Se não encontrou a licença, retorna inválido (SEMPRE retorna 1 linha)
  IF NOT FOUND OR licenca_record.email IS NULL THEN
    RETURN QUERY SELECT 
      false::BOOLEAN as valido,
      NULL::TEXT as nome,
      NULL::TIMESTAMP WITH TIME ZONE as data_compra,
      'nao_encontrado'::TEXT as status;
    RETURN;
  END IF;

  -- Se encontrou, verifica se está pago
  IF licenca_record.licenca_status = 'pago' THEN
    RETURN QUERY SELECT 
      true::BOOLEAN as valido,
      COALESCE(licenca_record.origem, '')::TEXT as nome,
      licenca_record.updated_at::TIMESTAMP WITH TIME ZONE as data_compra,
      licenca_record.licenca_status::TEXT as status;
  ELSE
    RETURN QUERY SELECT 
      false::BOOLEAN as valido,
      NULL::TEXT as nome,
      licenca_record.updated_at::TIMESTAMP WITH TIME ZONE as data_compra,
      licenca_record.licenca_status::TEXT as status;
  END IF;
END;
$$;

-- Garantir permissões
GRANT EXECUTE ON FUNCTION verificar_licenca(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION verificar_licenca(TEXT) TO anon;

-- ============================================
-- PARTE 3: TABELAS DE STORAGE
-- ============================================

-- 1. TABELA: Histórico de Atividades
CREATE TABLE IF NOT EXISTS public.atividades_historico (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email_usuario TEXT NOT NULL,
  atividade_id TEXT NOT NULL,
  atividade_nome TEXT NOT NULL,
  avaliacao INTEGER CHECK (avaliacao BETWEEN 1 AND 5),
  comentario TEXT,
  foto_base64 TEXT,
  duracao_minutos INTEGER,
  dificuldade_sentida TEXT CHECK (dificuldade_sentida IN ('easy', 'medium', 'hard')),
  nivel_diversao TEXT CHECK (nivel_diversao IN ('boring', 'ok', 'fun')),
  data_realizacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para atividades_historico
CREATE INDEX IF NOT EXISTS idx_atividades_historico_email 
ON public.atividades_historico(email_usuario);

CREATE INDEX IF NOT EXISTS idx_atividades_historico_data 
ON public.atividades_historico(data_realizacao DESC);

-- 2. TABELA: Perfis das Crianças
CREATE TABLE IF NOT EXISTS public.perfis_criancas (
  email_usuario TEXT PRIMARY KEY,
  nome_crianca TEXT NOT NULL,
  idade INTEGER NOT NULL CHECK (idade BETWEEN 2 AND 12),
  avatar TEXT DEFAULT '👶',
  interesses TEXT[] DEFAULT '{}',
  espaco_disponivel TEXT[] DEFAULT '{}',
  companhia TEXT[] DEFAULT '{}',
  pontos_cognitivo INTEGER DEFAULT 0,
  pontos_motor INTEGER DEFAULT 0,
  pontos_social INTEGER DEFAULT 0,
  pontos_emocional INTEGER DEFAULT 0,
  nivel INTEGER DEFAULT 1,
  meta_semanal INTEGER DEFAULT 5,
  dias_consecutivos INTEGER DEFAULT 0,
  ultima_atividade_data TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABELA: Favoritos
CREATE TABLE IF NOT EXISTS public.favoritos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email_usuario TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('brincadeira', 'desenho')),
  item_id TEXT NOT NULL,
  item_nome TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(email_usuario, tipo, item_id)
);

-- Índice para favoritos
CREATE INDEX IF NOT EXISTS idx_favoritos_email_tipo 
ON public.favoritos(email_usuario, tipo);

-- ============================================
-- PARTE 4: ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS nas tabelas de storage
ALTER TABLE public.atividades_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfis_criancas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favoritos ENABLE ROW LEVEL SECURITY;

-- Políticas para atividades_historico
DROP POLICY IF EXISTS "Usuários veem apenas seu histórico" ON public.atividades_historico;
CREATE POLICY "Usuários veem apenas seu histórico" 
ON public.atividades_historico
FOR SELECT
USING (auth.email() = email_usuario);

DROP POLICY IF EXISTS "Usuários criam apenas seu histórico" ON public.atividades_historico;
CREATE POLICY "Usuários criam apenas seu histórico" 
ON public.atividades_historico
FOR INSERT
WITH CHECK (auth.email() = email_usuario);

-- Políticas para perfis_criancas
DROP POLICY IF EXISTS "Usuários veem apenas seu perfil" ON public.perfis_criancas;
CREATE POLICY "Usuários veem apenas seu perfil" 
ON public.perfis_criancas
FOR SELECT
USING (auth.email() = email_usuario);

DROP POLICY IF EXISTS "Usuários criam apenas seu perfil" ON public.perfis_criancas;
CREATE POLICY "Usuários criam apenas seu perfil" 
ON public.perfis_criancas
FOR INSERT
WITH CHECK (auth.email() = email_usuario);

DROP POLICY IF EXISTS "Usuários atualizam apenas seu perfil" ON public.perfis_criancas;
CREATE POLICY "Usuários atualizam apenas seu perfil" 
ON public.perfis_criancas
FOR UPDATE
USING (auth.email() = email_usuario);

-- Políticas para favoritos
DROP POLICY IF EXISTS "Usuários veem apenas seus favoritos" ON public.favoritos;
CREATE POLICY "Usuários veem apenas seus favoritos" 
ON public.favoritos
FOR SELECT
USING (auth.email() = email_usuario);

DROP POLICY IF EXISTS "Usuários criam apenas seus favoritos" ON public.favoritos;
CREATE POLICY "Usuários criam apenas seus favoritos" 
ON public.favoritos
FOR INSERT
WITH CHECK (auth.email() = email_usuario);

DROP POLICY IF EXISTS "Usuários removem apenas seus favoritos" ON public.favoritos;
CREATE POLICY "Usuários removem apenas seus favoritos" 
ON public.favoritos
FOR DELETE
USING (auth.email() = email_usuario);

-- ============================================
-- PARTE 5: FUNÇÕES RPC DE STORAGE
-- ============================================

-- 1. FUNÇÃO: Buscar Histórico de Atividades
CREATE OR REPLACE FUNCTION buscar_historico(
  user_email TEXT,
  limite INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  email_usuario TEXT,
  atividade_id TEXT,
  atividade_nome TEXT,
  avaliacao INTEGER,
  comentario TEXT,
  foto_base64 TEXT,
  duracao_minutos INTEGER,
  dificuldade_sentida TEXT,
  nivel_diversao TEXT,
  data_realizacao TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    h.id,
    h.email_usuario,
    h.atividade_id,
    h.atividade_nome,
    h.avaliacao,
    h.comentario,
    h.foto_base64,
    h.duracao_minutos,
    h.dificuldade_sentida,
    h.nivel_diversao,
    h.data_realizacao,
    h.created_at
  FROM public.atividades_historico h
  WHERE h.email_usuario = LOWER(user_email)
  ORDER BY h.data_realizacao DESC
  LIMIT limite;
END;
$$;

-- 2. FUNÇÃO: Buscar Perfil da Criança
CREATE OR REPLACE FUNCTION buscar_perfil(
  user_email TEXT
)
RETURNS TABLE (
  email_usuario TEXT,
  nome_crianca TEXT,
  idade INTEGER,
  avatar TEXT,
  interesses TEXT[],
  espaco_disponivel TEXT[],
  companhia TEXT[],
  pontos_cognitivo INTEGER,
  pontos_motor INTEGER,
  pontos_social INTEGER,
  pontos_emocional INTEGER,
  nivel INTEGER,
  meta_semanal INTEGER,
  dias_consecutivos INTEGER,
  ultima_atividade_data TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.email_usuario,
    p.nome_crianca,
    p.idade,
    p.avatar,
    p.interesses,
    p.espaco_disponivel,
    p.companhia,
    p.pontos_cognitivo,
    p.pontos_motor,
    p.pontos_social,
    p.pontos_emocional,
    p.nivel,
    p.meta_semanal,
    p.dias_consecutivos,
    p.ultima_atividade_data,
    p.created_at,
    p.updated_at
  FROM public.perfis_criancas p
  WHERE p.email_usuario = LOWER(user_email)
  LIMIT 1;
END;
$$;

-- Permissões para funções RPC de storage
GRANT EXECUTE ON FUNCTION buscar_historico(TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION buscar_historico(TEXT, INTEGER) TO anon;

GRANT EXECUTE ON FUNCTION buscar_perfil(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION buscar_perfil(TEXT) TO anon;

-- ============================================
-- PARTE 6: INSERIR LICENÇAS DE TESTE (OPCIONAL)
-- ============================================

-- Descomente e ajuste os emails conforme necessário:
/*
INSERT INTO public.licencas (email, status, origem, updated_at)
VALUES 
  ('h@gmail.com', 'pago', NULL, NOW()),
  ('dan@gmail.com', 'pago', NULL, NOW()),
  ('teste@brincafacil.com', 'pago', 'eduzz', NOW())
ON CONFLICT (email) DO NOTHING;
*/

-- ============================================
-- PARTE 7: VERIFICAÇÃO FINAL
-- ============================================

-- Verificar tabelas criadas
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name IN ('licencas', 'atividades_historico', 'perfis_criancas', 'favoritos')
ORDER BY table_name, ordinal_position;

-- Verificar funções criadas
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public' 
  AND routine_name IN ('verificar_licenca', 'buscar_historico', 'buscar_perfil');

-- Verificar políticas RLS
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies 
WHERE tablename IN ('licencas', 'atividades_historico', 'perfis_criancas', 'favoritos')
ORDER BY tablename, policyname;

-- ============================================
-- TESTE FINAL
-- ============================================

-- Teste da função verificar_licenca (substitua pelo email de teste):
-- SELECT * FROM verificar_licenca('h@gmail.com');

-- ============================================
-- FIM DO SETUP
-- ============================================
-- Se tudo executou sem erros, o setup está completo!
-- Agora atualize as credenciais no código (.env e Vercel)

