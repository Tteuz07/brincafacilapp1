# ✅ SOLUÇÃO DEFINITIVA - Verificação de Licença

## 🎯 Passo 1: Recriar a Função RPC no Supabase

Execute este script no SQL Editor do Supabase:

```sql
-- Remover função antiga
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
  -- Normalizar email
  email_lower := LOWER(TRIM(user_email));
  
  -- Buscar licença
  SELECT 
    l.email,
    l.status as licenca_status,
    l.updated_at,
    COALESCE(l.origem, '') as origem
  INTO licenca_record
  FROM public.licencas l
  WHERE LOWER(TRIM(l.email)) = email_lower
  LIMIT 1;

  -- Se não encontrou, retorna inválido (SEMPRE retorna 1 linha)
  IF NOT FOUND OR licenca_record.email IS NULL THEN
    RETURN QUERY SELECT 
      false::BOOLEAN as valido,
      NULL::TEXT as nome,
      NULL::TIMESTAMP WITH TIME ZONE as data_compra,
      'nao_encontrado'::TEXT as status;
    RETURN;
  END IF;

  -- Se encontrou e está pago, retorna válido
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

-- Testar
SELECT * FROM verificar_licenca('h@gmail.com');
```

## 🎯 Passo 2: Limpar Cache do Navegador

1. **Pressione `Ctrl + Shift + Delete`**
2. Selecione:
   - ✅ "Imagens e arquivos em cache"
   - ✅ "Cookies e outros dados do site"
3. Período: **"Todo o período"**
4. Clique em **"Limpar dados"**

## 🎯 Passo 3: Recarregar a Página

1. Feche todas as abas do site
2. Abra uma nova aba
3. Acesse `www.brincafacil.online/gate`
4. Faça login se necessário

## ✅ Verificação

Após seguir os passos, verifique no console (F12):

- ✅ Deve aparecer: `[GATE] Chamando função RPC verificar_licenca...`
- ✅ Deve aparecer: `[GATE] Resposta completa do Supabase:`
- ✅ **NÃO deve aparecer** requisições para `/rest/v1/licencas`
- ✅ Deve aparecer apenas requisições para `/rest/v1/rpc/verificar_licenca`

## 🐛 Se Ainda Não Funcionar

Execute no console do navegador:

```javascript
// Limpar tudo
localStorage.clear();
sessionStorage.clear();

// Recarregar
window.location.reload();
```

