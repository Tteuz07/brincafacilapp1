# ✅ Fluxo Corrigido de Cadastro

## 🎯 O Que Foi Corrigido

O código agora segue o fluxo **CORRETO**:

1. ✅ **Verifica licença PRIMEIRO** (via RPC `verificar_licenca`)
2. ✅ **Se autorizado**, cadastra diretamente no Supabase Auth
3. ✅ **Se usuário já existe**, tenta fazer login automaticamente

## 📋 Fluxo Completo

### Passo 1: Usuário Tenta Cadastrar

1. Usuário acessa `/login`
2. Vai na aba "Cadastrar"
3. Digita email e senha
4. Clica em "Cadastrar"

### Passo 2: Sistema Verifica Licença

O sistema chama `verificar_licenca(email)` para verificar se:
- ✅ Email está na tabela `licencas`
- ✅ Status é `'pago'`

**Se NÃO autorizado:**
- ❌ Mostra erro: "Este e-mail não está autorizado..."
- ❌ Para o processo

**Se autorizado:**
- ✅ Continua para cadastro

### Passo 3: Cadastro no Supabase Auth

O sistema tenta criar o usuário no Supabase Auth.

**Se der erro "usuário já existe":**
- ✅ Tenta fazer login automaticamente
- ✅ Se login funcionar → redireciona para `/gate`
- ✅ Se login falhar → mostra mensagem para usar aba "Entrar"

**Se cadastro funcionar:**
- ✅ Redireciona para `/gate`
- ✅ `/gate` verifica licença novamente
- ✅ Libera acesso

## 🧪 Como Testar

### 1. Inserir Email na Tabela `licencas`

```sql
INSERT INTO public.licencas (email, status, origem, updated_at)
VALUES ('teste@gmail.com', 'pago', NULL, NOW())
ON CONFLICT (email) DO UPDATE 
SET status = 'pago', updated_at = NOW();
```

### 2. Verificar se Está na Tabela

```sql
SELECT * FROM public.licencas WHERE email = 'teste@gmail.com';
```

### 3. Testar Função RPC

```sql
SELECT * FROM verificar_licenca('teste@gmail.com');
```

**Deve retornar:**
```
valido: true
status: 'pago'
```

### 4. Cadastrar no App

1. Abra o app
2. Vá na aba "Cadastrar"
3. Email: `teste@gmail.com`
4. Senha: (qualquer senha com 6+ caracteres)
5. Clique em "Cadastrar"

### 5. Verificar no Console

Pressione **F12** e vá na aba **Console**. Você deve ver:

```
[LOGIN] Tentando cadastrar: teste@gmail.com
[LOGIN] Verificando se email está autorizado na tabela licencas...
[LOGIN] Resultado verificar_licenca: { hasData: true, ... }
✅ Email autorizado! Prosseguindo com cadastro...
[LOGIN] Email autorizado, tentando cadastrar no Supabase Auth...
✅ Cadastro realizado: ...
```

## ✅ Resultado Esperado

- ✅ Não deve aparecer erro 400 de "usuário não existe"
- ✅ Não deve aparecer erro de "email não autorizado" (se estiver na tabela)
- ✅ Deve cadastrar com sucesso
- ✅ Deve redirecionar para `/gate`
- ✅ Deve verificar licença e liberar acesso

## 🚨 Se Ainda Der Erro

1. **Verifique se o email está na tabela `licencas`:**
   ```sql
   SELECT * FROM public.licencas WHERE email = 'seu-email@gmail.com';
   ```

2. **Verifique se o status é `'pago'`:**
   ```sql
   SELECT email, status FROM public.licencas WHERE email = 'seu-email@gmail.com';
   ```

3. **Teste a função RPC:**
   ```sql
   SELECT * FROM verificar_licenca('seu-email@gmail.com');
   ```
   Deve retornar `valido: true`

4. **Verifique o console do navegador** (F12) para ver logs detalhados

5. **Limpe o cache do navegador** e tente novamente

