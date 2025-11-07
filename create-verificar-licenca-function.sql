-- ============================================
-- FUNÇÃO RPC SEGURA PARA VERIFICAR LICENÇA
-- ============================================
-- Esta função substitui o acesso direto à tabela 'licencas'
-- e garante que apenas informações necessárias sejam retornadas

-- Criar função que verifica a licença de forma segura
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
  -- Buscar a licença do usuário
  SELECT 
    email,
    status,
    updated_at,
    COALESCE(origem, '') as origem
  INTO licenca_record
  FROM public.licencas
  WHERE email = LOWER(user_email)
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
  IF licenca_record.status = 'pago' THEN
    RETURN QUERY SELECT 
      true::BOOLEAN as valido,
      COALESCE(licenca_record.origem, '')::TEXT as nome,
      licenca_record.updated_at::TIMESTAMP WITH TIME ZONE as data_compra,
      licenca_record.status::TEXT as status;
  ELSE
    RETURN QUERY SELECT 
      false::BOOLEAN as valido,
      NULL::TEXT as nome,
      licenca_record.updated_at::TIMESTAMP WITH TIME ZONE as data_compra,
      licenca_record.status::TEXT as status;
  END IF;
END;
$$;

-- Garantir que a função seja executável por usuários autenticados
GRANT EXECUTE ON FUNCTION verificar_licenca(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION verificar_licenca(TEXT) TO anon;

-- Comentário explicativo
COMMENT ON FUNCTION verificar_licenca(TEXT) IS 
'Função segura para verificar se um usuário tem licença válida. Retorna apenas informações necessárias sem expor dados sensíveis da tabela licencas.';

