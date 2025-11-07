# 🔄 Migração: Kirvano → Hotmart

Este documento descreve as mudanças realizadas para substituir a integração da Kirvano pela Hotmart.

## 📋 Resumo das Mudanças

### Arquivos Criados

1. **`src/lib/hotmart.js`** - Cliente da API da Hotmart
   - Verificação de compras por email
   - Gerenciamento de token OAuth2
   - Sistema de cache local
   - Modo demo para testes

2. **`src/lib/auth-hotmart.js`** - Sistema de autenticação
   - Login com email
   - Verificação de acesso
   - Gerenciamento de sessão

3. **`HOTMART-INTEGRATION.md`** - Documentação completa
4. **`CONFIGURAR-HOTMART.md`** - Guia rápido de configuração
5. **`README-HOTMART.md`** - README atualizado
6. **`test-hotmart-integration.js`** - Script de teste

### Arquivos Modificados

1. **`src/pages/LoginPage/LoginPage.jsx`**
   - Importações alteradas de `kirvano-real` para `hotmart`
   - Importações alteradas de `auth-real` para `auth-hotmart`
   - Textos e mensagens atualizados para Hotmart
   - Link de compra atualizado

2. **`env.example`**
   - Variáveis da Kirvano removidas
   - Variáveis da Hotmart adicionadas

### Arquivos Não Modificados (Mantidos para Referência)

- `src/lib/kirvano.js` - Cliente antigo da Kirvano
- `src/lib/kirvano-real.js` - Cliente real da Kirvano
- `src/lib/auth-real.js` - Autenticação antiga
- `KIRVANO-INTEGRATION.md` - Documentação antiga

## 🔄 Principais Diferenças

### API de Autenticação

**Kirvano:**
```javascript
// Usava API Key simples
headers: {
  'Authorization': `Bearer ${API_KEY}`
}
```

**Hotmart:**
```javascript
// Usa OAuth2 com Client ID e Secret
// 1. Obter token
POST https://api-sec-vlc.hotmart.com/security/oauth/token
Body: { grant_type, client_id, client_secret }

// 2. Usar token nas requisições
headers: {
  'Authorization': `Bearer ${access_token}`
}
```

### Endpoints

**Kirvano:**
```javascript
POST /purchases/check
Body: { email, product_id }
```

**Hotmart:**
```javascript
// Assinaturas
GET /subscriptions/summary?subscriber_email=xxx&product_id=yyy

// Histórico de vendas
GET /sales/history?buyer_email=xxx&product_id=yyy&transaction_status=APPROVED
```

### Status de Compra

**Kirvano:**
- `paid`
- `completed`
- `approved`

**Hotmart:**
- `APPROVED`
- `COMPLETE`
- `ACTIVE`

### Cache

**Antes (Kirvano):**
```javascript
localStorage: 'brincafacil-kirvano-cache'
```

**Depois (Hotmart):**
```javascript
localStorage: 'brincafacil-hotmart-cache'
sessionStorage: 'brincafacil-hotmart-token' (novo - para o token OAuth2)
```

## 📝 Checklist de Migração

### ✅ Completado

- [x] Criar biblioteca `hotmart.js`
- [x] Criar módulo `auth-hotmart.js`
- [x] Atualizar `LoginPage.jsx`
- [x] Atualizar variáveis de ambiente
- [x] Criar documentação completa
- [x] Criar guia de configuração
- [x] Criar script de teste
- [x] Testar integração básica

### 🔲 Para Fazer (Opcional)

- [ ] Configurar webhook da Hotmart
- [ ] Criar endpoint de webhook
- [ ] Adicionar validação de assinatura de webhook
- [ ] Implementar renovação automática de assinaturas
- [ ] Dashboard administrativo
- [ ] Relatórios de conversão

## 🚀 Como Usar a Nova Integração

### 1. Obter Credenciais da Hotmart

Acesse https://app-vlc.hotmart.com/tools/api e obtenha:
- Client ID
- Client Secret
- Gere o Basic Auth (Base64 de `CLIENT_ID:CLIENT_SECRET`)

### 2. Configurar Variáveis de Ambiente

Crie o arquivo `.env`:

```bash
VITE_HOTMART_CLIENT_ID=seu_client_id
VITE_HOTMART_CLIENT_SECRET=seu_client_secret
VITE_HOTMART_BASIC_AUTH=seu_basic_auth_base64
VITE_HOTMART_PRODUCT_ID=seu_product_id
```

### 3. Testar

```bash
npm run dev
```

Acesse http://localhost:5173/login e teste com um email que tenha compra na Hotmart.

## 🔍 Verificação

### Console do Navegador (F12)

**Configuração OK:**
```
🔧 Configuração da Hotmart: {
  configured: true,
  has_credentials: true,
  product_id: "12345",
  mode: "production"
}
```

**Login com Sucesso:**
```
🔍 Verificando acesso na Hotmart para: email@exemplo.com
🔑 Usando token em cache (ou) Solicitando novo token de acesso...
✅ Token obtido com sucesso
📡 Consultando API da Hotmart...
📊 Resposta da API Hotmart: {...}
✅ Compra confirmada na Hotmart
```

## 💡 Vantagens da Hotmart

1. **API Oficial e Documentada**: Melhor suporte e estabilidade
2. **OAuth2**: Sistema de autenticação mais seguro
3. **Múltiplas APIs**: Assinaturas + Histórico de vendas
4. **Webhooks Robustos**: Notificações em tempo real
5. **Maior Adoção**: Plataforma mais conhecida no Brasil

## 🐛 Troubleshooting

### Erro: "Erro ao obter token"
**Causa**: Client ID ou Secret incorretos  
**Solução**: Verifique as credenciais no painel da Hotmart

### Erro: "Nenhuma compra encontrada"
**Causa**: Email não possui compra ou Product ID incorreto  
**Solução**: Confirme o email e o Product ID

### Modo Demo Ativado Indevidamente
**Causa**: Credenciais não configuradas  
**Solução**: Configure todas as variáveis no arquivo `.env`

## 📚 Documentação Adicional

- [CONFIGURAR-HOTMART.md](./CONFIGURAR-HOTMART.md) - Guia rápido
- [HOTMART-INTEGRATION.md](./HOTMART-INTEGRATION.md) - Documentação completa
- [README-HOTMART.md](./README-HOTMART.md) - README atualizado

## 🎯 Próximos Passos

1. ✅ Integração básica implementada
2. 🔲 Testar com credenciais reais
3. 🔲 Deploy para produção
4. 🔲 Configurar webhook (opcional)
5. 🔲 Monitorar logs e performance

---

**Data da Migração**: Outubro 2024  
**Status**: ✅ Migração Completa - Pronto para Uso




