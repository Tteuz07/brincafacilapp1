-- ============================================
-- CORRIGIR FUNÇÃO verificar_licenca
-- ============================================
-- A função estava tentando usar coluna "data_da_compra" que não existe
-- Vamos recriar usando "updated_at" que é o nome correto da coluna

-- Remover a função antiga (se existir)
DROP FUNCTION IF EXISTS verificar_licenca(TEXT);

-- Criar função corrigida que verifica a licença de forma segura
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
BEGIN
  -- Buscar a licença do usuário (qualificar colunas para evitar ambiguidade)
  SELECT 
    l.email,
    l.status as licenca_status,
    l.updated_at,
    COALESCE(l.origem, '') as origem
  INTO licenca_record
  FROM public.licencas l
  WHERE l.email = LOWER(user_email)
  LIMIT 1;

  -- Se não encontrou a licença, retorna inválido
  IF NOT FOUND THEN
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

-- Garantir que a função seja executável por usuários autenticados
GRANT EXECUTE ON FUNCTION verificar_licenca(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION verificar_licenca(TEXT) TO anon;

-- Comentário explicativo
COMMENT ON FUNCTION verificar_licenca(TEXT) IS 
'Função segura para verificar se um usuário tem licença válida. Retorna apenas informações necessárias sem expor dados sensíveis da tabela licencas. Usa updated_at como data_compra.';

-- Teste: Verificar se a função funciona
-- Execute separadamente substituindo o email:
-- SELECT * FROM verificar_licenca('seu-email@exemplo.com');

