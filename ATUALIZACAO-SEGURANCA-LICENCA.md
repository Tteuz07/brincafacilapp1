# 🔒 Atualização de Segurança - Verificação de Licença

## ✅ O que foi feito

A verificação de licença foi atualizada para usar uma **função RPC segura** no banco de dados, substituindo o acesso direto à tabela `licencas`.

### Antes (INSEGURO):
```javascript
// ❌ Qualquer pessoa pode ver isso no DevTools
const { data, error } = await supabase
  .from('licencas')
  .select('status')
  .eq('email', email)
  .single();
```

### Depois (SEGURO):
```javascript
// ✅ Usa função protegida do banco
const { data, error } = await supabase
  .rpc('verificar_licenca', { 
    user_email: email 
  });
```

## 📋 Arquivos Atualizados

1. **`src/utils/checkLicense.js`** - Função principal de verificação
2. **`src/pages/Gate.jsx`** - Página de verificação de acesso
3. **`create-verificar-licenca-function.sql`** - Nova função RPC (criada)

## 🚀 Como Aplicar

### PASSO 1: Executar a função SQL no Supabase

1. Acesse o **Supabase Dashboard**
2. Vá em **SQL Editor**
3. Abra o arquivo `create-verificar-licenca-function.sql`
4. Copie e cole o conteúdo no editor SQL
5. Clique em **Run** para executar

A função `verificar_licenca` será criada no banco de dados.

### PASSO 2: Verificar se funcionou

Execute este teste no SQL Editor:

```sql
-- Teste a função (substitua pelo email de teste)
SELECT * FROM verificar_licenca('seu-email@exemplo.com');
```

Você deve ver um resultado como:
```
valido | nome | data_compra | status
-------|------|-------------|--------
true   | ...  | 2024-...    | pago
```

### PASSO 3: Testar no App

1. Faça login no app
2. Verifique se a verificação de licença funciona corretamente
3. Verifique os logs do console para confirmar que não há erros

## 🔐 Benefícios de Segurança

1. **Não expõe a estrutura da tabela** - A função RPC esconde os detalhes internos
2. **Controle de acesso** - A função pode ter lógica adicional de segurança
3. **Auditoria** - Mais fácil rastrear quem está verificando licenças
4. **Performance** - A função pode ser otimizada no banco de dados
5. **Manutenibilidade** - Mudanças na lógica de verificação ficam centralizadas

## ⚠️ Importante

- A função SQL **deve ser executada no Supabase** antes de usar o app
- Se a função não existir, o app retornará erro ao verificar licenças
- A função usa `SECURITY DEFINER` para garantir acesso mesmo com RLS ativo

## 🐛 Troubleshooting

### Erro: "function verificar_licenca does not exist"
- **Solução**: Execute o arquivo SQL `create-verificar-licenca-function.sql` no Supabase

### Erro: "permission denied for function verificar_licenca"
- **Solução**: Verifique se as permissões GRANT foram aplicadas corretamente no SQL

### A verificação sempre retorna "inválido"
- **Solução**: Verifique se a tabela `licencas` existe e tem dados
- Verifique se o email está em minúsculas (a função usa LOWER)

## 📝 Notas Técnicas

- A função retorna um objeto com: `valido`, `nome`, `data_compra`, `status`
- O campo `valido` é um BOOLEAN que indica se a licença está ativa
- A função é executada com `SECURITY DEFINER` para garantir acesso à tabela
- As permissões são concedidas para `authenticated` e `anon` roles

