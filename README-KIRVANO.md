# 🚀 Integração com a API da Kirvano - BrincaFácil

Este projeto implementa uma integração completa com a API da Kirvano para liberar acesso ao PWA BrincaFácil baseado em compras realizadas na plataforma.

## ✨ Funcionalidades Implementadas

### 🔐 Verificação Automática de Acesso
- **Verificação em Tempo Real**: O sistema verifica automaticamente o status da compra quando o usuário digita o email
- **Cache Inteligente**: Informações de acesso são armazenadas localmente por 24 horas para melhor performance
- **Fallback Seguro**: Se a Kirvano não estiver configurada, o sistema usa a tabela de emails autorizados

### 📡 Webhook de Notificações
- **Recebimento Automático**: Processa notificações de compras concluídas da Kirvano
- **Validação de Segurança**: Verifica assinatura dos webhooks para garantir autenticidade
- **Atualização Instantânea**: Atualiza automaticamente o status de acesso do usuário

### 🎨 Interface Intuitiva
- **Feedback Visual**: Indicadores coloridos mostram se o email tem acesso
- **Verificação em Tempo Real**: Status é verificado enquanto o usuário digita
- **Redirecionamento Inteligente**: Botão para loja quando não há acesso

## 🛠️ Configuração Rápida

### 1. Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```bash
# Configurações da API da Kirvano
VITE_KIRVANO_API_URL=https://api.kirvano.com
VITE_KIRVANO_API_KEY=sua_chave_api_da_kirvano
VITE_KIRVANO_WEBHOOK_SECRET=seu_secret_do_webhook
VITE_KIRVANO_PRODUCT_ID=brincafacil-premium
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Executar em Modo de Desenvolvimento
```bash
npm run dev
```

### 4. Executar Servidor com API
```bash
npm run server
```

## 🧪 Testando a Integração

### Emails de Demonstração
Para testar sem configurar a Kirvano, use estes emails:
- `demo@brincafacil.com` ✅
- `teste@exemplo.com` ✅  
- `admin@brincafacil.com` ✅
- `mateus@kirvano.com` ✅

### Endpoints de Teste
```bash
# Verificar configuração
GET /api/kirvano/config

# Testar webhook
GET /api/webhooks/kirvano/test

# Verificar status de um email
GET /api/kirvano/status/email@exemplo.com

# Simular webhook de compra
POST /api/kirvano/simulate-webhook
{
  "email": "usuario@exemplo.com",
  "product_id": "brincafacil-premium"
}
```

## 📱 Como Funciona

### 1. Usuário Digita Email
- Sistema aguarda 1 segundo após parar de digitar
- Inicia verificação automática na API da Kirvano

### 2. Verificação de Acesso
- Primeiro verifica cache local (24h)
- Se não encontrar, consulta API da Kirvano
- Atualiza interface com resultado

### 3. Processamento de Login
- **Se tem acesso**: ✅ Botão verde, permite login
- **Se não tem**: ❌ Botão cinza, mostra opção de compra

### 4. Webhook de Compra
- Recebe notificação da Kirvano
- Valida assinatura de segurança
- Atualiza status de acesso
- Notifica sistema de autenticação

## 🔧 Estrutura do Código

```
src/
├── lib/
│   ├── kirvano.js          # Cliente da API da Kirvano
│   └── supabase.js         # Integração com autenticação
├── api/
│   └── webhooks/
│       └── kirvano.js      # Endpoints de webhook
├── components/
│   └── PurchaseStatus/     # Componente de status da compra
└── pages/
    ├── LoginPage/          # Página de login integrada
    └── ProfilePage/        # Página de perfil com status
```

## 🚨 Tratamento de Erros

### Erros de API
- Timeout de 10 segundos para requisições
- Retry automático em caso de falha
- Fallback para dados locais quando possível

### Erros de Webhook
- Validação de assinatura obrigatória
- Log detalhado de todos os eventos
- Resposta apropriada para cada tipo de erro

### Erros de Interface
- Feedback visual claro para o usuário
- Mensagens de erro específicas
- Opções de recuperação quando possível

## 🔐 Segurança

### Validação de Webhooks
- Todos os webhooks são validados através de assinatura
- Assinatura é verificada usando o secret configurado
- Webhooks sem assinatura válida são rejeitados

### Dados Sensíveis
- Chaves da API não são expostas no frontend
- Informações de compra são armazenadas localmente de forma segura
- Comunicação com a API usa HTTPS

## 📊 Monitoramento

### Logs Importantes
- Verificação de compras
- Processamento de webhooks
- Erros de API
- Acessos concedidos/negados

### Métricas
- Tempo de resposta da API
- Taxa de sucesso de webhooks
- Usuários com acesso ativo
- Conversão de compras para acesso

## 🚀 Deploy

### 1. Build do Projeto
```bash
npm run build
```

### 2. Configurar Servidor
```bash
npm run start
```

### 3. Configurar Webhook na Kirvano
- URL: `https://seudominio.com/api/webhooks/kirvano`
- Eventos: `purchase.completed`, `purchase.activated`
- Assinatura: Usar o secret configurado

## 🔮 Melhorias Futuras

### Funcionalidades Planejadas
- Dashboard administrativo para gerenciar acessos
- Relatórios de conversão
- Integração com múltiplos produtos
- Sistema de assinaturas recorrentes

### Otimizações
- Cache distribuído (Redis)
- Verificação em lote de emails
- Webhooks em tempo real (WebSockets)
- Backup automático de dados de acesso

## 📞 Suporte

### Em Caso de Problemas
1. Verificar logs do sistema
2. Confirmar configuração das variáveis de ambiente
3. Testar conectividade com a API da Kirvano
4. Verificar assinatura dos webhooks

### Comandos Úteis
```bash
# Verificar status do servidor
curl http://localhost:3000/api/kirvano/config

# Testar webhook
curl http://localhost:3000/api/webhooks/kirvano/test

# Simular compra
curl -X POST http://localhost:3000/api/kirvano/simulate-webhook \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com","product_id":"brincafacil-premium"}'
```

---

**Status**: ✅ Implementado e Testado  
**Versão**: 1.0.0  
**Última atualização**: Dezembro 2024  
**Compatibilidade**: Node.js 16+, React 18+

