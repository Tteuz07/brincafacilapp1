-- ============================================
-- RECRIAR FUNÇÃO verificar_licenca (VERSÃO COMPLETA E TESTADA)
-- ============================================
-- Esta versão garante que a função sempre retorna pelo menos 1 linha
-- mesmo quando o email não é encontrado

-- 1. Remover a função antiga (se existir)
DROP FUNCTION IF EXISTS verificar_licenca(TEXT);

-- 2. Criar função corrigida que SEMPRE retorna resultado
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

-- 3. Garantir que a função seja executável por usuários autenticados e anônimos
GRANT EXECUTE ON FUNCTION verificar_licenca(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION verificar_licenca(TEXT) TO anon;

-- 4. Comentário explicativo
COMMENT ON FUNCTION verificar_licenca(TEXT) IS 
'Função segura para verificar se um usuário tem licença válida. Retorna sempre pelo menos 1 linha. Usa LOWER e TRIM para garantir comparação correta de emails.';

-- 5. TESTE: Verificar se a função funciona
-- Execute estas queries para testar:

-- Teste 1: Email que existe
SELECT * FROM verificar_licenca('h@gmail.com');
-- Resultado esperado: valido=true, status='pago'

-- Teste 2: Email que não existe
SELECT * FROM verificar_licenca('naoexiste@gmail.com');
-- Resultado esperado: valido=false, status='nao_encontrado'

-- Teste 3: Email com maiúsculas
SELECT * FROM verificar_licenca('H@GMAIL.COM');
-- Resultado esperado: valido=true, status='pago' (deve funcionar mesmo com maiúsculas)

-- Teste 4: Email com espaços
SELECT * FROM verificar_licenca(' h@gmail.com ');
-- Resultado esperado: valido=true, status='pago' (deve funcionar mesmo com espaços)


