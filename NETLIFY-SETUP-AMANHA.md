# 🌐 NETLIFY SETUP - PARA AMANHÃ

## 🎯 **OBJETIVO:**
Migrar o webhook do ngrok para Netlify Functions (URL permanente)

## 📋 **CHECKLIST PARA AMANHÃ:**

### **1. CRIAR CONTA NETLIFY:**
- [ ] Acessar https://app.netlify.com/signup
- [ ] Conectar com GitHub
- [ ] Verificar conta gratuita

### **2. PREPARAR ESTRUTURA:**
- [ ] Criar pasta `netlify/functions/`
- [ ] Criar `netlify/functions/kirvano-webhook.js`
- [ ] Configurar `netlify.toml`

### **3. ADAPTAR CÓDIGO:**
- [ ] Converter para formato Netlify Functions
- [ ] Manter validação de token
- [ ] Manter criação de usuário no Supabase

### **4. FAZER DEPLOY:**
- [ ] Conectar repositório
- [ ] Deploy automático
- [ ] Testar webhook

### **5. CONFIGURAR KIRVANO:**
- [ ] Atualizar URL do webhook
- [ ] Manter token `brincafacil01`
- [ ] Testar compra real

## 📁 **ARQUIVOS A CRIAR:**
```
netlify/
  functions/
    kirvano-webhook.js
netlify.toml
```

## 🔧 **CÓDIGO BASE:**
```javascript
// netlify/functions/kirvano-webhook.js
exports.handler = async (event, context) => {
  // Código do webhook aqui
}
```

## 🎉 **RESULTADO ESPERADO:**
- URL permanente: `https://seu-app.netlify.app/.netlify/functions/kirvano-webhook`
- Webhook funcionando 24/7
- Sem necessidade de ngrok

## 📞 **SUPORTE:**
- Arquivo: `WEBHOOK-SETUP-COMPLETO.md`
- Código funcionando: `api/kirvano-webhook-test.js`
- Testes: `test-ngrok.ps1`


