# 📦 Storage Service - Migração do LocalStorage para Supabase

## ✅ O que foi criado

Sistema completo para substituir o LocalStorage por Supabase, mantendo todos os dados sincronizados na nuvem.

### Arquivos Criados:

1. **`src/lib/storageService.js`** - Serviço principal com todas as funções
2. **`create-storage-tables.sql`** - Script para criar as tabelas no banco
3. **`create-storage-rpc-functions.sql`** - Script para criar funções RPC seguras

## 🚀 Como Implementar

### PASSO 1: Criar Tabelas no Supabase

1. Acesse o **Supabase Dashboard**
2. Vá em **SQL Editor**
3. Execute o arquivo `create-storage-tables.sql`
4. Verifique se as 3 tabelas foram criadas:
   - `atividades_historico`
   - `perfis_criancas`
   - `favoritos`

### PASSO 2: Criar Funções RPC

1. No mesmo **SQL Editor**
2. Execute o arquivo `create-storage-rpc-functions.sql`
3. Verifique se as 2 funções foram criadas:
   - `buscar_historico`
   - `buscar_perfil`

### PASSO 3: Integrar no App

O arquivo `storageService.js` já está criado. Agora você precisa:

1. **Importar o serviço** onde necessário:
```javascript
import storageService from '../lib/storageService';
```

2. **Substituir chamadas ao LocalStorage** por chamadas ao serviço:
```javascript
// ANTES (LocalStorage)
localStorage.setItem('brincafacil_perfil', JSON.stringify(perfil));

// DEPOIS (Supabase)
await storageService.salvarPerfil(emailUsuario, perfil);
```

3. **Chamar migração no primeiro login**:
```javascript
import { migrarLocalStorage } from '../lib/storageService';

// No componente de login ou Gate
const resultado = await migrarLocalStorage(emailUsuario);
if (resultado.success) {
  console.log('✅ Dados migrados:', resultado.migrados);
}
```

## 📋 Tabelas Criadas

### 1. `atividades_historico`
Armazena histórico de atividades realizadas:
- `email_usuario` - Email do usuário
- `atividade_id` - ID da atividade
- `atividade_nome` - Nome da atividade
- `avaliacao` - Nota de 1 a 5
- `comentario` - Comentário opcional
- `foto_base64` - Foto em base64 (⚠️ cuidado com tamanho)
- `duracao_minutos` - Duração da atividade
- `dificuldade_sentida` - Dificuldade sentida
- `nivel_diversao` - Nível de diversão
- `data_realizacao` - Data/hora da realização

### 2. `perfis_criancas`
Armazena perfil completo da criança:
- `email_usuario` - PRIMARY KEY (email do usuário)
- `nome_crianca` - Nome da criança
- `idade` - Idade (2-12 anos)
- `avatar` - Emoji do avatar
- `interesses` - Array de interesses
- `espaco_disponivel` - Array de espaços
- `companhia` - Array de companhias
- `pontos_cognitivo` - Pontos cognitivos
- `pontos_motor` - Pontos motores
- `pontos_social` - Pontos sociais
- `pontos_emocional` - Pontos emocionais
- `nivel` - Nível atual
- `meta_semanal` - Meta semanal de atividades
- `dias_consecutivos` - Dias consecutivos
- `ultima_atividade_data` - Data da última atividade

### 3. `favoritos`
Armazena favoritos do usuário:
- `email_usuario` - Email do usuário
- `tipo` - 'brincadeira' ou 'desenho'
- `item_id` - ID do item
- `item_nome` - Nome do item
- `created_at` - Data de criação

## 🔐 Segurança (RLS)

Todas as tabelas têm **Row Level Security** habilitado:
- Usuários só veem seus próprios dados
- Usuários só podem criar/atualizar seus próprios dados
- Baseado em `auth.email()` do Supabase Auth

## 📝 Funções Disponíveis

### Histórico de Atividades
```javascript
// Salvar atividade
await storageService.salvarAtividade(email, dadosAtividade);

// Buscar histórico
const { data } = await storageService.buscarHistorico(email, 50);

// Buscar última atividade
const { data } = await storageService.buscarUltimaAtividade(email);
```

### Perfil da Criança
```javascript
// Salvar/atualizar perfil
await storageService.salvarPerfil(email, dadosPerfil);

// Buscar perfil
const { data } = await storageService.buscarPerfil(email);

// Atualizar pontos
await storageService.atualizarPontos(email, 'cognitivo', 10);
```

### Favoritos
```javascript
// Adicionar favorito
await storageService.adicionarFavorito(email, 'brincadeira', id, nome);

// Remover favorito
await storageService.removerFavorito(email, 'brincadeira', id);

// Buscar favoritos
const { data } = await storageService.buscarFavoritos(email, 'brincadeira');

// Verificar se é favorito
const { isFavorito } = await storageService.isFavorito(email, 'brincadeira', id);
```

### Migração
```javascript
// Migrar dados do LocalStorage (executar uma vez)
await storageService.migrarLocalStorage(email);
```

## ⚠️ Importante

1. **Fotos em Base64**: O campo `foto_base64` pode ficar muito grande. Considere usar **Supabase Storage** para armazenar imagens.

2. **Migração Automática**: A função `migrarLocalStorage` verifica se já migrou antes de executar novamente.

3. **Email como Identificador**: O sistema usa `email_usuario` em vez de `user_id` para compatibilidade com o sistema atual.

4. **RLS Baseado em Email**: As políticas RLS usam `auth.email()` para garantir que cada usuário só acesse seus dados.

## 🧪 Testes

Após criar as tabelas e funções, teste:

```sql
-- Teste buscar histórico
SELECT * FROM buscar_historico('seu-email@exemplo.com', 10);

-- Teste buscar perfil
SELECT * FROM buscar_perfil('seu-email@exemplo.com');
```

## 📊 Benefícios

1. **Sincronização**: Dados sincronizados entre dispositivos
2. **Backup Automático**: Dados seguros na nuvem
3. **Segurança**: RLS garante privacidade
4. **Escalabilidade**: Suporta muitos usuários
5. **Histórico Completo**: Todas as atividades ficam registradas

## 🔄 Próximos Passos

1. Integrar `storageService.js` no código existente
2. Substituir chamadas ao LocalStorage
3. Testar migração de dados existentes
4. Considerar usar Supabase Storage para fotos grandes


