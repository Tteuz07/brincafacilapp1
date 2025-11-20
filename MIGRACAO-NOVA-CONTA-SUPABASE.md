# 🔄 Migração para Nova Conta Supabase

## ✅ Passo 1: Criar Nova Conta e Projeto

1. Acesse: https://supabase.com
2. Clique em "Sign Up" (criar nova conta)
3. Crie o projeto:
   - Nome: `brincafacil-app` (ou outro nome)
   - Senha do banco: **ANOTE BEM** (você vai precisar)
   - Região: Escolha a mais próxima (Brasil se disponível)
4. Aguarde o projeto ser criado (pode levar alguns minutos)

## ✅ Passo 2: Pegar as Novas Credenciais

1. No painel do Supabase, vá em **Settings** → **API**
2. Copie:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (chave longa começando com `eyJ...`)

## ✅ Passo 3: Executar Scripts SQL (NESTA ORDEM)

Execute cada script no SQL Editor do Supabase, **um por vez**, na ordem abaixo:

### 3.1. Criar Tabela de Licenças
Execute: `recreate-licencas-table.sql`

### 3.2. Criar Função RPC de Verificação
Execute: `recriar-verificar-licenca-completo.sql`

### 3.3. Criar Tabelas de Storage
Execute: `create-storage-tables.sql`

### 3.4. Criar Funções RPC de Storage
Execute: `create-storage-rpc-functions.sql`

## ✅ Passo 4: Inserir Dados de Licenças (Se Tiver)

Se você tinha emails com licenças na conta antiga, insira manualmente:

```sql
-- Inserir licenças (substitua pelos emails reais)
INSERT INTO public.licencas (email, status, origem, updated_at)
VALUES 
  ('h@gmail.com', 'pago', NULL, NOW()),
  ('dan@gmail.com', 'pago', NULL, NOW()),
  ('teste@brincafacil.com', 'pago', 'eduzz', NOW())
ON CONFLICT (email) DO NOTHING;
```

## ✅ Passo 5: Atualizar Credenciais no Código

### 5.1. Arquivo Local (.env)

Crie/atualize o arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://sua-nova-url.supabase.co
VITE_SUPABASE_ANON_KEY=sua-nova-chave-aqui
```

### 5.2. Vercel (Produção)

1. Acesse: https://vercel.com
2. Vá no seu projeto
3. **Settings** → **Environment Variables**
4. Atualize:
   - `VITE_SUPABASE_URL` → Nova URL
   - `VITE_SUPABASE_ANON_KEY` → Nova chave
5. Faça um novo deploy

## ✅ Passo 6: Testar

1. Recarregue a aplicação
2. Abra o console (F12)
3. Verifique se aparece:
   - `🔍 DEBUG Supabase Env:` com `hasUrl: true` e `hasKey: true`
4. Tente fazer login

## 📋 Checklist Completo

- [ ] Nova conta criada no Supabase
- [ ] Novo projeto criado
- [ ] Credenciais copiadas (URL e KEY)
- [ ] Script `recreate-licencas-table.sql` executado
- [ ] Script `recriar-verificar-licenca-completo.sql` executado
- [ ] Script `create-storage-tables.sql` executado
- [ ] Script `create-storage-rpc-functions.sql` executado
- [ ] Licenças inseridas manualmente (se necessário)
- [ ] Arquivo `.env` atualizado (local)
- [ ] Variáveis atualizadas na Vercel (produção)
- [ ] Novo deploy feito na Vercel
- [ ] Teste de conexão funcionando

## 🆘 Se Algo Der Errado

1. **Verifique os logs do SQL Editor:**
   - Cada script deve mostrar "Success" ou "Query executed successfully"

2. **Teste a função RPC:**
   ```sql
   SELECT * FROM verificar_licenca('h@gmail.com');
   ```
   Deve retornar uma linha com `valido`, `nome`, `data_compra`, `status`

3. **Verifique as políticas RLS:**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'licencas';
   ```
   Deve mostrar políticas que bloqueiam acesso direto

## 📝 Notas Importantes

- ⚠️ **Dados antigos:** Se você tinha dados na conta antiga (perfis, favoritos, histórico), eles não serão migrados automaticamente. Você precisaria exportar manualmente.

- ✅ **Estrutura:** Todos os scripts estão salvos aqui, então você pode recriar tudo do zero.

- 🔐 **Segurança:** As políticas RLS estão configuradas para bloquear acesso direto às tabelas, usando apenas funções RPC.


