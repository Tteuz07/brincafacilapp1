# 🎮 BrincaFácil - Integração com Hotmart

Sistema de autenticação e verificação de compras através da API da Hotmart.

## 🚀 Início Rápido

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Hotmart

Crie um arquivo `.env` na raiz do projeto:

```bash
# Copie o arquivo de exemplo
cp env.example .env
```

Edite o arquivo `.env` e configure suas credenciais da Hotmart:

```bash
VITE_HOTMART_CLIENT_ID=seu_client_id_aqui
VITE_HOTMART_CLIENT_SECRET=seu_client_secret_aqui
VITE_HOTMART_BASIC_AUTH=seu_basic_auth_base64_aqui
VITE_HOTMART_PRODUCT_ID=seu_product_id_aqui
```

**Como obter as credenciais?** Veja o guia: [CONFIGURAR-HOTMART.md](./CONFIGURAR-HOTMART.md)

### 3. Executar o Projeto

```bash
# Modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

### 4. Testar a Integração

```bash
# Executar teste de integração
node test-hotmart-integration.js
```

Abra http://localhost:5173/login e teste com:
- Email com compra na Hotmart
- Ou emails de demonstração (modo demo)

## 📚 Documentação

- **[CONFIGURAR-HOTMART.md](./CONFIGURAR-HOTMART.md)** - Guia rápido de configuração
- **[HOTMART-INTEGRATION.md](./HOTMART-INTEGRATION.md)** - Documentação completa da integração
- **[API-DOCUMENTATION.md](./API-DOCUMENTATION.md)** - Documentação da API

## 🔧 Arquivos Principais

```
src/
├── lib/
│   ├── hotmart.js          # Cliente da API da Hotmart
│   └── auth-hotmart.js     # Sistema de autenticação
└── pages/
    └── LoginPage/
        └── LoginPage.jsx   # Página de login
```

## 🧪 Modo Demo

Quando as credenciais não estão configuradas, o sistema funciona em modo de demonstração.

**Emails de teste:**
- `demo@brincafacil.com`
- `teste@exemplo.com`
- `admin@brincafacil.com`
- `ericvalani@gmail.com`

## ✨ Funcionalidades

✅ Verificação automática de compras na Hotmart  
✅ Cache local de 24 horas  
✅ Token OAuth2 gerenciado automaticamente  
✅ Interface com feedback visual em tempo real  
✅ Modo demo para testes  
✅ Suporte a assinaturas e vendas únicas  

## 🔐 Segurança

- Tokens OAuth2 gerenciados automaticamente
- Cache local com expiração
- Validação de webhooks (opcional)
- Credenciais protegidas em variáveis de ambiente

## 📊 Status de Compra

| Status | Permite Acesso |
|--------|----------------|
| APPROVED | ✅ Sim |
| COMPLETE | ✅ Sim |
| ACTIVE | ✅ Sim |
| PENDING | ❌ Não |
| CANCELLED | ❌ Não |
| REFUNDED | ❌ Não |

## 🐛 Solução de Problemas

### "Hotmart Não Configurada"
→ Configure as credenciais no arquivo `.env`

### "Erro ao obter token"
→ Verifique se Client ID, Secret e Basic Auth estão corretos

### "Nenhuma compra encontrada"
→ Confirme se o email e Product ID estão corretos

## 📞 Suporte

- **Documentação Hotmart:** https://developers.hotmart.com/docs/pt-BR/
- **Painel Hotmart:** https://app-vlc.hotmart.com/
- **Suporte Hotmart:** https://atendimento.hotmart.com/

## 🎯 Próximos Passos

1. Configure suas credenciais da Hotmart
2. Teste a integração
3. Deploy para produção
4. Configure webhook (opcional)

---

**Desenvolvido com ❤️ para o BrincaFácil**




