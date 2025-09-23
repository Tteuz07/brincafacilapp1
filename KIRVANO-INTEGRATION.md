# Integração com a API da Kirvano

Este documento descreve como configurar e usar a integração com a API da Kirvano para liberar acesso ao PWA BrincaFácil baseado em compras.

## 🚀 Visão Geral

A integração permite que usuários que fizeram compras na plataforma Kirvano tenham acesso automático ao PWA, sem necessidade de cadastro manual ou aprovação.

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```bash
# Configurações da API da Kirvano
VITE_KIRVANO_API_URL=https://api.kirvano.com
VITE_KIRVANO_API_KEY=sua_chave_api_da_kirvano
VITE_KIRVANO_WEBHOOK_SECRET=seu_secret_do_webhook
VITE_KIRVANO_PRODUCT_ID=brincafacil-premium
```

### 2. Configuração no Painel da Kirvano

1. Acesse o painel administrativo da Kirvano
2. Configure o webhook para o endpoint: `https://seudominio.com/api/webhooks/kirvano`
3. Configure o produto com ID: `brincafacil-premium`
4. Ative as notificações para eventos de compra

## 🔧 Funcionalidades

### Verificação de Acesso

- **Verificação em Tempo Real**: O sistema verifica automaticamente o status da compra quando o usuário digita o email
- **Cache Local**: Informações de acesso são armazenadas localmente por 24 horas para melhor performance
- **Fallback para Supabase**: Se a Kirvano não estiver configurada, o sistema usa a tabela de emails autorizados

### Webhook de Notificações

- **Recebimento Automático**: Processa notificações de compras concluídas
- **Validação de Segurança**: Verifica assinatura dos webhooks para segurança
- **Atualização de Status**: Atualiza automaticamente o status de acesso do usuário

## 📡 Endpoints da API

### 1. Webhook Principal
```
POST /api/webhooks/kirvano
```
Recebe notificações de compras da Kirvano.

### 2. Verificação de Status
```
GET /api/webhooks/kirvano/check?email=exemplo@email.com
```
Verifica o status de acesso de um email específico.

### 3. Teste do Webhook
```
GET /api/webhooks/kirvano/test
```
Testa o funcionamento do webhook (desenvolvimento).

### 4. Listagem de Acessos
```
GET /api/webhooks/kirvano/list
```
Lista todos os usuários com acesso ativo (desenvolvimento).

## 🔐 Segurança

### Validação de Webhooks

- Todos os webhooks são validados através de assinatura
- Assinatura é verificada usando o secret configurado
- Webhooks sem assinatura válida são rejeitados

### Dados Sensíveis

- Chaves da API não são expostas no frontend
- Informações de compra são armazenadas localmente de forma segura
- Comunicação com a API usa HTTPS

## 📱 Interface do Usuário

### Página de Login

- **Verificação Automática**: Status da compra é verificado em tempo real
- **Indicadores Visuais**: Ícones mostram se o email tem acesso
- **Feedback Imediato**: Usuário sabe instantaneamente se pode acessar
- **Redirecionamento para Loja**: Botão para comprar se não tiver acesso

### Estados da Interface

1. **Verificando**: Spinner azul durante verificação
2. **Acesso Confirmado**: ✅ Verde com detalhes da compra
3. **Acesso Negado**: ❌ Vermelho com opção de ir para loja
4. **Botão Desabilitado**: Cinza quando não há acesso

## 🧪 Modo de Demonstração

Quando a Kirvano não está configurada, o sistema funciona em modo de demonstração:

### Emails de Teste
- `demo@brincafacil.com`
- `teste@exemplo.com`
- `admin@brincafacil.com`
- `mateus@kirvano.com`

### Comportamento
- Simula verificação de compras
- Permite acesso para emails de teste
- Mostra dados simulados de compra

## 🔄 Fluxo de Funcionamento

### 1. Usuário Digita Email
- Sistema aguarda 1 segundo após parar de digitar
- Inicia verificação automática

### 2. Verificação de Acesso
- Primeiro verifica cache local (24h)
- Se não encontrar, consulta API da Kirvano
- Atualiza interface com resultado

### 3. Processamento de Login
- Se tem acesso: permite login
- Se não tem: bloqueia acesso e mostra opção de compra

### 4. Webhook de Compra
- Recebe notificação da Kirvano
- Valida assinatura
- Atualiza status de acesso
- Notifica sistema de autenticação

## 🛠️ Desenvolvimento

### Estrutura de Arquivos

```
src/
├── lib/
│   ├── kirvano.js          # Cliente da API da Kirvano
│   └── supabase.js         # Integração com autenticação
├── api/
│   └── webhooks/
│       └── kirvano.js      # Endpoints de webhook
└── pages/
    └── LoginPage/
        └── LoginPage.jsx   # Interface de login integrada
```

### Funções Principais

- `kirvanoClient.checkPurchaseStatus(email)` - Verifica status de compra
- `checkPurchaseAccess(email)` - Verifica e gerencia acesso
- `processPurchaseWebhook(data)` - Processa webhooks
- `validateWebhook(payload, signature)` - Valida assinaturas

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

### Contatos
- Desenvolvedor: [Seu Nome]
- Kirvano: [Suporte da Kirvano]
- Documentação: [Link para docs da Kirvano]

---

**Última atualização**: Dezembro 2024
**Versão**: 1.0.0
**Status**: ✅ Implementado e Testado

