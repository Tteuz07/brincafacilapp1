# 🔍 Diagnóstico: Conta Supabase Não Funciona

## ❌ Problemas Possíveis

1. **Conta suspensa ou bloqueada**
2. **Credenciais incorretas**
3. **Projeto deletado ou pausado**
4. **Variáveis de ambiente não configuradas**
5. **Limite de uso excedido (plano Free)**

## ✅ Passo 1: Verificar Status da Conta

1. Acesse: https://supabase.com
2. Faça login na sua conta
3. Verifique se o projeto aparece na lista
4. Clique no projeto

**Se o projeto não aparecer:**
- O projeto pode ter sido deletado
- A conta pode ter sido suspensa
- Você pode estar logado na conta errada

## ✅ Passo 2: Verificar Status do Projeto

No painel do Supabase, verifique:

1. **Status do Projeto:**
   - Deve estar "Active" (não "Paused" ou "Deleted")
   - Se estiver "Paused", clique em "Resume"

2. **Uso de Recursos:**
   - Vá em "Settings" → "Usage"
   - Verifique se não excedeu os limites do plano Free

3. **API Status:**
   - Vá em "Settings" → "API"
   - Verifique se a URL e as chaves estão visíveis

## ✅ Passo 3: Verificar Credenciais

1. No painel do Supabase, vá em **Settings** → **API**
2. Copie:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (chave longa começando com `eyJ...`)

3. Verifique se as credenciais estão corretas no seu código:
   - Arquivo `.env` (desenvolvimento local)
   - Variáveis de ambiente na Vercel (produção)

## ✅ Passo 4: Testar Conexão

Execute no console do navegador (F12):

```javascript
// Verificar se as variáveis estão carregadas
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...');

// Testar conexão
const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Testar query simples
const { data, error } = await supabase.from('licencas').select('count').limit(1);
console.log('Teste:', { data, error });
```

## ✅ Passo 5: Verificar Erros Específicos

### Erro: "Invalid API key"
- **Causa:** Chave incorreta ou expirada
- **Solução:** Copie a chave novamente do painel do Supabase

### Erro: "Project not found"
- **Causa:** URL incorreta ou projeto deletado
- **Solução:** Verifique a URL no painel do Supabase

### Erro: "Rate limit exceeded"
- **Causa:** Muitas requisições (plano Free tem limites)
- **Solução:** Aguarde alguns minutos ou faça upgrade do plano

### Erro: "Project paused"
- **Causa:** Projeto foi pausado por inatividade
- **Solução:** Vá no painel e clique em "Resume project"

## ✅ Passo 6: Recriar Projeto (Último Recurso)

Se nada funcionar, você pode precisar recriar o projeto:

1. **Criar Novo Projeto:**
   - Acesse https://supabase.com
   - Clique em "New Project"
   - Escolha organização
   - Nome: `brincafacil-app` (ou outro)
   - Escolha região
   - Crie o projeto

2. **Recriar Tabelas:**
   - Execute os scripts SQL que você tem:
     - `recreate-licencas-table.sql`
     - `create-storage-tables.sql`
     - `recriar-verificar-licenca-completo.sql`

3. **Atualizar Credenciais:**
   - Copie a nova URL e chave
   - Atualize no `.env` (local)
   - Atualize na Vercel (produção)

4. **Migrar Dados (se necessário):**
   - Se você tinha dados no projeto antigo, exporte antes de deletar
   - Importe no novo projeto

## 🆘 Se Nada Funcionar

1. **Contate o Suporte do Supabase:**
   - Email: support@supabase.com
   - Ou use o chat no painel

2. **Verifique os Logs:**
   - No painel do Supabase, vá em "Logs"
   - Veja se há erros recentes

3. **Verifique o Status do Serviço:**
   - Acesse: https://status.supabase.com
   - Veja se há problemas conhecidos

## 📋 Checklist Rápido

- [ ] Consigo fazer login no Supabase?
- [ ] O projeto aparece na lista?
- [ ] O projeto está "Active" (não pausado)?
- [ ] As credenciais (URL e KEY) estão corretas?
- [ ] As variáveis de ambiente estão configuradas?
- [ ] O teste de conexão funciona?
- [ ] Não excedi os limites do plano Free?


