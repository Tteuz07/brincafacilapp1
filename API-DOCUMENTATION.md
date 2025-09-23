# 📚 Documentação da API - BrincaFácil App

## 🚀 Visão Geral

A API do BrincaFácil App fornece endpoints completos para gerenciamento de usuários, crianças, atividades e analytics de desenvolvimento infantil.

**Base URL:** `http://localhost:3000/api`

## 🔐 Autenticação

A API utiliza autenticação baseada em email com verificação de acesso via Kirvano ou lista de emails autorizados.

## 📋 Endpoints Disponíveis

### 👥 Usuários

#### `POST /api/users`
Criar ou atualizar perfil do usuário.

**Body:**
```json
{
  "email": "usuario@exemplo.com",
  "name": "Nome do Usuário",
  "phone": "+5511999999999",
  "access_type": "authorized",
  "purchase_data": {
    "purchase_id": "123",
    "amount": 29.90
  }
}
```

#### `GET /api/users/email/:email`
Buscar usuário por email.

#### `PUT /api/users/:id`
Atualizar dados do usuário.

#### `GET /api/users/stats`
Estatísticas gerais de usuários.

### 👶 Crianças

#### `POST /api/children`
Criar perfil de criança.

**Body:**
```json
{
  "user_id": "uuid-do-usuario",
  "name": "Nome da Criança",
  "birth_date": "2020-01-01",
  "gender": "male",
  "avatar_url": "https://exemplo.com/avatar.jpg"
}
```

#### `GET /api/children/user/:userId`
Listar crianças de um usuário.

#### `GET /api/children/:id`
Buscar criança por ID.

#### `PUT /api/children/:id`
Atualizar dados da criança.

### 🎯 Atividades

#### `GET /api/activities`
Listar atividades com filtros.

**Query Parameters:**
- `category`: motor, cognitive, social, language
- `age`: idade da criança
- `difficulty`: nível de dificuldade (1-5)
- `duration`: duração máxima em minutos
- `limit`: número de resultados
- `page`: página para paginação

#### `GET /api/activities/:id`
Buscar atividade por ID.

#### `POST /api/activities/record`
Registrar atividade realizada.

**Body:**
```json
{
  "child_id": "uuid-da-crianca",
  "activity_id": "uuid-da-atividade",
  "duration_minutes": 15,
  "rating": 4,
  "notes": "A criança gostou muito!",
  "parent_notes": "Fácil de fazer",
  "difficulty_felt": 2,
  "enjoyment_level": 5
}
```

#### `GET /api/activities/child/:childId`
Listar atividades realizadas por uma criança.

#### `POST /api/activities/favorites`
Adicionar atividade aos favoritos.

**Body:**
```json
{
  "child_id": "uuid-da-crianca",
  "activity_id": "uuid-da-atividade"
}
```

#### `DELETE /api/activities/favorites`
Remover atividade dos favoritos.

#### `GET /api/activities/favorites/:childId`
Listar atividades favoritas de uma criança.

#### `GET /api/activities/stats/:childId`
Estatísticas de atividades de uma criança.

**Query Parameters:**
- `period`: período em dias (padrão: 30)

#### `GET /api/activities/recommended/:childId`
Atividades recomendadas para uma criança.

**Query Parameters:**
- `limit`: número de recomendações (padrão: 10)

### 📊 Analytics

#### `POST /api/analytics/report/:childId`
Gerar relatório de desenvolvimento.

**Body:**
```json
{
  "reportDate": "2024-01-01"
}
```

#### `GET /api/analytics/reports/:childId`
Listar relatórios de uma criança.

#### `GET /api/analytics/stats`
Estatísticas gerais do app.

#### `GET /api/analytics/usage`
Estatísticas de uso por período.

**Query Parameters:**
- `startDate`: data de início (YYYY-MM-DD)
- `endDate`: data de fim (YYYY-MM-DD)

### 🔗 Webhooks

#### `POST /api/webhooks/kirvano`
Webhook para receber notificações da Kirvano.

#### `GET /api/webhooks/kirvano/test`
Testar webhook da Kirvano.

#### `GET /api/webhooks/kirvano/check`
Verificar status de um email.

### 🧪 Testes

#### `GET /api/kirvano/status/:email`
Verificar status de acesso de um email.

#### `POST /api/kirvano/simulate-webhook`
Simular webhook da Kirvano.

**Body:**
```json
{
  "email": "teste@exemplo.com",
  "product_id": "brincafacil-premium",
  "purchase_id": "sim-123",
  "amount": 29.90
}
```

## 📊 Estrutura de Respostas

### Sucesso
```json
{
  "success": true,
  "data": { ... }
}
```

### Erro
```json
{
  "success": false,
  "error": "Mensagem de erro"
}
```

## 🗄️ Banco de Dados

### Tabelas Principais

- **users**: Perfis de usuários/pais
- **children**: Perfis das crianças
- **activities**: Atividades disponíveis
- **child_activities**: Atividades realizadas
- **favorites**: Atividades favoritas
- **development_reports**: Relatórios de desenvolvimento
- **purchases**: Compras realizadas
- **cartoons**: Desenhos disponíveis

### Configuração

Execute o arquivo `database-schema.sql` no Supabase para criar todas as tabelas necessárias.

## 🔧 Configuração

### Variáveis de Ambiente

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
VITE_KIRVANO_API_URL=https://api.kirvano.com
VITE_KIRVANO_API_KEY=sua_chave_da_kirvano
VITE_KIRVANO_WEBHOOK_SECRET=seu_webhook_secret
VITE_KIRVANO_PRODUCT_ID=brincafacil-premium
```

## 🚀 Como Usar

1. **Configure o Supabase** com o schema fornecido
2. **Configure as variáveis de ambiente**
3. **Inicie o servidor**: `npm run server`
4. **Teste os endpoints** usando as rotas listadas acima

## 📝 Exemplos de Uso

### Criar usuário e criança
```bash
# 1. Criar usuário
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com","name":"João Silva","phone":"+5511999999999"}'

# 2. Criar criança
curl -X POST http://localhost:3000/api/children \
  -H "Content-Type: application/json" \
  -d '{"user_id":"uuid-do-usuario","name":"Maria Silva","birth_date":"2020-01-01","gender":"female"}'
```

### Registrar atividade
```bash
curl -X POST http://localhost:3000/api/activities/record \
  -H "Content-Type: application/json" \
  -d '{"child_id":"uuid-da-crianca","activity_id":"uuid-da-atividade","rating":4,"duration_minutes":15}'
```

### Gerar relatório
```bash
curl -X POST http://localhost:3000/api/analytics/report/uuid-da-crianca \
  -H "Content-Type: application/json" \
  -d '{"reportDate":"2024-01-01"}'
```

## 🛠️ Desenvolvimento

Para desenvolvimento local:

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Iniciar servidor de produção
npm run server
```

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação do Supabase ou entre em contato com a equipe de desenvolvimento.





