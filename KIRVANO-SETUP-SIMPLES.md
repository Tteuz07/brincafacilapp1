# 🚀 Configuração Simples - Kirvano + Supabase

## 📋 Fluxo Completo

### **1. Kirvano → Webhook → Supabase → PWA**

```
Cliente compra na Kirvano
    ↓
Kirvano envia webhook para /api/webhook/kirvano
    ↓
Webhook salva/atualiza usuário no Supabase
    ↓
Cliente tenta fazer login no PWA
    ↓
PWA consulta Supabase se status = "approved"
    ↓
Se aprovado → Acesso liberado! 🎉
```

## 🗄️ **1. CONFIGURAR SUPABASE**

### **Criar Tabela:**
```sql
-- Executar no SQL Editor do Supabase
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- Política de segurança
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to users" ON users FOR SELECT USING (true);
```

### **Pegar Credenciais:**
1. **Project URL:** `https://seuprojeto.supabase.co`
2. **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. **Service Role Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (para webhook)

## 🔗 **2. CONFIGURAR WEBHOOK**

### **URL do Webhook:**
```
https://seudominio.com/api/webhook/kirvano
```

### **Formato que a Kirvano deve enviar:**
```json
{
  "email": "cliente@exemplo.com",
  "status": "approved"
}
```

### **Headers:**
```
Content-Type: application/json
```

## ⚙️ **3. CONFIGURAR VARIÁVEIS DE AMBIENTE**

### **No seu servidor (webhook):**
```env
VITE_SUPABASE_URL=https://seuprojeto.supabase.co
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **No PWA (frontend):**
```env
VITE_SUPABASE_URL=https://seuprojeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🧪 **4. TESTAR O SISTEMA**

### **Teste 1: Webhook**
```bash
curl -X POST https://seudominio.com/api/webhook/kirvano \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com","status":"approved"}'
```

### **Teste 2: Login no PWA**
1. Acesse o PWA
2. Digite: `teste@exemplo.com`
3. Deve aparecer: ✅ **Pagamento Aprovado**

### **Teste 3: Status Pendente**
```bash
curl -X POST https://seudominio.com/api/webhook/kirvano \
  -H "Content-Type: application/json" \
  -d '{"email":"novo@exemplo.com","status":"pending"}'
```

No PWA deve aparecer: ⏳ **Aguardando Aprovação**

## 📱 **5. ESTADOS NO PWA**

### **✅ Aprovado (status: "approved")**
- Botão "Entrar" habilitado
- Mensagem: "Pagamento Aprovado"
- Acesso liberado

### **⏳ Pendente (status: "pending")**
- Botão "Entrar" desabilitado
- Mensagem: "Aguardando Aprovação"
- Acesso negado

### **❌ Não Encontrado (sem registro)**
- Botão "Entrar" desabilitado
- Mensagem: "Pagamento Não Encontrado"
- Acesso negado

## 🎯 **6. CONFIGURAR NA KIRVANO**

### **URL do Webhook:**
```
https://seudominio.com/api/webhook/kirvano
```

### **Eventos:**
- ✅ Pagamento aprovado
- ⏳ Pagamento pendente
- ❌ Pagamento cancelado

### **Formato dos Dados:**
```json
{
  "email": "{{customer_email}}",
  "status": "{{payment_status}}"
}
```

## ✅ **PRONTO!**

Agora o sistema funciona assim:

1. **Cliente compra** na Kirvano
2. **Kirvano envia webhook** com email + status
3. **Webhook salva** no Supabase (approved/pending)
4. **Cliente acessa** o PWA
5. **PWA verifica** se status = "approved"
6. **Se aprovado** → Acesso liberado! 🎉

## 🔧 **ARQUIVOS IMPORTANTES**

- `database-users.sql` - Script da tabela
- `api/webhook/kirvano.js` - Endpoint do webhook
- `src/lib/supabase.js` - Funções de verificação
- `src/pages/LoginPage/LoginPage.jsx` - Interface de login

## 📞 **SUPORTE**

Se algo não funcionar:
1. Verificar logs do webhook
2. Verificar se usuário foi salvo no Supabase
3. Verificar se PWA está consultando corretamente
4. Testar com emails de exemplo

**Sistema simples, funcional e confiável!** 🚀
