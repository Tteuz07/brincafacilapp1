# 🔄 Integração do Storage Service

## 📋 O que precisa ser atualizado

Este guia mostra exatamente onde e como integrar o `storageService.js` no código existente.

## 1. ✅ Arquivo Criado

- `src/lib/storageService.js` - **JÁ CRIADO** ✅

## 2. 🔧 Atualizações Necessárias

### A. Atualizar `useAppStore.js` - Função `recordActivityFromCard`

**Localização:** Linha ~304

**ANTES:**
```javascript
recordActivityFromCard: (activityId, area, activityData) => {
  // ... código atual que salva apenas no localStorage
  localStorage.setItem('brincafacil-child-development', JSON.stringify(updated))
}
```

**DEPOIS:**
```javascript
recordActivityFromCard: async (activityId, area, activityData) => {
  // ... código existente de cálculo de pontos ...
  
  // ✅ NOVO: Salvar no Supabase também
  try {
    const { supabase } = await import('../lib/supabaseClient')
    const { data: { user } } = await supabase.auth.getUser()
    const userEmail = user?.email
    
    if (userEmail) {
      const { salvarAtividade } = await import('../lib/storageService')
      await salvarAtividade(userEmail, {
        id: String(activityId),
        nome: activityData.name || activity?.title || 'Atividade',
        avaliacao: activityData.rating,
        comentario: activityData.comment || activityData.description || null,
        foto: activityData.photo || null,
        duracao: activityData.duration,
        dificuldade: activityData.difficulty,
        diversao: activityData.funLevel,
        data: activityData.date || new Date().toISOString()
      })
    }
  } catch (error) {
    console.warn('⚠️ Erro ao salvar atividade no Supabase (continuando com localStorage):', error)
  }
  
  // Manter salvamento no localStorage como fallback
  localStorage.setItem('brincafacil-child-development', JSON.stringify(updated))
  
  return { updated, points: finalPoints, area, newLevel, newGoal }
}
```

### B. Atualizar `useAppStore.js` - Função `updateChild`

**Localização:** Linha ~570

**ANTES:**
```javascript
updateChild: async (childData) => {
  // ... salva apenas no localStorage
  localStorage.setItem('brincafacil-child', JSON.stringify(childWithId))
}
```

**DEPOIS:**
```javascript
updateChild: async (childData) => {
  // ... código existente ...
  
  // ✅ NOVO: Salvar no Supabase também
  try {
    if (userEmail) {
      const { salvarPerfil } = await import('../lib/storageService')
      await salvarPerfil(userEmail, {
        nome: childData.name,
        idade: childData.age,
        avatar: childData.avatar || '👶',
        interesses: childData.interests || [],
        espaco: childData.space ? [childData.space] : [],
        companhia: childData.companionship ? [childData.companionship] : [],
        pontos_cognitivo: childData.pontos_cognitivo || 0,
        pontos_motor: childData.pontos_motor || 0,
        pontos_social: childData.pontos_social || 0,
        pontos_emocional: childData.pontos_emocional || 0,
        nivel: childData.nivel || 1,
        meta_semanal: childData.meta_semanal || 5,
        dias_consecutivos: childData.dias_consecutivos || 0,
        ultima_atividade_data: childData.ultima_atividade_data || null
      })
    }
  } catch (error) {
    console.warn('⚠️ Erro ao salvar perfil no Supabase (continuando com localStorage):', error)
  }
  
  // Manter localStorage como fallback
  localStorage.setItem('brincafacil-child', JSON.stringify(childWithId))
  
  return { data: childWithId, error: null }
}
```

### C. Atualizar `useAppStore.js` - Funções de Favoritos

**Localização:** Linha ~3536

**ANTES:**
```javascript
addToFavorites: async (type, itemId) => {
  // ... salva apenas no localStorage
  localStorage.setItem('brincafacil-favorites', JSON.stringify(updatedFavorites))
}
```

