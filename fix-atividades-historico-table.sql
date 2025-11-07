-- ============================================
-- CORRIGIR TABELA atividades_historico
-- ============================================
-- Este script verifica e corrige a estrutura da tabela
-- para garantir que os tipos de dados estão corretos

-- 1. Verificar estrutura atual da tabela
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'atividades_historico'
ORDER BY ordinal_position;

-- 2. Se a coluna nivel_diversao for INTEGER, alterar para TEXT
-- IMPORTANTE: Remover TODAS as constraints primeiro, depois alterar tipo, depois recriar constraints
DO $$
DECLARE
  constraint_name_var TEXT;
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'atividades_historico' 
      AND column_name = 'nivel_diversao'
      AND data_type = 'integer'
  ) THEN
    -- PRIMEIRO: Remover TODAS as constraints CHECK que podem estar usando nivel_diversao
    FOR constraint_name_var IN 
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_schema = 'public' 
        AND table_name = 'atividades_historico' 
        AND constraint_type = 'CHECK'
        AND constraint_name LIKE '%nivel_diversao%'
    LOOP
      EXECUTE 'ALTER TABLE public.atividades_historico DROP CONSTRAINT IF EXISTS ' || constraint_name_var;
    END LOOP;
    
    -- Limpar dados inválidos (converter números para NULL)
    UPDATE public.atividades_historico
    SET nivel_diversao = NULL
    WHERE nivel_diversao IS NOT NULL;
    
    -- SEGUNDO: Alterar o tipo da coluna (sem constraint, deve funcionar)
    ALTER TABLE public.atividades_historico 
    ALTER COLUMN nivel_diversao TYPE TEXT 
    USING NULL; -- Limpar todos os valores primeiro
    
    -- TERCEIRO: Recriar constraint com tipo correto
    ALTER TABLE public.atividades_historico
    DROP CONSTRAINT IF EXISTS atividades_historico_nivel_diversao_check;
    
    ALTER TABLE public.atividades_historico
    ADD CONSTRAINT atividades_historico_nivel_diversao_check 
    CHECK (nivel_diversao IS NULL OR nivel_diversao IN ('boring', 'ok', 'fun'));
    
    RAISE NOTICE 'Coluna nivel_diversao alterada de INTEGER para TEXT';
  ELSE
    RAISE NOTICE 'Coluna nivel_diversao já está como TEXT ou não existe';
  END IF;
END $$;

-- 3. Verificar se dificuldade_sentida está como TEXT
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
    -- PRIMEIRO: Remover constraint
    ALTER TABLE public.atividades_historico
    DROP CONSTRAINT IF EXISTS atividades_historico_dificuldade_sentida_check;
    
    -- Limpar dados inválidos
    UPDATE public.atividades_historico
    SET dificuldade_sentida = NULL
    WHERE dificuldade_sentida IS NOT NULL 
      AND dificuldade_sentida::text NOT IN ('easy', 'medium', 'hard');
    
    -- SEGUNDO: Alterar tipo
    ALTER TABLE public.atividades_historico 
    ALTER COLUMN dificuldade_sentida TYPE TEXT 
    USING CASE 
      WHEN dificuldade_sentida::text IN ('easy', 'medium', 'hard') THEN dificuldade_sentida::text
      ELSE NULL
    END;
    
    -- TERCEIRO: Recriar constraint
    ALTER TABLE public.atividades_historico
    ADD CONSTRAINT atividades_historico_dificuldade_sentida_check 
    CHECK (dificuldade_sentida IS NULL OR dificuldade_sentida IN ('easy', 'medium', 'hard'));
    
    RAISE NOTICE 'Coluna dificuldade_sentida corrigida';
  ELSE
    RAISE NOTICE 'Coluna dificuldade_sentida já está correta';
  END IF;
END $$;

-- 4. Verificar se avaliacao está como INTEGER
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
    -- PRIMEIRO: Remover constraint
    ALTER TABLE public.atividades_historico
    DROP CONSTRAINT IF EXISTS atividades_historico_avaliacao_check;
    
    -- SEGUNDO: Alterar tipo
    ALTER TABLE public.atividades_historico 
    ALTER COLUMN avaliacao TYPE INTEGER 
    USING CASE 
      WHEN avaliacao::text ~ '^[0-9]+$' THEN avaliacao::text::integer
      ELSE NULL
    END;
    
    -- TERCEIRO: Recriar constraint
    ALTER TABLE public.atividades_historico
    ADD CONSTRAINT atividades_historico_avaliacao_check 
    CHECK (avaliacao IS NULL OR (avaliacao >= 1 AND avaliacao <= 5));
    
    RAISE NOTICE 'Coluna avaliacao corrigida';
  ELSE
    RAISE NOTICE 'Coluna avaliacao já está correta';
  END IF;
END $$;

-- 5. Verificar se duracao_minutos está como INTEGER
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
    -- Remover constraint se existir
    ALTER TABLE public.atividades_historico
    DROP CONSTRAINT IF EXISTS atividades_historico_duracao_minutos_check;
    
    -- Alterar tipo
    ALTER TABLE public.atividades_historico 
    ALTER COLUMN duracao_minutos TYPE INTEGER 
    USING CASE 
      WHEN duracao_minutos::text ~ '^[0-9]+$' THEN duracao_minutos::text::integer
      ELSE NULL
    END;
    
    RAISE NOTICE 'Coluna duracao_minutos corrigida';
  ELSE
    RAISE NOTICE 'Coluna duracao_minutos já está correta';
  END IF;
END $$;

-- 6. Verificar estrutura final
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'atividades_historico'
ORDER BY ordinal_position;

-- 7. Verificar constraints
SELECT 
  constraint_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public' 
  AND table_name = 'atividades_historico';

