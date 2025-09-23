# 🚀 Configuração Simples do Supabase

## 📋 Passo a Passo

### 1. **Criar Projeto no Supabase**
1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Escolha uma organização
5. Digite o nome: `brincafacil-app`
6. Escolha uma senha forte para o banco
7. Escolha uma região (preferencialmente Brasil)
8. Clique em "Create new project"

### 2. **Configurar o Banco de Dados**
1. No painel do Supabase, vá em "SQL Editor"
2. Clique em "New query"
3. Cole o conteúdo do arquivo `database-simple.sql`
4. Clique em "Run" para executar

### 3. **Pegar as Credenciais**
1. No painel do Supabase, vá em "Settings" > "API"
2. Copie a **Project URL**
3. Copie a **anon public** key

### 4. **Configurar no Projeto**
1. Crie um arquivo `.env` na raiz do projeto
2. Cole as credenciais:

```env
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

### 5. **Adicionar Emails Autorizados**
1. No painel do Supabase, vá em "Table Editor"
2. Selecione a tabela `authorized_emails`
3. Clique em "Insert" > "Insert row"
4. Adicione o email e marque `active` como `true`

### 6. **Testar o PWA**
```bash
npm run dev
```

## ✅ Pronto!

Agora o PWA vai funcionar com:
- ✅ Login por email autorizado
- ✅ Verificação automática no Supabase
- ✅ Sistema simples e confiável

## 📧 Emails de Teste Incluídos:
- `demo@brincafacil.com`
- `teste@exemplo.com`
- `admin@brincafacil.com`