**DEPOIS:**
```javascript
addToFavorites: async (type, itemId) => {
  // ... código existente ...
  
  // ✅ NOVO: Salvar no Supabase também
  try {
    const { supabase } = await import('../lib/supabaseClient')
    const { data: { user } } = await supabase.auth.getUser()
    const userEmail = user?.email
    
    if (userEmail) {
      const { adicionarFavorito } = await import('../lib/storageService')
      const { activities, cartoons } = get()
      
      // Buscar nome do item
      let itemNome = 'Item'
      if (type === 'activity') {
        const activity = activities.find(a => a.id === itemId)
        itemNome = activity?.title || 'Brincadeira'
      } else if (type === 'cartoon') {
        const cartoon = cartoons.find(c => c.id === itemId)
        itemNome = cartoon?.title || 'Desenho'
      }
      
      await adicionarFavorito(userEmail, type === 'activity' ? 'brincadeira' : 'desenho', String(itemId), itemNome)
    }
  } catch (error) {
    console.warn('⚠️ Erro ao salvar favorito no Supabase (continuando com localStorage):', error)
  }
  
  // Manter localStorage como fallback
  localStorage.setItem('brincafacil-favorites', JSON.stringify(updatedFavorites))
  
  return { data: newFavorite, error: null }
}
```

**Para `removeFromFavorites`:**

```javascript
removeFromFavorites: async (type, itemId) => {
  // ... código existente ...
  
  // ✅ NOVO: Remover do Supabase também
  try {
    const { supabase } = await import('../lib/supabaseClient')
    const { data: { user } } = await supabase.auth.getUser()
    const userEmail = user?.email
    
    if (userEmail) {
      const { removerFavorito } = await import('../lib/storageService')
      await removerFavorito(userEmail, type === 'activity' ? 'brincadeira' : 'desenho', String(itemId))
    }
  } catch (error) {
    console.warn('⚠️ Erro ao remover favorito do Supabase (continuando com localStorage):', error)
  }
  
  // Manter localStorage como fallback
  localStorage.setItem('brincafacil-favorites', JSON.stringify(updatedFavorites))
  
  return { data: null, error: null }
}
```

### D. Adicionar Migração no `Gate.jsx`

**Localização:** Após verificação de licença válida (linha ~68)

**ADICIONAR:**
```javascript
// ✅ NOVO: Migrar dados do LocalStorage para Supabase (uma vez)
try {
  const { migrarLocalStorage } = await import('../lib/storageService')
  const resultado = await migrarLocalStorage(email)
  if (resultado.success && resultado.migrados) {
    console.log('✅ Dados migrados:', resultado.migrados)
  }
} catch (error) {
  console.warn('⚠️ Erro na migração (não crítico):', error)
}
```

## 3. 📝 Resumo das Mudanças

### Arquivos a Modificar:

1. **`src/store/useAppStore.js`**
   - `recordActivityFromCard` - adicionar salvamento no Supabase
   - `updateChild` - adicionar salvamento no Supabase
   - `addToFavorites` - adicionar salvamento no Supabase
   - `removeFromFavorites` - adicionar remoção no Supabase

2. **`src/pages/Gate.jsx`**
   - Adicionar chamada de migração após login

### Estratégia Híbrida:

- **Salvar em ambos**: LocalStorage (fallback) + Supabase (principal)
- **Carregar do Supabase primeiro**, depois do LocalStorage se necessário
- **Migração automática** no primeiro login após update

## 4. ⚠️ Importante

- O código mantém **compatibilidade** com LocalStorage como fallback
- Se Supabase falhar, o app continua funcionando com LocalStorage
- A migração só executa **uma vez** por usuário
- Todos os dados são **sincronizados** na nuvem

## 5. 🧪 Testes

Após implementar:

1. Faça login no app
2. Registre uma atividade
3. Verifique no Supabase se foi salva na tabela `atividades_historico`
4. Adicione um favorito
5. Verifique se foi salvo na tabela `favoritos`
6. Atualize o perfil da criança
7. Verifique se foi salvo na tabela `perfis_criancas`

