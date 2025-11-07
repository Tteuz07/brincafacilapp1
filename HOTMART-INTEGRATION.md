# Integração com a API da Hotmart

Este documento descreve como configurar e usar a integração com a API da Hotmart para liberar acesso ao PWA BrincaFácil baseado em compras.

## 🚀 Visão Geral

A integração permite que usuários que fizeram compras na plataforma Hotmart tenham acesso automático ao PWA, sem necessidade de cadastro manual ou aprovação.

## ⚙️ Configuração

### 1. Obter Credenciais da Hotmart

1. Acesse o painel da Hotmart: https://app-vlc.hotmart.com/
2. Navegue até **Ferramentas > API**
3. Crie ou obtenha suas credenciais:
   - **Client ID**: Sua chave de identificação
   - **Client Secret**: Sua chave secreta
4. Para gerar o **Basic Auth**:
   ```bash
   echo -n "SEU_CLIENT_ID:SEU_CLIENT_SECRET" | base64
   ```
   Ou use uma ferramenta online: https://www.base64encode.org/

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```bash
# Hotmart - Configuração para consulta direta
VITE_HOTMART_API_URL=https://developers.hotmart.com/payments/api/v1
VITE_HOTMART_CLIENT_ID=seu_client_id_aqui
VITE_HOTMART_CLIENT_SECRET=seu_client_secret_aqui
VITE_HOTMART_BASIC_AUTH=base64_do_client_id_e_secret
VITE_HOTMART_PRODUCT_ID=brincafacil-premium

# Token da Hotmart para webhook (opcional)
HOTMART_WEBHOOK_SECRET=brincafacil01
```

### 3. Obter o Product ID

1. No painel da Hotmart, vá até **Produtos**
2. Selecione o produto BrincaFácil
3. Copie o **ID do Produto** (geralmente um número)
4. Cole no campo `VITE_HOTMART_PRODUCT_ID`

## 🔧 Funcionalidades

### Verificação de Acesso

- **Verificação em Tempo Real**: O sistema verifica automaticamente o status da compra quando o usuário digita o email
- **Cache Local**: Informações de acesso são armazenadas localmente por 24 horas para melhor performance
- **Token de Autenticação**: Sistema gerencia automaticamente o token OAuth2 da Hotmart

### APIs Utilizadas

#### 1. API de Assinaturas
```
GET https://developers.hotmart.com/payments/api/v1/subscriptions/summary
```
Verifica assinaturas ativas por email.

#### 2. API de Histórico de Vendas
```
GET https://developers.hotmart.com/payments/api/v1/sales/history
```
Verifica histórico de compras aprovadas.

### Webhook de Notificações (Opcional)

Se você quiser receber notificações automáticas de compras:

1. Configure o webhook no painel da Hotmart
2. URL do webhook: `https://seudominio.com/api/webhooks/hotmart`
3. Eventos a escutar:
   - `PURCHASE_APPROVED` - Compra aprovada
   - `PURCHASE_COMPLETE` - Compra completa
   - `SUBSCRIPTION_ACTIVATED` - Assinatura ativada

## 📱 Interface do Usuário

### Página de Login

- **Verificação Automática**: Status da compra é verificado em tempo real
- **Indicadores Visuais**: 
  - 🔵 Spinner azul durante verificação
  - ✅ Verde quando acesso confirmado
  - ❌ Vermelho quando acesso negado
- **Feedback Imediato**: Usuário sabe instantaneamente se pode acessar
- **Botão de Compra**: Redireciona para a página de checkout da Hotmart

### Estados da Interface

1. **Verificando**: Spinner azul durante consulta à API
2. **Acesso Confirmado**: ✅ Verde com detalhes da compra
3. **Acesso Negado**: ❌ Vermelho com botão para comprar
4. **Botão Desabilitado**: Cinza quando não há acesso

## 🧪 Modo de Demonstração

Quando a Hotmart não está configurada, o sistema funciona em modo de demonstração:

### Emails de Teste
- `demo@brincafacil.com`
- `teste@exemplo.com`
- `admin@brincafacil.com`
- `ericvalani@gmail.com`

### Comportamento
- Simula verificação de compras
- Permite acesso para emails de teste
- Mostra dados simulados de compra

## 🔄 Fluxo de Funcionamento

### 1. Usuário Digita Email
- Sistema aguarda 1 segundo após parar de digitar
- Inicia verificação automática

