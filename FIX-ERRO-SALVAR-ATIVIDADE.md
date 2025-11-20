# 🔧 Fix: Erro ao Salvar Atividade no Supabase

## ❌ Problema

Ao tentar salvar uma atividade no histórico, ocorria o seguinte erro:

```
POST https://...supabase.co/rest/v1/atividades_historico?select=* 400 (Bad Request)
Erro ao salvar atividade: {code: '22092', message: 'invalid input syntax for type integer: "fun"'}
```

### Causa

O erro acontecia porque:
1. O campo `nivel_diversao` estava recebendo a string `"fun"` (ou `"ok"`, `"boring"`)
2. A tabela no Supabase pode ter sido criada com o tipo `INTEGER` ao invés de `TEXT`
3. Ou os dados estavam sendo enviados sem validação de tipo

## ✅ Solução Aplicada

### 1. Validação e Conversão de Tipos no `storageService.js`

O arquivo `src/lib/storageService.js` foi atualizado para:
- ✅ Converter `avaliacao` para INTEGER (1-5)
- ✅ Converter `duracao_minutos` para INTEGER
- ✅ Validar `dificuldade_sentida` como TEXT ('easy', 'medium', 'hard')
- ✅ Validar `nivel_diversao` como TEXT ('boring', 'ok', 'fun')
- ✅ Mapear valores alternativos (ex: 'divertido' → 'fun')
- ✅ Adicionar logs detalhados para debug

### 2. Script SQL para Corrigir a Tabela

Foi criado o arquivo `fix-atividades-historico-table.sql` que:
- Verifica a estrutura atual da tabela
- Corrige o tipo de `nivel_diversao` de INTEGER para TEXT (se necessário)
- Corrige o tipo de `dificuldade_sentida` para TEXT (se necessário)
- Adiciona constraints de validação
- Verifica se `avaliacao` e `duracao_minutos` estão como INTEGER

## 📋 Como Aplicar a Correção

### Passo 1: Executar o Script SQL

1. Abra o Supabase Dashboard
2. Vá em **SQL Editor**
3. Cole o conteúdo do arquivo `fix-atividades-historico-table.sql`
4. Clique em **Run** (ou pressione `Ctrl+Enter`)

### Passo 2: Testar

1. Abra o app no navegador
2. Registre uma atividade
3. Verifique o console do navegador (F12)
4. Não deve mais aparecer o erro 400

## 🔍 Verificação

Após executar o script SQL, verifique se a estrutura está correta:

```sql
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'atividades_historico'
ORDER BY ordinal_position;
```

A estrutura esperada:
- `nivel_diversao`: **TEXT** (não INTEGER)
- `dificuldade_sentida`: **TEXT**
- `avaliacao`: **INTEGER**
- `duracao_minutos`: **INTEGER**

## 📝 Valores Válidos

### nivel_diversao
- `'boring'` - Chato/Entediante
- `'ok'` - OK
- `'fun'` - Divertido

### dificuldade_sentida
- `'easy'` - Fácil
- `'medium'` - Médio
- `'hard'` - Difícil

### avaliacao
- `1` a `5` (INTEGER)

### duracao_minutos
- Qualquer número inteiro positivo (INTEGER)

## 🐛 Debug

Se ainda houver erros:

1. **Abra o console do navegador** (F12)
2. **Procure por logs** que começam com:
   - `Erro ao salvar atividade:`
   - `Dados recebidos:`
3. **Verifique os dados** que estão sendo enviados
4. **Compare com a estrutura da tabela** no Supabase

## ✅ Status

- [x] Validação de tipos implementada
- [x] Script SQL criado
- [x] Logs de debug adicionados
- [ ] Script SQL executado no Supabase (você precisa fazer isso)
- [ ] Teste realizado


