-- ============================================
-- FUNÇÕES RPC PARA STORAGE SERVICE
-- ============================================
-- Funções seguras para buscar dados do storageService.js

-- 1. FUNÇÃO: Buscar Histórico de Atividades
-- ============================================
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
-- ============================================
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

-- 3. PERMISSÕES
-- ============================================
GRANT EXECUTE ON FUNCTION buscar_historico(TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION buscar_historico(TEXT, INTEGER) TO anon;

GRANT EXECUTE ON FUNCTION buscar_perfil(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION buscar_perfil(TEXT) TO anon;

-- 4. COMENTÁRIOS
-- ============================================
COMMENT ON FUNCTION buscar_historico(TEXT, INTEGER) IS 
'Busca histórico de atividades do usuário de forma segura. Retorna até o limite especificado.';

COMMENT ON FUNCTION buscar_perfil(TEXT) IS 
'Busca perfil da criança do usuário de forma segura. Retorna null se não encontrado.';

-- 5. TESTES (Execute separadamente)
-- ============================================
-- Teste buscar histórico:
-- SELECT * FROM buscar_historico('seu-email@exemplo.com', 10);

-- Teste buscar perfil:
-- SELECT * FROM buscar_perfil('seu-email@exemplo.com');