### 2. Verificação de Acesso
- **Passo 1**: Verifica cache local (24h)
- **Passo 2**: Se não encontrar, obtém token OAuth2 da Hotmart
- **Passo 3**: Consulta API de assinaturas
- **Passo 4**: Se não encontrar, consulta histórico de vendas
- **Passo 5**: Atualiza interface com resultado

### 3. Processamento de Login
- Se tem acesso: permite login e salva sessão
- Se não tem: bloqueia acesso e mostra opção de compra

### 4. Webhook de Compra (Opcional)
- Recebe notificação da Hotmart
- Valida assinatura (se configurada)
- Atualiza cache local
- Notifica sistema de autenticação

## 🛠️ Estrutura de Arquivos

```
src/
├── lib/
│   ├── hotmart.js           # Cliente da API da Hotmart
│   └── auth-hotmart.js      # Sistema de autenticação
└── pages/
    └── LoginPage/
        └── LoginPage.jsx    # Interface de login
```

### Funções Principais

#### hotmart.js
- `checkPurchaseAccess(email)` - Verifica se email tem compra
- `getAccessToken()` - Obtém token OAuth2 da Hotmart
- `queryHotmartAPI(email)` - Consulta APIs da Hotmart
- `saveLocalPurchaseAccess(email, result)` - Salva no cache
- `clearLocalPurchaseAccess(email)` - Limpa cache
- `checkHotmartConfig()` - Verifica configuração

#### auth-hotmart.js
- `getUserStatus(email)` - Obtém status do usuário
- `signInWithEmail(email)` - Faz login com email
- `checkUserAccess(email)` - Verifica se tem acesso
- `getSession()` - Obtém sessão atual
- `signOut()` - Faz logout

## 🚨 Tratamento de Erros

### Erros de API
- Timeout de 10 segundos para requisições
- Fallback para cache local em caso de falha
- Modo demo se credenciais não configuradas

### Erros de Token
- Token é renovado automaticamente quando expira
- Cache do token em sessionStorage
- Renovação 1 minuto antes da expiração

### Erros de Interface
- Feedback visual claro para o usuário
- Mensagens de erro específicas
- Opções de recuperação quando possível

## 📊 Status de Compra

A API da Hotmart retorna diferentes status:

| Status | Descrição | Permite Acesso? |
|--------|-----------|-----------------|
| `APPROVED` | Compra aprovada | ✅ Sim |
| `COMPLETE` | Compra completa | ✅ Sim |
| `ACTIVE` | Assinatura ativa | ✅ Sim |
| `PENDING` | Aguardando pagamento | ❌ Não |
| `CANCELLED` | Cancelada | ❌ Não |
| `REFUNDED` | Reembolsada | ❌ Não |

## 🔐 Segurança

### Autenticação OAuth2
- Tokens são gerenciados de forma segura
- Renovação automática de tokens expirados
- Credenciais nunca expostas no frontend (exceto Basic Auth em Base64)

### Cache Local
- Dados armazenados por apenas 24 horas
- Revalidação periódica com a API
- Limpeza automática de cache expirado

### Webhooks
- Validação de assinatura (HMAC SHA256)
- Verificação de origem da requisição
- Proteção contra replay attacks

## 📞 Suporte

### Problemas Comuns

#### 1. "Hotmart Não Configurada"
**Solução**: Verifique se todas as variáveis de ambiente estão corretas no arquivo `.env`

#### 2. "Erro ao obter token"
**Solução**: 
- Verifique se o Client ID e Secret estão corretos
- Certifique-se de que o Basic Auth está em Base64 correto
- Verifique se as credenciais têm permissão para acessar a API

#### 3. "Nenhuma compra encontrada"
**Solução**:
- Verifique se o email usado é o mesmo da compra
- Confirme se o Product ID está correto
- Aguarde alguns minutos após a compra para sincronização

### Links Úteis
- Documentação da Hotmart: https://developers.hotmart.com/docs/pt-BR/
- Painel da Hotmart: https://app-vlc.hotmart.com/
- Suporte da Hotmart: https://atendimento.hotmart.com/

## 🔮 Melhorias Futuras

### Funcionalidades Planejadas
- Dashboard administrativo para gerenciar acessos
- Relatórios de conversão
- Integração com múltiplos produtos
- Sistema de assinaturas recorrentes com renovação
- Notificações push para compras

### Otimizações
- Cache distribuído (Redis)
- Verificação em lote de emails
- Webhooks em tempo real (WebSockets)
- Backup automático de dados de acesso

---

**Última atualização**: Outubro 2024  
**Versão**: 1.0.0  
**Status**: ✅ Implementado e Pronto para Uso




