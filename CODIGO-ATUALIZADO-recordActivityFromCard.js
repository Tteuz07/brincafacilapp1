// =====================================================
// CÓDIGO ATUALIZADO: recordActivityFromCard
// =====================================================
// Substitua a função recordActivityFromCard no useAppStore.js
// Localização aproximada: linha ~304

recordActivityFromCard: async (activityId, area, activityData) => {
  const current = get().childDevelopment
  const now = new Date().toISOString()
  const activities = get().activities
  const activity = activities.find(a => a.id === activityId)
  
  // Calcular pontos baseados na avaliação da criança
  let points = 10 // Base
  
  // Bônus por nota alta
  if (activityData.rating >= 4) points += 5
  if (activityData.rating === 5) points += 5
  
  // Bônus por comentário/descrição longa
  if ((activityData.comment || activityData.description || '').length > 20) points += 3
  
  // Bônus por foto
  if (activityData.photo) points += 2
  
  // Bônus por duração (brincar mais tempo = mais pontos)
  if (activityData.duration >= 30) points += 2
  if (activityData.duration >= 60) points += 3
  
  // Bônus por dificuldade (atividades difíceis valem mais)
  if (activityData.difficulty === 'hard') points += 3
  else if (activityData.difficulty === 'medium') points += 1
  
  // Bônus por diversão (se achou muito legal)
  if (activityData.funLevel === 'fun') points += 2
  
  const finalPoints = points
  
  // Atualizar progresso da área específica
  const areaData = current[area]
  if (areaData) {
    areaData.progress = Math.min(100, areaData.progress + finalPoints)
    areaData.activities.push({
      id: `activity_${Date.now()}`,
      name: activityData.name,
      description: activityData.description,
      rating: activityData.rating,
      photo: activityData.photo,
      duration: activityData.duration,
      difficulty: activityData.difficulty,
      funLevel: activityData.funLevel,
      points: finalPoints,
      date: now,
      completed: true,
      area: area,
      activityId: activityId
    })
    areaData.lastUpdated = now
  }
  
  // Atualizar pontos totais e nível
  const newTotalPoints = current.totalPoints + finalPoints
  const newLevel = Math.floor(newTotalPoints / 100) + 1
  
  // Atualizar meta semanal
  let newCompletedThisWeek = current.completedThisWeek + 1
  let newWeeklyGoal = current.weeklyGoal
  
  // Se a meta foi completada, gerar uma nova meta progressiva
  if (newCompletedThisWeek >= current.weeklyGoal) {
    if (current.weeklyGoal <= 5) {
      newWeeklyGoal = 7
    } else if (current.weeklyGoal <= 7) {
      newWeeklyGoal = 10
    } else if (current.weeklyGoal <= 10) {
      newWeeklyGoal = 12
    } else if (current.weeklyGoal <= 12) {
      newWeeklyGoal = 15
    } else if (current.weeklyGoal <= 15) {
      newWeeklyGoal = 18
    } else if (current.weeklyGoal <= 18) {
      newWeeklyGoal = 20
    } else if (current.weeklyGoal <= 20) {
      newWeeklyGoal = 25
    } else {
      newWeeklyGoal = current.weeklyGoal + 5
    }
    
    newCompletedThisWeek = 0
    
    console.log('🎯 NOVA META GERADA!', {
      metaAnterior: current.weeklyGoal,
      novaMeta: newWeeklyGoal,
      completado: current.completedThisWeek
    })
  }
  
  // Atualizar sequência atual
  const newCurrentStreak = current.currentStreak + 1
  
  const updated = {
    ...current,
    [area]: areaData,
    totalPoints: newTotalPoints,
    level: newLevel,
    completedThisWeek: newCompletedThisWeek,
    weeklyGoal: newWeeklyGoal,
    currentStreak: newCurrentStreak
  }
  
  set({ childDevelopment: updated })
  
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
        data: activityData.date || now
      })
      console.log('✅ Atividade salva no Supabase')
    }
  } catch (error) {
    console.warn('⚠️ Erro ao salvar atividade no Supabase (continuando com localStorage):', error)
  }
  
  // Manter salvamento no localStorage como fallback
  localStorage.setItem('brincafacil-child-development', JSON.stringify(updated))
  
  return {
    updated,
    points: finalPoints,
    area: area,
    newLevel: newLevel,
    newGoal: newWeeklyGoal !== current.weeklyGoal ? newWeeklyGoal : null
  }
},

