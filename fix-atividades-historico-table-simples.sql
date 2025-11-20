-- ============================================
-- CORRIGIR TABELA atividades_historico (VERSÃO SIMPLES)
-- ============================================
-- Este script remove todas as constraints, altera os tipos e recria as constraints

-- PASSO 1: Remover TODAS as constraints CHECK da tabela
DO $$
DECLARE
  constraint_name_var TEXT;
BEGIN
  FOR constraint_name_var IN 
    SELECT constraint_name 
    FROM information_schema.table_constraints 
    WHERE table_schema = 'public' 
      AND table_name = 'atividades_historico' 
      AND constraint_type = 'CHECK'
  LOOP
    EXECUTE 'ALTER TABLE public.atividades_historico DROP CONSTRAINT IF EXISTS ' || quote_ident(constraint_name_var);
    RAISE NOTICE 'Constraint removida: %', constraint_name_var;
  END LOOP;
END $$;

-- PASSO 2: Limpar dados inválidos antes de alterar tipos
UPDATE public.atividades_historico
SET nivel_diversao = NULL
WHERE nivel_diversao IS NOT NULL;

UPDATE public.atividades_historico
SET dificuldade_sentida = NULL
WHERE dificuldade_sentida IS NOT NULL 
  AND dificuldade_sentida::text NOT IN ('easy', 'medium', 'hard');

-- PASSO 3: Alterar tipo de nivel_diversao para TEXT
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'atividades_historico' 
      AND column_name = 'nivel_diversao'
      AND data_type = 'integer'
  ) THEN
    ALTER TABLE public.atividades_historico 
    ALTER COLUMN nivel_diversao TYPE TEXT;
    RAISE NOTICE 'Coluna nivel_diversao alterada de INTEGER para TEXT';
  END IF;
END $$;

-- PASSO 4: Alterar tipo de dificuldade_sentida para TEXT (se necessário)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'atividades_historico' 
      AND column_name = 'dificuldade_sentida'
      AND data_type != 'text'
  ) THEN
    ALTER TABLE public.atividades_historico 
    ALTER COLUMN dificuldade_sentida TYPE TEXT;
    RAISE NOTICE 'Coluna dificuldade_sentida alterada para TEXT';
  END IF;
END $$;

-- PASSO 5: Garantir que avaliacao é INTEGER
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'atividades_historico' 
      AND column_name = 'avaliacao'
      AND data_type != 'integer'
  ) THEN
    ALTER TABLE public.atividades_historico 
    ALTER COLUMN avaliacao TYPE INTEGER 
    USING CASE 
      WHEN avaliacao::text ~ '^[0-9]+$' THEN avaliacao::text::integer
      ELSE NULL
    END;
    RAISE NOTICE 'Coluna avaliacao alterada para INTEGER';
  END IF;
END $$;

-- PASSO 6: Garantir que duracao_minutos é INTEGER
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'atividades_historico' 
      AND column_name = 'duracao_minutos'
      AND data_type != 'integer'
  ) THEN
    ALTER TABLE public.atividades_historico 
    ALTER COLUMN duracao_minutos TYPE INTEGER 
    USING CASE 
      WHEN duracao_minutos::text ~ '^[0-9]+$' THEN duracao_minutos::text::integer
      ELSE NULL
    END;
    RAISE NOTICE 'Coluna duracao_minutos alterada para INTEGER';
  END IF;
END $$;

-- PASSO 7: Recriar constraints com tipos corretos
ALTER TABLE public.atividades_historico
DROP CONSTRAINT IF EXISTS atividades_historico_nivel_diversao_check;

ALTER TABLE public.atividades_historico
ADD CONSTRAINT atividades_historico_nivel_diversao_check 
CHECK (nivel_diversao IS NULL OR nivel_diversao IN ('boring', 'ok', 'fun'));

ALTER TABLE public.atividades_historico
DROP CONSTRAINT IF EXISTS atividades_historico_dificuldade_sentida_check;

ALTER TABLE public.atividades_historico
ADD CONSTRAINT atividades_historico_dificuldade_sentida_check 
CHECK (dificuldade_sentida IS NULL OR dificuldade_sentida IN ('easy', 'medium', 'hard'));

ALTER TABLE public.atividades_historico
DROP CONSTRAINT IF EXISTS atividades_historico_avaliacao_check;

ALTER TABLE public.atividades_historico
ADD CONSTRAINT atividades_historico_avaliacao_check 
CHECK (avaliacao IS NULL OR (avaliacao >= 1 AND avaliacao <= 5));

-- PASSO 8: Verificar estrutura final
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'atividades_historico'
ORDER BY ordinal_position;

-- PASSO 9: Verificar constraints criadas
SELECT 
  constraint_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public' 
  AND table_name = 'atividades_historico'
  AND constraint_type = 'CHECK';


