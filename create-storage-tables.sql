-- ============================================
-- TABELAS PARA STORAGE SERVICE (Substitui LocalStorage)
-- ============================================
-- Este script cria as tabelas necessárias para o storageService.js

-- 1. TABELA: Histórico de Atividades
-- ============================================
CREATE TABLE IF NOT EXISTS public.atividades_historico (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email_usuario TEXT NOT NULL,
  atividade_id TEXT NOT NULL,
  atividade_nome TEXT NOT NULL,
  avaliacao INTEGER CHECK (avaliacao BETWEEN 1 AND 5),
  comentario TEXT,
  foto_base64 TEXT, -- ⚠️ Cuidado com tamanho - considere usar Storage do Supabase
  duracao_minutos INTEGER,
  dificuldade_sentida TEXT CHECK (dificuldade_sentida IN ('easy', 'medium', 'hard')),
  nivel_diversao TEXT CHECK (nivel_diversao IN ('boring', 'ok', 'fun')),
  data_realizacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para busca rápida por email
CREATE INDEX IF NOT EXISTS idx_atividades_historico_email 
ON public.atividades_historico(email_usuario);

-- Índice para ordenação por data
CREATE INDEX IF NOT EXISTS idx_atividades_historico_data 
ON public.atividades_historico(data_realizacao DESC);

-- 2. TABELA: Perfis das Crianças
-- ============================================
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
-- ============================================
CREATE TABLE IF NOT EXISTS public.favoritos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email_usuario TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('brincadeira', 'desenho')),
  item_id TEXT NOT NULL,
  item_nome TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(email_usuario, tipo, item_id)
);

-- Índice para busca rápida por email e tipo
CREATE INDEX IF NOT EXISTS idx_favoritos_email_tipo 
ON public.favoritos(email_usuario, tipo);

-- 4. HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.atividades_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfis_criancas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favoritos ENABLE ROW LEVEL SECURITY;

-- 5. POLÍTICAS RLS - Acesso baseado em email
-- ============================================

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

-- 6. VERIFICAR TABELAS CRIADAS
-- ============================================
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name IN ('atividades_historico', 'perfis_criancas', 'favoritos')
ORDER BY table_name, ordinal_position;

