// =====================================================
// CÓDIGO ATUALIZADO: updateChild
// =====================================================
// Substitua a função updateChild no useAppStore.js
// Localização aproximada: linha ~570

updateChild: async (childData) => {
  console.log('💾 Salvando perfil da criança', childData)
  
  // Tentar obter email da sessão do Supabase se disponível
  let userEmail = null
  try {
    const { supabase } = await import('../lib/supabaseClient')
    const { data: { user } } = await supabase.auth.getUser()
    userEmail = user?.email
  } catch (e) {
    console.warn('Não foi possível obter email do Supabase:', e)
  }
  
  const childWithId = { 
    ...childData, 
    id: childData.id || 'child-' + Date.now(),
    user_email: userEmail,
    created_at: childData.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  set({ child: childWithId })
  console.log('✅ Perfil da criança salvo no store:', childWithId)
  
  // ✅ NOVO: Salvar no Supabase também
  try {
    if (userEmail) {
      const { salvarPerfil } = await import('../lib/storageService')
      const childDevelopment = get().childDevelopment || {}
      
      await salvarPerfil(userEmail, {
        nome: childData.name,
        idade: childData.age,
        avatar: childData.avatar || '👶',
        interesses: childData.interests || [],
        espaco: childData.space ? [childData.space] : [],
        companhia: childData.companionship ? [childData.companionship] : [],
        pontos_cognitivo: childDevelopment.cognitive?.progress || 0,
        pontos_motor: childDevelopment.motor?.progress || 0,
        pontos_social: childDevelopment.social?.progress || 0,
        pontos_emocional: childDevelopment.emotional?.progress || 0,
        nivel: childDevelopment.level || 1,
        meta_semanal: childDevelopment.weeklyGoal || 5,
        dias_consecutivos: childDevelopment.currentStreak || 0,
        ultima_atividade_data: childDevelopment.cognitive?.lastUpdated || null
      })
      console.log('✅ Perfil salvo no Supabase')
    }
  } catch (error) {
    console.warn('⚠️ Erro ao salvar perfil no Supabase (continuando com localStorage):', error)
  }
  
  // Manter localStorage como fallback
  localStorage.setItem('brincafacil-child', JSON.stringify(childWithId))
  console.log('✅ Perfil da criança salvo no localStorage')
  
  return { data: childWithId, error: null }
},


