// =====================================================
// CÓDIGO ATUALIZADO: Funções de Favoritos
// =====================================================
// Substitua as funções addToFavorites e removeFromFavorites no useAppStore.js
// Localização aproximada: linha ~3536

// =====================================================
// 1. addToFavorites (ATUALIZADO)
// =====================================================

addToFavorites: async (type, itemId) => {
  console.log('⭐ ADICIONANDO FAVORITO:', { type, itemId })
  
  try {
    // Recarregar favoritos para garantir dados atualizados
    await get().loadFavorites()
    const currentFavorites = get().favorites || []
    
    // Verificar se já não está nos favoritos
    const alreadyExists = currentFavorites.some(fav => 
      fav.type === type && fav.itemId === itemId
    )
    
    if (alreadyExists) {
      console.log('⚠️ FAVORITO JÁ EXISTE')
      return { data: null, error: 'Já está nos favoritos' }
    }
    
    const newFavorite = {
      id: `fav-${Date.now()}-${Math.random()}`,
      type: type,
      itemId: itemId,
      addedAt: new Date().toISOString()
    }
    
    const updatedFavorites = [...currentFavorites, newFavorite]
    
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
        console.log('✅ Favorito salvo no Supabase')
      }
    } catch (error) {
      console.warn('⚠️ Erro ao salvar favorito no Supabase (continuando com localStorage):', error)
    }
    
    // Manter localStorage como fallback
    localStorage.setItem('brincafacil-favorites', JSON.stringify(updatedFavorites))
    
    set({ favorites: updatedFavorites })
    console.log('✅ FAVORITO ADICIONADO COM SUCESSO')
    console.log('📊 TOTAL DE FAVORITOS AGORA:', updatedFavorites.length)
    
    return { data: newFavorite, error: null }
  } catch (error) {
    console.error('Erro ao adicionar favorito:', error)
    return { data: null, error }
  }
},

// =====================================================
// 2. removeFromFavorites (ATUALIZADO)
// =====================================================

removeFromFavorites: async (type, itemId) => {
  console.log('🗑️ REMOVENDO FAVORITO:', { type, itemId })
  
  try {
    // Recarregar favoritos para garantir dados atualizados
    await get().loadFavorites()
    const currentFavorites = get().favorites || []
    
    const updatedFavorites = currentFavorites.filter(fav => 
      !(fav.type === type && fav.itemId === itemId)
    )
    
    // ✅ NOVO: Remover do Supabase também
    try {
      const { supabase } = await import('../lib/supabaseClient')
      const { data: { user } } = await supabase.auth.getUser()
      const userEmail = user?.email
      
      if (userEmail) {
        const { removerFavorito } = await import('../lib/storageService')
        await removerFavorito(userEmail, type === 'activity' ? 'brincadeira' : 'desenho', String(itemId))
        console.log('✅ Favorito removido do Supabase')
      }
    } catch (error) {
      console.warn('⚠️ Erro ao remover favorito do Supabase (continuando com localStorage):', error)
    }
    
    // Manter localStorage como fallback
    localStorage.setItem('brincafacil-favorites', JSON.stringify(updatedFavorites))
    
    set({ favorites: updatedFavorites })
    console.log('✅ FAVORITO REMOVIDO COM SUCESSO')
    console.log('📊 TOTAL DE FAVORITOS AGORA:', updatedFavorites.length)
    
    return { data: null, error: null }
  } catch (error) {
    console.error('Erro ao remover favorito:', error)
    return { data: null, error }
  }
},


