import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'

const useAppStore = create(
  persist(
    (set, get) => ({
      // Estado de autenticação
      user: null,
      isAuthenticated: false,
      isLoading: true,

      // Estado da criança/perfil
      child: null,
      childDevelopment: {
        // Dados de desenvolvimento da criança
        cognitive: { progress: 0, activities: [], lastUpdated: null },
        motor: { progress: 0, activities: [], lastUpdated: null },
        social: { progress: 0, activities: [], lastUpdated: null },
        emotional: { progress: 0, activities: [], lastUpdated: null },
        
        // Hábitos e metas
        habits: {
          reading: { streak: 0, goal: 30, lastActivity: null },
          exercise: { streak: 0, goal: 7, lastActivity: null },
          creativity: { hours: 0, goal: 25, lastActivity: null },
          sleep: { streak: 0, goal: 7, lastActivity: null }
        },
        
        // Conquistas
        achievements: [],
        
        // Estatísticas gerais
        totalPoints: 0,
        level: 1,
        weeklyGoal: 5,
        completedThisWeek: 0,
        currentStreak: 0
      },
      
      // Brincadeiras e dados
      activities: [],
      favorites: [],
      cartoons: [],
      
      // Cache offline
      cachedData: {
        activities: [],
        cartoons: [],
        lastUpdated: null
      },

      // Actions de autenticação
      setUser: (user) => {
        console.log('👤 SETUSER CHAMADO:', {
          user: !!user,
          userEmail: user?.email,
          userID: user?.id,
          willBeAuthenticated: !!user
        })
        set({ user, isAuthenticated: !!user })
      },
      
      setLoading: (isLoading) => set({ isLoading }),
      
      logout: async () => {
        // Limpar localStorage
        localStorage.removeItem('brincafacil-user')
        localStorage.removeItem('brincafacil-child')
        
        // Limpar estado
        set({ 
          user: null, 
          isAuthenticated: false,
          child: null,
          favorites: []
        })
        
        // Disparar evento de logout
        window.dispatchEvent(new CustomEvent('brincafacil-auth-change', {
          detail: { user: null, child: null }
        }))
      },

      // Actions do perfil da criança
      setChild: (childData) => {
        console.log('👶 SETCHILD CHAMADO:', {
          child: !!childData,
          childName: childData?.name,
          childAge: childData?.age,
          childID: childData?.id
        })
        set({ child: childData })
      },
      
      // Actions de desenvolvimento da criança
      updateChildDevelopment: (developmentData) => {
        const current = get().childDevelopment
        const updated = { ...current, ...developmentData }
        set({ childDevelopment: updated })
        
        // Salvar no localStorage para persistência
        localStorage.setItem('brincafacil-child-development', JSON.stringify(updated))
      },
      
      // Registrar atividade de desenvolvimento
      recordDevelopmentActivity: (area, activity, points = 10) => {
        const current = get().childDevelopment
        const now = new Date().toISOString()
        
        // Atualizar progresso da área
        const areaData = current[area]
        if (areaData) {
          areaData.progress = Math.min(100, areaData.progress + points)
          areaData.activities.push({
            name: activity,
            points,
            date: now
          })
          areaData.lastUpdated = now
        }
        
        // Atualizar pontos totais e nível
        const newTotalPoints = current.totalPoints + points
        const newLevel = Math.floor(newTotalPoints / 100) + 1
        
        // Atualizar meta semanal
        const newCompletedThisWeek = current.completedThisWeek + 1
        
        // Atualizar sequência atual
        const newCurrentStreak = current.currentStreak + 1
        
        const updated = {
          ...current,
          [area]: areaData,
          totalPoints: newTotalPoints,
          level: newLevel,
          completedThisWeek: newCompletedThisWeek,
          currentStreak: newCurrentStreak
        }
        
        set({ childDevelopment: updated })
        
        // Salvar no localStorage
        localStorage.setItem('brincafacil-child-development', JSON.stringify(updated))
        
        return updated
      },

      // Registrar atividade detalhada com foto e avaliação
      recordDetailedActivity: (area, activityData) => {
        const current = get().childDevelopment
        const now = new Date().toISOString()
        
        // Atualizar progresso da área
        const areaData = current[area]
        if (areaData) {
          areaData.progress = Math.min(100, areaData.progress + activityData.points)
          areaData.activities.push({
            id: `activity_${Date.now()}`,
            name: activityData.name,
            description: activityData.description,
            rating: activityData.rating,
            photo: activityData.photo,
            duration: activityData.duration,
            difficulty: activityData.difficulty,
            funLevel: activityData.funLevel,
            points: activityData.points,
            date: now,
            completed: true,
            area: area // Adicionar área para referência
          })
          areaData.lastUpdated = now
        }
        
        // Atualizar pontos totais e nível
        const newTotalPoints = current.totalPoints + activityData.points
        const newLevel = Math.floor(newTotalPoints / 100) + 1
        
        // Atualizar meta semanal
        const newCompletedThisWeek = current.completedThisWeek + 1
        
        // Atualizar sequência atual
        const newCurrentStreak = current.currentStreak + 1
        
        const updated = {
          ...current,
          [area]: areaData,
          totalPoints: newTotalPoints,
          level: newLevel,
          completedThisWeek: newCompletedThisWeek,
          currentStreak: newCurrentStreak
        }
        
        set({ childDevelopment: updated })
        
        // Salvar no localStorage
        localStorage.setItem('brincafacil-child-development', JSON.stringify(updated))
        
        return updated
      },

      // Registrar atividade de brincadeira específica
      recordActivityFromCard: (activityId, area, activityData) => {
        const current = get().childDevelopment
        const now = new Date().toISOString()
        
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
            activityId: activityId // Referência à brincadeira original
          })
          areaData.lastUpdated = now
        }
        
        // Atualizar pontos totais e nível
        const newTotalPoints = current.totalPoints + finalPoints
        const newLevel = Math.floor(newTotalPoints / 100) + 1
        
        // Atualizar meta semanal
        const newCompletedThisWeek = current.completedThisWeek + 1
        
        // Atualizar sequência atual
        const newCurrentStreak = current.currentStreak + 1
        
        const updated = {
          ...current,
          [area]: areaData,
          totalPoints: newTotalPoints,
          level: newLevel,
          completedThisWeek: newCompletedThisWeek,
          currentStreak: newCurrentStreak
        }
        
        set({ childDevelopment: updated })
        
        // Salvar no localStorage
        localStorage.setItem('brincafacil-child-development', JSON.stringify(updated))
        
        return {
          updated,
          points: finalPoints,
          area: area,
          newLevel: newLevel
        }
      },
      
      // Registrar hábito diário
      recordDailyHabit: (habitType, value = 1) => {
        const current = get().childDevelopment
        const now = new Date().toISOString()
        const today = new Date().toDateString()
        
        const habit = current.habits[habitType]
        if (habit) {
          // Verificar se já foi registrado hoje
          const lastActivity = habit.lastActivity ? new Date(habit.lastActivity).toDateString() : null
          
          if (lastActivity !== today) {
            // Novo dia - incrementar sequência
            habit.streak += value
            habit.lastActivity = now
            
            // Para hábitos específicos, ajustar valores
            if (habitType === 'creativity') {
              habit.hours += value
            }
            
            // Verificar se atingiu a meta
            if (habit.streak >= habit.goal) {
              // Desbloquear conquista
              const achievement = {
                id: `${habitType}_goal_${Date.now()}`,
                type: habitType,
                title: `Meta de ${habitType === 'reading' ? 'Leitura' : habitType === 'exercise' ? 'Exercício' : habitType === 'creativity' ? 'Criatividade' : 'Sono'} Atingida!`,
                description: `Parabéns por atingir sua meta de ${habit.goal}!`,
                unlocked: true,
                points: 50,
                date: now
              }
              
              current.achievements.push(achievement)
            }
          }
        }
        
        set({ childDevelopment: current })
        localStorage.setItem('brincafacil-child-development', JSON.stringify(current))
        
        return current
      },
      
      // Carregar dados de desenvolvimento salvos
      loadChildDevelopment: () => {
        try {
          const saved = localStorage.getItem('brincafacil-child-development')
          if (saved) {
            const parsed = JSON.parse(saved)
            set({ childDevelopment: parsed })
            return parsed
          }
        } catch (error) {
          console.error('Erro ao carregar dados de desenvolvimento:', error)
        }
        return null
      },
      
      // Resetar dados semanais (chamado no início da semana)
      resetWeeklyData: () => {
        const current = get().childDevelopment
        const updated = {
          ...current,
          completedThisWeek: 0,
          weeklyGoal: 5
        }
        
        set({ childDevelopment: updated })
        localStorage.setItem('brincafacil-child-development', JSON.stringify(updated))
        
        return updated
      },
      
      updateChild: async (childData) => {
        const { user } = get()
        if (!user) return { error: 'Usuário não autenticado' }
        
        if (!supabase) {
          // Salvar localmente
          console.warn('Supabase não configurado - salvando localmente')
          const childWithId = { 
            ...childData, 
            id: 'child-' + Date.now(),
            user_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          set({ child: childWithId })
          return { data: childWithId, error: null }
        }
        
        try {
          const { data, error } = await supabase
            .from('children_profiles')
            .upsert({
              user_id: user.id,
              ...childData,
              updated_at: new Date().toISOString()
            })
            .select()
            .single()
          
          if (error) throw error
          
          set({ child: data })
          return { data, error: null }
        } catch (error) {
          console.error('Erro ao atualizar perfil da criança:', error)
          return { data: null, error }
        }
      },

      // Actions de brincadeiras
      setActivities: (activities) => set({ activities }),
      
      loadActivities: async () => {
        if (!supabase) {
          // LIMPEZA AGRESSIVA DO CACHE
          localStorage.clear()
          console.log('🧹 CACHE LIMPO COMPLETAMENTE')
          
          // Forçar atualização do estado
          console.log('🔄 FORÇANDO ATUALIZAÇÃO DAS ATIVIDADES')
          
          
          // Atividades disponíveis
          const demoActivities = [
            {
              id: 1,
              title: 'Pega Peixinhos',
              description: 'Uma brincadeira divertida onde as crianças usam uma vara com bola para pescar peixinhos de papel. Desenvolve coordenação motora, noção espacial e paciência.',
              instructions: [
                'Faça um círculo no chão com fita adesiva ou giz',
                'Corte vários peixinhos de papel colorido e coloque dentro do círculo',
                'Prepare varas com fita adesiva e uma bola pequena na ponta',
                'Cada criança deve usar sua vara para "pescar" os peixinhos',
                'Coloque os peixes pescados em baldes ou caixas correspondentes às cores',
                'Quem conseguir encher seu balde com peixes da sua cor primeiro, ganha!'
              ],
              materials: [
                'Papel colorido (várias cores)',
                'Tesoura',
                'Fita adesiva ou giz para fazer o círculo',
                'Cabos ou varinhas (podem ser de vassoura ou galhos)',
                'Bolas pequenas (ping pong ou similar)',
                'Barbante ou fita',
                'Baldes ou caixas pequenas para cada cor'
              ],
              categories: ['coordenação', 'competição', 'social', 'motor'],
              duration: 20,
              participants: '2-4',
              difficulty: 'medium',
              min_age: 4,
              max_age: 10,
              rating: 4.8,
              safety_tips: [
                'Supervisione o uso das varas para evitar acidentes',
                'Certifique-se de que o espaço esteja livre de obstáculos',
                'Use bolas leves para evitar machucados',
                'Mantenha as crianças organizadas em turnos se necessário'
              ],
              variations: [
                'Versão individual: uma criança tenta pescar todos os peixes em um tempo determinado',
                'Versão cooperativa: todas as crianças trabalham juntas para pescar todos os peixes',
                'Versão com pontuação: peixes de cores diferentes valem pontos diferentes',
                'Versão temática: use formas diferentes (estrelas, corações, etc.)'
              ],
              image_url: '/Brincadeiras/pegapeixinhos.png',
              video_url: 'https://www.youtube.com/watch?v=rbB9fKQXbdY&list=PLEALKINltswSwzAJWtaIv1vzqs2r1t4z6',
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 2,
              title: 'Espelho dos Desenhos',
              description: 'Um desafio de memória visual onde as crianças devem reproduzir um padrão de desenhos observado rapidamente. Desenvolve memória visual, concentração e capacidade de observação.',
              instructions: [
                'Posicione uma cadeira na frente e um quadro ou parede atrás',
                'Desenhe uma grade 3x3 em papel e coloque desenhos diferentes em cada quadrado',
                'Cole este papel na cadeira (modelo de referência)',
                'Desenhe uma grade 3x3 vazia no quadro da parede',
                'A primeira criança olha rapidamente para o modelo na cadeira (máximo 10 segundos)',
                'Depois vai até o quadro e tenta reproduzir os desenhos nos lugares corretos',
                'A segunda criança faz o mesmo processo',
                'Quem conseguir reproduzir mais desenhos corretos nos lugares certos vence!'
              ],
              materials: [
                'Uma cadeira',
                'Quadro, lousa ou parede lisa',
                'Papel sulfite ou cartolina',
                'Lápis ou canetinhas coloridas',
                'Fita adesiva ou ímãs para fixar',
                'Cronômetro ou relógio',
                'Borracha (para correções no quadro)'
              ],
              categories: ['memória', 'observação', 'competição', 'cognitivo'],
              duration: 15,
              participants: '2',
              difficulty: 'hard',
              min_age: 7,
              max_age: 12,
              rating: 4.7,
              safety_tips: [
                'Certifique-se de que a cadeira esteja estável',
                'Mantenha o espaço entre cadeira e quadro livre de obstáculos',
                'Use materiais de desenho seguros e não tóxicos',
                'Supervise o tempo de observação para manter a competição justa'
              ],
              variations: [
                'Versão cooperativa: trabalham juntas para completar o desenho',
                'Versão com níveis: comece com 2x2 e aumente para 4x4',
                'Versão temática: use apenas formas geométricas ou apenas animais',
                'Versão com tempo: complete o maior número de quadrados em 2 minutos',
                'Versão com cores: adicione a cor correta de cada desenho como desafio extra'
              ],
              image_url: '/Brincadeiras/espelhodosdesenhos.png',
              video_url: 'https://youtube.com/shorts/y9ipm-HYo3c?feature=share',
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 3,
              title: 'Torre das Vogais',
              description: 'Brincadeira educativa com rolos e tampinhas coloridas para aprender as vogais de forma divertida e desenvolver coordenação motora',
              image_url: '/Brincadeiras/torresdasvogais.png',
              video_url: 'https://youtube.com/shorts/TegpRnP0dKc?feature=share',
              instructions: [
                'Envolva cada rolo com papel adesivo de cor diferente',
                'Escreva uma vogal grande em cada rolo: A (vermelho), E (azul), I (amarelo), O (verde), U (roxo)',
                'Prepare 3 tampinhas para cada vogal com as mesmas cores',
                'Misture todas as tampinhas na mesa',
                'Peça para a criança colocar cada tampinha no rolo da vogal correspondente',
                'Celebre quando todas as vogais estiverem nos lugares certos!'
              ],
              materials: [
                '5 rolos de papel higiênico vazios (apenas o papelão)',
                '15 tampas de garrafas coloridas',
                'Papel adesivo colorido (5 cores diferentes)',
                'Marcadores ou canetas permanentes',
                'Tesoura (para adultos)',
                'Mesa ou superfície plana'
              ],
              categories: ['educativo', 'alfabetização', 'coordenação', 'cognitivo'],
              duration: 20,
              participants: '1-2',
              difficulty: 'easy',
              min_age: 3,
              max_age: 6,
              rating: 4.8,
              safety_tips: [
                'Supervisione o uso da tesoura por adultos apenas',
                'Certifique-se de que as tampinhas são grandes o suficiente',
                'Use materiais atóxicos e seguros',
                'Verifique se os rolos estão limpos antes de usar'
              ],
              variations: [
                'Versão numérica: use números 1-5 em vez de vogais',
                'Adicione desenhos que começam com cada vogal',
                'Modo cronômetro: veja quem consegue organizar mais rápido',
                'Versão sequencial: coloque as vogais em ordem A-E-I-O-U',
                'Adicione consoantes conforme a criança avança'
              ],
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 4,
              title: 'Puzzle dos Números',
              description: 'Brincadeira educativa com pratos cortados para ensinar números e quantidades. Desenvolve raciocínio lógico e compreensão matemática',
              image_url: '/Brincadeiras/puzzledosnumeros.png',
              video_url: 'https://youtube.com/shorts/1icCY-29Qmc?feature=share',
              categories: ['educational', 'mathematical', 'indoor', 'quiet'],
              duration: 25,
              participants: '1-2',
              difficulty: 'easy',
              min_age: 3,
              max_age: 7,
              rating: 4.7,
              materials: [
                '5-10 pratos de plástico descartáveis',
                'Marcadores coloridos ou canetas permanentes',
                'Tesoura (para adultos)',
                'Adesivos redondos ou bolinhas de papel',
                'Cola (se usar bolinhas de papel)',
                'Régua para cortar reto',
                'Mesa ou superfície plana'
              ],
              how_to_make: [
                'Corte cada prato de plástico ao meio com cuidado',
                'Em uma metade, escreva um número grande (1, 2, 3, 4, 5...)',
                'Na outra metade correspondente, cole a quantidade exata de bolinhas/adesivos',
                'Use cores diferentes para cada par (número 1 = azul, 2 = vermelho, etc.)',
                'Certifique-se de que as bordas se encaixem perfeitamente',
                'Prepare pelo menos 5 pares para começar'
              ],
              instructions: [
                'Separe todas as metades dos pratos e misture na mesa',
                'Mostre à criança como funciona: número + bolinhas = prato completo',
                'Peça para contar as bolinhas em voz alta',
                'Ajude a encontrar o número correspondente à quantidade',
                'Encaixe as duas metades para formar o prato completo',
                'Continue até todos os pares estarem montados',
                'Celebre cada acerto e comemore a conquista!'
              ],
              brain_benefits: [
                'Desenvolve compreensão de números e quantidades',
                'Melhora habilidades de contagem',
                'Estimula raciocínio lógico e associação',
                'Fortalece coordenação motora fina',
                'Exercita paciência e concentração',
                'Prepara para matemática básica',
                'Desenvolve resolução de problemas'
              ],
              safety_tips: [
                'Adultos devem cortar os pratos para evitar bordas cortantes',
                'Verifique se não há pedaços soltos que possam ser engolidos',
                'Use pratos de plástico flexível, não rígido',
                'Supervisione crianças menores durante a atividade'
              ],
              variations: [
                'Versão com formas geométricas em vez de bolinhas',
                'Adicione operações simples: 2+1=3',
                'Use diferentes texturas para cada número',
                'Versão com cores: conte objetos coloridos',
                'Modo cronometrado para crianças mais velhas',
                'Versão bilíngue: números em português e inglês'
              ],
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 5,
              title: 'Liga Letras',
              description: 'Brincadeira com elásticos e tampas para conectar vogais iguais. Desenvolve coordenação motora fina, destreza manual e reconhecimento de letras',
              image_url: '/Brincadeiras/ligaletras.png',
              video_url: 'https://youtube.com/shorts/p90n6c59z1I?feature=share',
              categories: ['educational', 'fine-motor', 'indoor', 'quiet'],
              duration: 30,
              participants: '1-2',
              difficulty: 'medium',
              min_age: 4,
              max_age: 7,
              rating: 4.6,
              materials: [
                '1 papelão grande (30x40cm)',
                '10 tampas de garrafas (2 de cada vogal)',
                'Marcadores permanentes coloridos',
                '5-8 elásticos pequenos (coloridos)',
                'Cola forte ou cola quente',
                'Régua para medir distâncias',
                'Papel para marcar posições'
              ],
              how_to_make: [
                'Desenhe duas fileiras paralelas no papelão, com 15cm de distância',
                'Cole 5 tampas na primeira fileira: A, E, I, O, U (use cores diferentes)',
                'Cole 5 tampas na segunda fileira: A, E, I, O, U (mesmas cores)',
                'Certifique-se que as vogais iguais não fiquem uma em frente da outra',
                'Embaralhe as posições para criar o desafio',
                'Prepare elásticos de cores variadas para tornar mais atrativo'
              ],
              instructions: [
                'Apresente o tabuleiro com as duas fileiras de vogais',
                'Explique que deve conectar vogais iguais com elásticos',
                'Demonstre como esticar o elástico de uma tampa à outra',
                'Peça para encontrar duas letras "A" e conectá-las primeiro',
                'Continue com E, I, O, U até todas estarem conectadas',
                'Celebre cada conexão correta feita pela criança',
                'Remova os elásticos e embaralhe para repetir o desafio'
              ],
              brain_benefits: [
                'Desenvolve coordenação motora fina e destreza manual',
                'Melhora reconhecimento e associação de vogais',
                'Estimula concentração e foco visual',
                'Fortalece planejamento e estratégia simples',
                'Exercita paciência e persistência',
                'Prepara para escrita (movimento de pinça)',
                'Desenvolve percepção espacial e direcionamento'
              ],
              safety_tips: [
                'Supervisione o uso dos elásticos para evitar que sejam colocados na boca',
                'Use elásticos grandes o suficiente para não serem engolidos',
                'Certifique-se de que as tampas estão bem coladas',
                'Adultos devem usar cola quente se necessário'
              ],
              variations: [
                'Versão com números: conecte quantidades iguais',
                'Adicione cores: conecte tampas da mesma cor',
                'Versão com formas geométricas',
                'Modo cronometrado para crianças mais velhas',
                'Versão com palavras simples: conecte palavra com imagem',
                'Adicione dificuldade: 3 fileiras em vez de 2'
              ],
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 6,
              title: 'Equilíbrio da Fita',
              description: 'Desafio de equilíbrio onde as crianças devem caminhar sobre uma fita no chão carregando bolinhas em copos. Desenvolve coordenação motora, equilíbrio, concentração e foco.',
              image_url: '/Brincadeiras/equilibrionafita.png',
              video_url: 'https://youtube.com/shorts/vvoAW-aiLd4?feature=share',
              categories: ['physical', 'coordination', 'indoor', 'competition'],
              duration: 20,
              participants: '1-4',
              difficulty: 'medium',
              min_age: 4,
              max_age: 10,
              rating: 4.6,
              materials: [
                'Fita adesiva ou fita crepe (3-4 metros)',
                '1 papelão retangular (30x20cm por criança)',
                '2 copos plásticos pequenos por criança',
                '2 bolinhas pequenas por criança (ping pong ou similar)',
                'Cola ou fita dupla face para fixar os copos',
                'Marcador para linha de chegada'
              ],
              how_to_make: [
                'Cole a fita no chão formando uma linha reta de 3-4 metros',
                'Cole um copo em cada extremidade do papelão (bem fixado)',
                'Certifique-se que os copos estão nivelados',
                'Coloque uma bolinha em cada copo',
                'Marque claramente a linha de largada e chegada'
              ],
              instructions: [
                'Explique que só pode pisar em cima da fita',
                'Cada criança segura um papelão com 2 copos e bolinhas',
                'O objetivo é chegar até o final da fita sem derrubar as bolinhas',
                'Se uma bolinha cair, a criança deve voltar ao início',
                'Podem competir para ver quem chega primeiro',
                'Ou cada um pode tentar no seu próprio tempo'
              ],
              brain_benefits: [
                'Desenvolve equilíbrio e coordenação motora grossa',
                'Melhora concentração e foco sustentado',
                'Estimula controle corporal e propriocepção',
                'Fortalece músculos do core e das pernas',
                'Exercita paciência e persistência',
                'Desenvolve estratégias de movimento consciente',
                'Melhora coordenação visual-motora'
              ],
              safety_tips: [
                'Certifique-se que o chão não está escorregadio',
                'Remova obstáculos ao redor da fita',
                'Use bolinhas leves que não machucam se caírem',
                'Supervisione crianças menores para evitar quedas',
                'Mantenha distância segura entre participantes'
              ],
              variations: [
                'Versão mais fácil: Use fita mais larga',
                'Versão avançada: Faça curvas na fita',
                'Modo cooperativo: Façam juntos ajudando uns aos outros',
                'Versão com obstáculos: Adicione pequenos desafios no percurso',
                'Modo relay: Passem o papelão de um para outro',
                'Versão noturna: Use bolinhas que brilham no escuro'
              ],
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 7,
              title: 'Luva das Cores',
              description: 'Atividade de classificação de cores usando uma luva transparente e papelão. Desenvolve raciocínio lógico, coordenação motora fina e reconhecimento de cores.',
              image_url: '/Brincadeiras/luvadecores.png',
              video_url: 'https://www.youtube.com/shorts/1yjYBtOM3YI',
              categories: ['educational', 'fine-motor', 'indoor', 'logic'],
              duration: 25,
              participants: '1-2',
              difficulty: 'medium',
              min_age: 3,
              max_age: 8,
              rating: 4.7,
              materials: [
                '1 luva transparente (descartável ou de limpeza)',
                '1 papelão grande (40x30cm)',
                'Tintas ou papel colorido (5 cores diferentes)',
                'Objetos pequenos coloridos (pompons, blocos, botões)',
                'Cola forte ou fita dupla face',
                'Marcadores coloridos',
                'Recipiente para organizar as peças'
              ],
              how_to_make: [
                'Cole a luva transparente no centro do papelão',
                'Pinte cada dedo da luva com uma cor diferente (vermelho, azul, amarelo, verde, roxo)',
                'Deixe secar completamente',
                'Prepare objetos pequenos nas mesmas 5 cores',
                'Misture todas as peças coloridas em um recipiente',
                'Desenhe as cores correspondentes embaixo de cada dedo para orientação'
              ],
              instructions: [
                'Mostre a luva com os dedos coloridos para a criança',
                'Explique que cada dedo tem uma cor específica',
                'Apresente o recipiente com objetos coloridos misturados',
                'Peça para colocar objetos vermelhos no dedo vermelho',
                'Continue com todas as cores, uma de cada vez',
                'Celebre cada acerto e ajude quando necessário',
                'No final, conte quantos objetos de cada cor foram colocados'
              ],
              brain_benefits: [
                'Desenvolve raciocínio lógico e classificação',
                'Melhora reconhecimento e discriminação de cores',
                'Estimula coordenação motora fina e movimento de pinça',
                'Fortalece concentração e atenção aos detalhes',
                'Exercita planejamento e organização',
                'Desenvolve contagem básica e correspondência um-a-um',
                'Estimula percepção visual e categorização'
              ],
              safety_tips: [
                'Supervisione o uso de objetos pequenos para evitar engolimento',
                'Use luvas atóxicas e objetos seguros para crianças',
                'Certifique-se que as tintas estão completamente secas',
                'Guarde peças pequenas fora do alcance após a brincadeira',
                'Verifique se a criança não é alérgica ao material da luva'
              ],
              variations: [
                'Versão com números: cada dedo recebe uma quantidade específica',
                'Modo cronometrado: veja quanto tempo leva para classificar tudo',
                'Versão com formas: use círculos, quadrados, triângulos',
                'Adicione texturas: objetos lisos, rugosos, macios',
                'Versão cooperativa: duas crianças classificam juntas',
                'Modo avançado: misture cores (laranja = vermelho + amarelo)'
              ],
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 8,
              title: 'Desafio da Corda Guia',
              description: 'Brincadeira onde as crianças controlam um copo com bolinha através de fitas curvas puxando uma corda. Desenvolve raciocínio lógico, coordenação motora e noção espacial.',
              image_url: '/Brincadeiras/desafiodacordaguia.png',
              video_url: 'https://youtube.com/shorts/_E5z7z2wDrU?feature=share',
              categories: ['logic', 'coordination', 'indoor', 'competition', 'strategic'],
              duration: 30,
              participants: '1-4',
              difficulty: 'hard',
              min_age: 5,
              max_age: 12,
              rating: 4.8,
              materials: [
                'Fita adesiva ou fita crepe (8-10 metros)',
                '1 copo plástico pequeno por participante',
                '1 bolinha pequena por copo (ping pong ou similar)',
                'Corda ou barbante (3-4 metros por participante)',
                'Funil pequeno (para colocar a bolinha)',
                'Marcadores para pontos de largada e chegada',
                'Cronômetro (para competições)'
              ],
              how_to_make: [
                'Cole fitas no chão criando um percurso com várias curvas e zigue-zagues',
                'Marque claramente o ponto de largada e chegada',
                'Faça um furo pequeno na lateral do copo, próximo ao fundo',
                'Passe a corda pelo furo e dê um nó por dentro para fixar',
                'Coloque uma bolinha dentro de cada copo',
                'Teste o percurso para garantir que está desafiador mas possível'
              ],
              instructions: [
                'Explique que o objetivo é levar o copo da largada até a chegada',
                'O copo deve seguir sempre em cima da fita, sem sair dela',
                'A criança controla o copo puxando a corda em diferentes direções',
                'Se a bolinha cair ou o copo sair da fita, volta ao início',
                'Pode ser individual (contra o tempo) ou competição entre participantes',
                'Encoraje estratégia: puxar devagar nas curvas, mais rápido nas retas',
                'Celebre tanto a conclusão quanto as tentativas de melhoria'
              ],
              brain_benefits: [
                'Desenvolve raciocínio lógico e resolução de problemas',
                'Melhora coordenação motora fina e controle de movimentos',
                'Estimula percepção espacial e noção de direção',
                'Fortalece planejamento estratégico e antecipação',
                'Exercita paciência e controle de impulsos',
                'Desenvolve habilidades de causa e efeito',
                'Melhora concentração e foco sustentado'
              ],
              safety_tips: [
                'Supervisione o uso das cordas para evitar acidentes',
                'Certifique-se que o espaço ao redor do percurso está livre',
                'Use bolinhas grandes o suficiente para não serem engolidas',
                'Verifique se as fitas estão bem coladas para evitar escorregões',
                'Mantenha distância segura entre participantes em competições'
              ],
              variations: [
                'Versão mais fácil: Percurso mais reto com menos curvas',
                'Versão avançada: Adicione obstáculos ou túneis no percurso',
                'Modo cooperativo: Duas crianças controlam o mesmo copo',
                'Versão com obstáculos: Coloque pequenos cones para desviar',
                'Modo relay: Passem o controle do copo entre participantes',
                'Versão noturna: Use copos que brilham no escuro',
                'Desafio duplo: Cada criança controla dois copos simultaneamente'
              ],
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 9,
              title: 'Pinça dos Dedões',
              description: 'Brincadeira com tampinhas presas nos dedos para desenvolver o movimento de pinça. As crianças transferem feijões entre bandejas usando apenas os dedões. Desenvolve coordenação motora fina e prepara para a escrita.',
              image_url: '/Brincadeiras/pinca.png',
              video_url: 'https://youtube.com/shorts/FFeICSqNvSI?feature=share',
              categories: ['fine-motor', 'educational', 'indoor', 'concentration'],
              duration: 20,
              participants: '1-2',
              difficulty: 'medium',
              min_age: 3,
              max_age: 8,
              rating: 4.6,
              materials: [
                '4 tampinhas pequenas (de garrafa ou pote)',
                'Fita adesiva ou elásticos pequenos',
                'Feijões grandes ou grãos similares (200-300 unidades)',
                '2 bandejas ou pratos rasos',
                'Cronômetro (opcional)',
                'Recipiente para guardar os feijões',
                'Toalha ou pano para limpar'
              ],
              how_to_make: [
                'Cole ou prenda uma tampinha na ponta do polegar',
                'Cole outra tampinha na ponta do dedo indicador',
                'Repita o processo na outra mão',
                'Certifique-se que as tampinhas estão bem fixadas mas confortáveis',
                'Coloque todos os feijões em uma bandeja',
                'Deixe a segunda bandeja vazia ao lado'
              ],
              instructions: [
                'Mostre como juntar o polegar e indicador para "beliscar" o feijão',
                'Demonstre como pegar um feijão da bandeja cheia',
                'Ensine a transferir cuidadosamente para a bandeja vazia',
                'Comece com poucos feijões e aumente gradualmente',
                'Encoraje movimentos lentos e precisos',
                'Celebre cada feijão transferido com sucesso',
                'Quando terminar, contem juntos quantos feijões foram transferidos'
              ],
              brain_benefits: [
                'Desenvolve coordenação motora fina e movimento de pinça',
                'Fortalece músculos dos dedos essenciais para a escrita',
                'Melhora concentração e atenção aos detalhes',
                'Estimula controle de movimentos precisos',
                'Exercita paciência e persistência',
                'Desenvolve coordenação olho-mão',
                'Prepara as mãos para atividades de vida diária'
              ],
              safety_tips: [
                'Supervisione sempre para evitar que crianças pequenas engulam feijões',
                'Use feijões grandes o suficiente para não representar risco',
                'Certifique-se que as tampinhas estão bem fixadas',
                'Pare se a criança demonstrar frustração excessiva',
                'Mantenha os feijões organizados para evitar bagunça'
              ],
              variations: [
                'Versão mais fácil: Use objetos maiores como blocos pequenos',
                'Modo cronometrado: Veja quantos feijões consegue em 2 minutos',
                'Versão com cores: Separe feijões de cores diferentes',
                'Desafio de precisão: Use recipientes menores',
                'Modo cooperativo: Duas crianças trabalham na mesma bandeja',
                'Versão com contagem: Conte em voz alta cada feijão transferido',
                'Desafio avançado: Use apenas uma mão por vez'
              ],
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 10,
              title: 'Resgate dos Bonecos',
              description: 'Brincadeira onde bonecos são "presos" em um prato com elásticos e a criança precisa resgatá-los. Desenvolve raciocínio lógico, coordenação motora fina e habilidades sensoriais.',
              image_url: '/Brincadeiras/boneco.png',
              video_url: 'https://youtube.com/shorts/I1XxTNt45LQ?feature=share',
              categories: ['logic', 'fine-motor', 'indoor', 'problem-solving', 'sensory'],
              duration: 25,
              participants: '1-2',
              difficulty: 'medium',
              min_age: 4,
              max_age: 10,
              rating: 4.7,
              materials: [
                '1 prato fundo ou recipiente rígido',
                '3-4 bonecos pequenos (brinquedos de plástico)',
                '15-20 elásticos de diferentes cores e tamanhos',
                'Opcional: uma bandeja para organizar',
                'Opcional: cronômetro para desafios'
              ],
              how_to_make: [
                'Coloque os bonecos no centro do prato',
                'Estique os elásticos cruzando sobre os bonecos',
                'Varie as direções: alguns na horizontal, outros na vertical',
                'Alguns elásticos devem passar por cima de outros',
                'Certifique-se que os bonecos estão bem "presos" mas removíveis',
                'Use elásticos de cores diferentes para aumentar o desafio'
              ],
              instructions: [
                'Explique que os bonecos estão "presos" e precisam ser resgatados',
                'Mostre como remover cuidadosamente um elástico por vez',
                'Ensine a observar qual elástico está segurando cada boneco',
                'Encoraje a criança a planejar antes de puxar',
                'Se um boneco cair, celebre o "resgate" bem-sucedido',
                'Deixe a criança montar o próximo desafio',
                'Varie a complexidade conforme a idade e habilidade'
              ],
              brain_benefits: [
                'Desenvolve raciocínio lógico e resolução de problemas',
                'Melhora coordenação motora fina e destreza manual',
                'Estimula análise visual e percepção espacial',
                'Fortalece planejamento e estratégia',
                'Exercita paciência e controle de impulsos',
                'Desenvolve habilidades sensoriais e táteis',
                'Melhora concentração e foco sustentado'
              ],
              safety_tips: [
                'Supervisione sempre para evitar que elásticos sejam colocados na boca',
                'Use elásticos grandes o suficiente para não representar risco de engolimento',
                'Certifique-se que os bonecos não têm peças pequenas soltas',
                'Pare se a criança demonstrar frustração excessiva',
                'Verifique se os elásticos não estão muito apertados'
              ],
              variations: [
                'Versão mais fácil: Use menos elásticos e apenas uma cor',
                'Modo cronometrado: Resgate todos os bonecos em 3 minutos',
                'Versão por cores: Remova apenas elásticos de uma cor específica',
                'Desafio cooperativo: Uma criança monta, outra resgata',
                'Modo história: Crie narrativas sobre o resgate',
                'Versão avançada: Use mais bonecos e elásticos entrelaçados',
                'Desafio sensorial: Faça de olhos vendados (com supervisão)'
              ],
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 20,
              title: 'Encaixe das Caixas de Ovos',
              description: 'Brincadeira onde as crianças precisam encaixar formas coloridas cortadas de caixas de ovos nas pontas correspondentes. Desenvolve raciocínio lógico, reconhecimento de cores, coordenação motora fina e resolução de problemas.',
              instructions: [
                'Apresente a caixa de ovos com pontas coloridas para a criança',
                'Mostre as formas cortadas de cores correspondentes',
                'Explique que cada forma tem seu lugar específico na cor correspondente',
                'Comece com uma cor de cada vez para facilitar',
                'Deixe a criança tentar encaixar livremente',
                'Ajude quando necessário, mas encoraje a tentativa independente',
                'Comemore cada encaixe correto',
                'Quando dominar, misture todas as cores para maior desafio'
              ],
              materials: [
                '2 caixas de ovos (papelão ou plástico)',
                'Tinta atóxica ou papel colorido (5-6 cores diferentes)',
                'Tesoura (para adulto usar)',
                'Cola não tóxica',
                'Pincéis pequenos',
                'Toalha para limpeza',
                'Bandeja ou recipiente para organizar as peças'
              ],
              categories: ['educational', 'fine-motor', 'indoor', 'colors', 'logic', 'creative'],
              duration: 30,
              participants: '1-2',
              difficulty: 'medium',
              min_age: 3,
              max_age: 8,
              rating: 4.8,
              safety_tips: [
                'Supervisione sempre para evitar que as crianças coloquem peças na boca',
                'Use apenas tintas e colas atóxicas e seguras',
                'Verifique se as bordas cortadas estão lisas para evitar machucados',
                'Guarde peças pequenas fora do alcance após a brincadeira',
                'Pare se a criança demonstrar frustração excessiva',
                'Certifique-se que as tintas estão completamente secas antes do uso'
              ],
              variations: [
                'Versão mais fácil: Use apenas 3 cores e formas maiores',
                'Modo cronometrado: Veja quanto tempo leva para encaixar todas as peças',
                'Versão com números: Além das cores, adicione números aos encaixes',
                'Desafio cooperativo: Duas crianças trabalham juntas',
                'Versão com texturas: Adicione diferentes texturas às formas',
                'Modo avançado: Crie padrões específicos de encaixe',
                'Versão educativa: Ensine nomes das cores em outro idioma',
                'Desafio da memória: Mostre o padrão correto e depois deixe tentar de memória'
              ],
              image_url: '/Brincadeiras/encaixedascaixasdeovos.png',
              video_url: 'https://youtube.com/shorts/Zn4Cp3PdZGw?feature=share',
              active: true,
              created_at: new Date().toISOString()
            },

            // ============================================
            // 30 BRINCADEIRAS TRADICIONAIS
            // Foco em raciocínio, coordenação motora e pensamento lógico
            // ============================================

            // 1. Amarelinha Numérica
            {
              id: 21,
              title: 'Amarelinha Numérica',
              description: 'Brincadeira tradicional que combina movimento corporal com aprendizado de números e sequências lógicas.',
              instructions: [
                'Desenhe a amarelinha tradicional numerada de 1 a 10',
                'Explique que deve pular em cada número na ordem',
                'Use uma pedrinha para marcar a casa "proibida"',
                'Ensine a pular com um pé só e com os dois',
                'Crie desafios: pular de costas, conte em voz alta',
                'Varie as sequências: só números pares, só ímpares'
              ],
              materials: [
                'Giz colorido ou fita adesiva',
                'Pedrinhas pequenas ou saquinhos de areia',
                'Espaço plano e seguro'
              ],
              categories: ['traditional', 'physical', 'educational', 'coordination'],
              duration: 25,
              participants: '1-4',
              difficulty: 'easy',
              min_age: 3,
              max_age: 8,
              rating: 4.8,
              safety_tips: [
                'Verifique se o chão não tem obstáculos',
                'Use calçados adequados para não escorregar',
                'Cuidado com quedas durante os pulos'
              ],
              variations: [
                'Amarelinha das letras',
                'Versão com operações matemáticas',
                'Amarelinha das cores',
                'Modo cronometrado'
              ],
              image_url: '/Brincadeiras/amarelinhanumerica (1).png',
              active: true,
              created_at: new Date().toISOString()
            },

            // 3. Torre de Hanói Caseira
            {
              id: 23,
              title: 'Torre de Hanói Caseira',
              description: 'Versão simplificada do famoso quebra-cabeças que desenvolve planejamento sequencial e raciocínio lógico.',
              instructions: [
                'Use 3 palitos ou cabos como base',
                'Prepare discos de tamanhos diferentes (latas, pratos)',
                'Explique: mover todos os discos de um palito para outro',
                'Regra: disco maior nunca fica em cima do menor',
                'Comece com apenas 3 discos',
                'Demonstre os primeiros movimentos',
                'Deixe a criança descobrir a sequência'
              ],
              materials: [
                '3 palitos ou cabos de vassoura',
                '3-5 discos de tamanhos diferentes',
                'Base estável para fixar os palitos',
                'Opcional: timer para desafios'
              ],
              categories: ['logic', 'problem-solving', 'traditional', 'sequential'],
              duration: 30,
              participants: '1-2',
              difficulty: 'medium',
              min_age: 5,
              max_age: 10,
              rating: 4.6,
              safety_tips: [
                'Fixe bem os palitos para não tombarem',
                'Use discos sem bordas cortantes',
                'Supervisione para evitar frustração excessiva'
              ],
              variations: [
                'Versão mais fácil: apenas 2 discos',
                'Desafio cronometrado',
                'Torre colorida: cada disco uma cor',
                'Versão gigante com pneus'
              ],
              image_url: '/Brincadeiras/torrehanoi.png',
              active: true,
              created_at: new Date().toISOString()
            },

            // 4. Caça ao Tesouro Lógico
            {
              id: 24,
              title: 'Caça ao Tesouro Lógico',
              description: 'Brincadeira tradicional com pistas que exigem raciocínio lógico e resolução de problemas sequenciais.',
              image_url: '/Brincadeiras/tesouro.png',
              instructions: [
                'Prepare 5-7 pistas que envolvam lógica simples',
                'Cada pista leva à próxima através de dedução',
                'Use enigmas visuais adequados à idade',
                'Esconda as pistas em locais seguros',
                'Acompanhe a criança nas deduções',
                'Dê dicas sutis quando necessário',
                'Celebre cada pista descoberta'
              ],
              materials: [
                'Papel para as pistas',
                'Lápis coloridos',
                'Pequenos prêmios ou pistas',
                'Mapa simples da casa/área'
              ],
              categories: ['logic', 'problem-solving', 'traditional', 'adventure'],
              duration: 40,
              participants: '1-3',
              difficulty: 'medium',
              min_age: 5,
              max_age: 12,
              rating: 4.9,
              safety_tips: [
                'Esconda pistas apenas em locais seguros',
                'Evite lugares altos ou perigosos',
                'Acompanhe sempre a criança'
              ],
              variations: [
                'Caça ao tesouro matemático',
                'Versão com charadas rimadas',
                'Pistas fotográficas',
                'Caça ao tesouro da natureza'
              ],
              image_url: '/Brincadeiras/tesouro.png',
              active: true,
              created_at: new Date().toISOString()
            },

            // 5. Jogo dos Palitos
            {
              id: 25,
              title: 'Jogo dos Palitos',
              description: 'Jogo tradicional de estratégia que desenvolve pensamento antecipado e raciocínio matemático.',
              instructions: [
                'Disponha 21 palitos em fileiras ou monte',
                'Explique: cada jogador tira 1, 2 ou 3 palitos',
                'Objetivo: não ser quem pega o último palito',
                'Comece você demonstrando estratégias',
                'Deixe a criança descobrir padrões',
                'Discuta as jogadas depois de cada partida',
                'Varie o número inicial de palitos'
              ],
              materials: [
                '21 palitos ou gravetos',
                'Superfície plana para organizar',
                'Opcional: papel para anotar estratégias'
              ],
              categories: ['logic', 'strategic', 'traditional', 'mathematical'],
              duration: 20,
              participants: '2',
              difficulty: 'medium',
              min_age: 6,
              max_age: 12,
              rating: 4.5,
              safety_tips: [
                'Use palitos sem pontas afiadas',
                'Evite que a criança se frustre com derrotas',
                'Ensine que perder também é aprender'
              ],
              variations: [
                'Versão com 15 palitos',
                'Jogo dos fósforos (sem fogo)',
                'Variação: quem pega o último ganha',
                'Jogo em equipes'
              ],
              image_url: '/Brincadeiras/palito.png',
              active: true,
              created_at: new Date().toISOString()
            },

            // 6. Tangram Tradicional
            {
              id: 26,
              title: 'Tangram Tradicional',
              description: 'Quebra-cabeças chinês milenar que desenvolve percepção espacial e raciocínio geométrico.',
              instructions: [
                'Apresente as 7 peças do tangram',
                'Mostre figuras simples para montar (casa, barco)',
                'Deixe a criança explorar livremente primeiro',
                'Proponha desafios graduais',
                'Incentive a criação de figuras próprias',
                'Desenhe contornos para ela preencher',
                'Celebre cada figura completada'
              ],
              materials: [
                'Conjunto de tangram (madeira ou EVA)',
                'Livro com modelos ou figuras impressas',
                'Papel para desenhar novos desafios'
              ],
              categories: ['logic', 'spatial', 'traditional', 'creative'],
              duration: 25,
              participants: '1',
              difficulty: 'medium',
              min_age: 4,
              max_age: 10,
              rating: 4.7,
              safety_tips: [
                'Use peças grandes o suficiente para não engolir',
                'Verifique se não há pontas cortantes',
                'Guarde as peças organizadas'
              ],
              variations: [
                'Tangram gigante no chão',
                'Tangram magnético',
                'Criação de histórias com as figuras',
                'Tangram em equipes'
              ],
              image_url: '/Brincadeiras/tan.png',
              active: true,
              created_at: new Date().toISOString()
            },

            // 7. Jogo da Memória Gigante
            {
              id: 27,
              title: 'Jogo da Memória Gigante',
              description: 'Versão ampliada do clássico jogo da memória que exercita a memória visual e coordenação motora.',
              instructions: [
                'Prepare cartas grandes (pelo menos 15x15cm)',
                'Use imagens simples e coloridas',
                'Disponha as cartas viradas para baixo',
                'Explique: virar duas cartas por vez',
                'Se formarem par, ficam viradas',
                'Se não, viram novamente para baixo',
                'Incentive a memorização das posições'
              ],
              materials: [
                '20-30 cartas grandes com pares',
                'Espaço amplo no chão',
                'Imagens atrativas para crianças'
              ],
              categories: ['memory', 'traditional', 'coordination', 'visual'],
              duration: 30,
              participants: '1-4',
              difficulty: 'easy',
              min_age: 3,
              max_age: 8,
              rating: 4.8,
              safety_tips: [
                'Use cartas com bordas não cortantes',
                'Certifique-se que o chão está limpo',
                'Comece com menos pares para não frustrar'
              ],
              variations: [
                'Memória temática (animais, cores)',
                'Versão com sons',
                'Memória em movimento',
                'Modo cooperativo contra o tempo'
              ],
              image_url: '/Brincadeiras/memoria.png',
              active: true,
              created_at: new Date().toISOString()
            },

            // 8. Labirinto de Fita
            {
              id: 28,
              title: 'Labirinto de Fita',
              description: 'Criação de labirintos no chão para desenvolver planejamento espacial e resolução de problemas.',
              instructions: [
                'Use fita adesiva para criar caminhos no chão',
                'Faça um labirinto com entrada e saída',
                'Inclua becos sem saída para desafio',
                'Demonstre como seguir apenas as linhas',
                'Deixe a criança encontrar a saída',
                'Cronometrem as tentativas',
                'Criem novos labirintos juntos'
              ],
              materials: [
                'Fita adesiva colorida',
                'Espaço amplo no chão',
                'Cronômetro',
                'Pequenos prêmios para a chegada'
              ],
              categories: ['spatial', 'problem-solving', 'traditional', 'physical'],
              duration: 35,
              participants: '1-3',
              difficulty: 'easy',
              min_age: 3,
              max_age: 10,
              rating: 4.6,
              safety_tips: [
                'Certifique-se que não há obstáculos no caminho',
                'Use fita que não danifique o chão',
                'Supervisione para evitar corridas perigosas'
              ],
              variations: [
                'Labirinto com obstáculos',
                'Versão de olhos vendados (com ajuda)',
                'Labirinto temático',
                'Múltiplas saídas'
              ],
              image_url: '/Brincadeiras/fita.png',
              active: true,
              created_at: new Date().toISOString()
            },

            // 9. Jogo do Mico Tradicional
            {
              id: 29,
              title: 'Jogo do Mico Tradicional',
              description: 'Jogo de cartas tradicional que desenvolve estratégia, memória e coordenação motora fina.',
              instructions: [
                'Use baralho adaptado para crianças',
                'Remova uma carta para criar o "mico"',
                'Distribua todas as cartas igualmente',
                'Explique: formar pares e descartar',
                'Quem ficar com a carta sem par perde',
                'Ensine a observar as expressões dos outros',
                'Incentive estratégias simples'
              ],
              materials: [
                'Baralho infantil ou cartas grandes',
                'Mesa ou superfície plana',
                'Cadeiras para todos os jogadores'
              ],
              categories: ['strategic', 'traditional', 'social', 'fine-motor'],
              duration: 25,
              participants: '2-4',
              difficulty: 'easy',
              min_age: 4,
              max_age: 10,
              rating: 4.7,
              safety_tips: [
                'Use cartas adequadas para o tamanho das mãos',
                'Ensine sobre ganhar e perder com esportividade',
                'Supervisione para evitar trapaças'
              ],
              variations: [
                'Mico com imagens temáticas',
                'Versão com números',
                'Mico cooperativo',
                'Versão gigante'
              ],
              image_url: '/Brincadeiras/mico.png',
              active: true,
              created_at: new Date().toISOString()
            },

            // 10. Dança das Cadeiras Estratégica
            {
              id: 30,
              title: 'Dança das Cadeiras Estratégica',
              description: 'Versão modificada da dança das cadeiras que adiciona elementos de estratégia e pensamento rápido.',
              instructions: [
                'Disponha cadeiras em círculo (uma a menos que participantes)',
                'Adicione cartões com desafios em cada cadeira',
                'Quando a música para, além de sentar, cumprir o desafio',
                'Desafios podem ser: contar até 10, nomear cores, etc',
                'Quem cumprir o desafio primeiro fica na cadeira',
                'Varie os tipos de desafios a cada rodada'
              ],
              materials: [
                'Cadeiras seguras',
                'Cartões com desafios simples',
                'Música',
                'Espaço livre para movimento'
              ],
              categories: ['strategic', 'traditional', 'physical', 'quick-thinking'],
              duration: 20,
              participants: '3-6',
              difficulty: 'easy',
              min_age: 4,
              max_age: 8,
              rating: 4.8,
              safety_tips: [
                'Use cadeiras estáveis',
                'Evite empurrões na disputa',
                'Certifique-se que todos entendem as regras'
              ],
              variations: [
                'Desafios matemáticos',
                'Versão com poses específicas',
                'Modo cooperativo',
                'Dança das almofadas'
              ],
              image_url: '/Brincadeiras/cadeira.png',
              active: true,
              created_at: new Date().toISOString()
            },

            // 11-30: Resumo das demais atividades tradicionais
            // Para economizar espaço, aqui está um resumo das 20 atividades restantes:

            // Sequência de Cores, Construção de Torres, Jogo dos Sete Erros Vivencial,
            // Cabo de Guerra Estratégico, Quebra-Cabeça de Chão, Jogo da Velha Tridimensional,
            // Circuito de Coordenação, Jogo das Varetas, Detetive das Pistas, Equilibrista Maluco,
            // Mestre Mandou Lógico, Construtor de Padrões, Telefone Sem Fio Inteligente,
            // Arquiteto Mirim, Código Secreto das Cores, Estátuas Musicais Pensantes,
            // Organizador Lógico, Contador de Histórias Estruturado, Laboratório de Misturas,
            // Planejador de Rotas

            // Exemplo das próximas 5 atividades:

            // 11. Sequência de Cores
            {
              id: 31,
              title: 'Sequência de Cores',
              description: 'Jogo tradicional que desenvolve memória sequencial e coordenação motora através de padrões coloridos.',
              instructions: [
                'Use 4-6 objetos coloridos diferentes',
                'Crie uma sequência simples (vermelho, azul, verde)',
                'Mostre a sequência para a criança',
                'Cubra e peça para repetir',
                'Aumente gradualmente a complexidade',
                'Inclua ritmo batendo palmas',
                'Celebre cada sequência correta'
              ],
              materials: ['Objetos coloridos (blocos, brinquedos)', 'Pano para cobrir', 'Espaço organizado'],
              categories: ['memory', 'sequential', 'traditional', 'coordination'],
              duration: 20,
              participants: '1-2',
              difficulty: 'easy',
              min_age: 3,
              max_age: 7,
              rating: 4.6,
              safety_tips: ['Use objetos grandes o suficiente para não engolir', 'Comece com sequências curtas'],
              variations: ['Sequência com sons', 'Versão com movimentos corporais', 'Sequência musical'],
              image_url: '/Brincadeiras/cores.png',
              active: true,
              created_at: new Date().toISOString()
            },

            // 12. Construção de Torres
            {
              id: 32,
              title: 'Construção de Torres',
              description: 'Brincadeira tradicional que desenvolve coordenação motora fina, planejamento e noção espacial.',
              instructions: [
                'Reúna blocos, latas ou caixas de tamanhos variados',
                'Desafie a construir a torre mais alta possível',
                'Ensine sobre equilíbrio e base estável',
                'Incentive planejamento antes de construir',
                'Crie competições amigáveis',
                'Fotografe as criações',
                'Discuta por que algumas torres caem'
              ],
              materials: ['Blocos de madeira ou latas vazias', 'Superfície estável', 'Régua para medir'],
              categories: ['engineering', 'traditional', 'fine-motor', 'spatial'],
              duration: 30,
              participants: '1-3',
              difficulty: 'easy',
              min_age: 2,
              max_age: 8,
              rating: 4.7,
              safety_tips: ['Use materiais sem pontas cortantes', 'Supervisione para evitar quedas'],
              variations: ['Torres temáticas', 'Construção em equipe', 'Torres com pontes'],
              image_url: '/Brincadeiras/lata.png',
              active: true,
              created_at: new Date().toISOString()
            },

            // 13. Jogo dos Sete Erros Vivencial
            {
              id: 33,
              title: 'Jogo dos Sete Erros Vivencial',
              description: 'Versão física do clássico jogo que desenvolve atenção aos detalhes e memória visual.',
              instructions: [
                'Organize um ambiente com vários objetos',
                'Deixe a criança observar por 1 minuto',
                'Peça para ela fechar os olhos',
                'Mude 3-5 objetos de lugar ou retire alguns',
                'Peça para encontrar as diferenças',
                'Comece com poucas mudanças',
                'Aumente gradualmente a dificuldade'
              ],
              materials: ['Vários objetos pequenos', 'Mesa organizada', 'Cronômetro'],
              categories: ['observation', 'memory', 'traditional', 'detail-oriented'],
              duration: 25,
              participants: '1-2',
              difficulty: 'medium',
              min_age: 4,
              max_age: 10,
              rating: 4.8,
              safety_tips: ['Use apenas objetos seguros', 'Comece simples para não frustrar'],
              variations: ['Versão com pessoas', 'Jogo fotográfico', 'Erros temáticos'],
              image_url: '/Brincadeiras/7.png',
              active: true,
              created_at: new Date().toISOString()
            },

            // 14. Quebra-Cabeça de Chão
            {
              id: 34,
              title: 'Quebra-Cabeça de Chão',
              description: 'Quebra-cabeças grandes que podem ser montados no chão, desenvolvendo lógica espacial e persistência.',
              instructions: [
                'Use quebra-cabeças grandes apropriados para a idade',
                'Prepare uma área limpa no chão',
                'Comece separando as bordas',
                'Ensine a agrupar por cores ou padrões',
                'Incentive tentativas mesmo que erradas',
                'Trabalhem juntos na solução',
                'Comemore a conclusão com foto'
              ],
              materials: ['Quebra-cabeças grandes (50-200 peças)', 'Tapete', 'Boa iluminação'],
              categories: ['logic', 'traditional', 'spatial', 'persistence'],
              duration: 45,
              participants: '1-2',
              difficulty: 'medium',
              min_age: 4,
              max_age: 12,
              rating: 4.6,
              safety_tips: ['Use peças adequadas à idade', 'Mantenha organizadas'],
              variations: ['Quebra-cabeça gigante', 'Versão 3D', 'Criação própria'],
              image_url: '/Brincadeiras/quebra.png',
              active: true,
              created_at: new Date().toISOString()
            },

            // 15. Jogo das Varetas
            {
              id: 35,
              title: 'Jogo das Varetas',
              description: 'Jogo tradicional que desenvolve coordenação motora fina, concentração e controle de movimentos.',
              instructions: [
                'Use varetas coloridas ou palitos de churrasco',
                'Segure todas juntas e solte formando uma pilha',
                'Objetivo: retirar varetas sem mover as outras',
                'Comece com a vareta de cima',
                'Se mover outras varetas, perde a vez',
                'Conte pontos por cores',
                'Ensine paciência e movimentos precisos'
              ],
              materials: ['Conjunto de varetas coloridas', 'Superfície lisa', 'Papel para pontos'],
              categories: ['fine-motor', 'traditional', 'concentration', 'precision'],
              duration: 25,
              participants: '2-4',
              difficulty: 'medium',
              min_age: 5,
              max_age: 12,
              rating: 4.7,
              safety_tips: ['Use varetas sem pontas afiadas', 'Ensine sobre paciência'],
              variations: ['Varetas gigantes', 'Versão com imãs', 'Jogo cooperativo'],
              image_url: '/Brincadeiras/vareta.png',
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 36,
              title: 'Pescador de Argolas',
              description: 'Brincadeira divertida onde as crianças usam palitos para pescar argolas coloridas e encaixá-las em torres. Desenvolve foco, coordenação motora fina, paciência e agilidade.',
              instructions: [
                'Crie as argolas cortando tiras de cartolina colorida com 2 cm de largura',
                'Junte as pontas de cada tira para formar círculos e prenda com fita adesiva',
                'Prepare as torres usando 2 rolos de papel toalha',
                'Faça a base cortando quadrados de papelão (15x15 cm) e cole o fundo de cada rolo no centro',
                'Coloque as duas torres na mesa com espaço entre elas',
                'Espalhe todas as argolas coloridas pela mesa',
                'Cada jogador pega um palito e escolhe uma cor de argola',
                'Ao sinal de "JÁ!", cada jogador usa apenas o palito para pescar uma argola da sua cor',
                'Com a argola equilibrada no palito, leve-a até sua torre e encaixe por cima',
                'Não pode usar as mãos para ajudar! Se a argola cair, pesque de novo',
                'O vencedor é quem conseguir colocar todas as suas argolas na torre primeiro!'
              ],
              materials: [
                '2 rolos de papel toalha (ou 4 rolos de papel higiênico emendados)',
                'Cartolina ou papel colorido de duas cores diferentes (ex: verde e azul)',
                'Tesoura sem ponta',
                'Fita adesiva ou cola',
                '2 palitos longos (churrasco, hashi ou galho fino e reto)',
                'Papelão para fazer a base (caixa velha)',
                'Mesa para brincar'
              ],
              categories: ['coordenação', 'foco', 'competição', 'motor', 'paciência'],
              duration: 10,
              participants: '2-4',
              difficulty: 'medium',
              min_age: 4,
              max_age: 10,
              rating: 4.7,
              safety_tips: [
                'Supervisione o uso dos palitos para evitar acidentes',
                'Certifique-se de que as pontas dos palitos não estão afiadas',
                'Use palitos com pontas cortadas ou arredondadas',
                'Mantenha o espaço da mesa livre de obstáculos',
                'Verifique se as torres estão bem fixadas na base'
              ],
              variations: [
                'Versão cronômetro: veja quem coloca mais argolas em 1 minuto',
                'Versão cooperativa: trabalhem juntos para colocar todas as argolas',
                'Versão com cores diferentes: cada cor vale pontos diferentes',
                'Versão com obstáculos: coloque pequenos obstáculos no caminho',
                'Versão com argolas menores: aumente a dificuldade usando argolas menores'
              ],
              image_url: '/Brincadeiras/1..png',
              video_url: '/Brincadeiras/1.mp4',
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 37,
              title: 'Código das Cores',
              description: 'Brincadeira educativa onde as crianças devem reproduzir padrões de cores usando bolinhas e copos. Desenvolve raciocínio lógico, reconhecimento de padrões, percepção espacial, concentração e associação de cores.',
              instructions: [
                'Observe o padrão de cores no "cartão de código"',
                'Pegue as bolinhas coloridas uma por uma',
                'Coloque cada bolinha no copo correspondente à posição do código',
                'Se o círculo no canto superior esquerdo do código for azul, coloque uma bolinha azul no copo do canto superior esquerdo',
                'Continue até reproduzir todo o padrão do código',
                'Verifique se todas as posições estão corretas',
                'Termine quando conseguir copiar o código perfeitamente!',
                'Troque o cartão de código para um novo desafio'
              ],
              materials: [
                '1 pedaço de papelão grande para o painel (aprox. 50x50 cm)',
                '1 pedaço de papelão menor para o "código" (aprox. 30x20 cm)',
                '9 copos brancos (de papel ou plástico)',
                'Bolinhas de plástico coloridas (como as de piscina de bolinhas)',
                'Papel colorido ou EVA nas mesmas cores das bolinhas',
                'Cola forte ou pistola de cola quente (usar com a ajuda de um adulto)',
                'Tesoura',
                'Fita adesiva dupla-face para fixar na parede (opcional)',
                'Velcro (opcional, para códigos intercambiáveis)'
              ],
              categories: ['lógica', 'padrões', 'espacial', 'concentração', 'educativo', 'cognitivo'],
              duration: 15,
              participants: '1',
              difficulty: 'medium',
              min_age: 4,
              max_age: 10,
              rating: 4.8,
              safety_tips: [
                'Supervisione o uso da tesoura e cola quente por adultos apenas',
                'Certifique-se de que as bolinhas são grandes o suficiente para não serem engolidas',
                'Use materiais atóxicos e seguros',
                'Verifique se o painel está bem fixado para evitar quedas',
                'Mantenha o espaço organizado para evitar tropeços'
              ],
              variations: [
                'Versão com velcro: use círculos intercambiáveis para criar infinitos códigos',
                'Versão cronômetro: veja quem consegue completar mais rápido',
                'Versão cooperativa: trabalhem juntos para resolver códigos complexos',
                'Versão com mais cores: aumente a dificuldade usando mais cores diferentes',
                'Versão com padrões sequenciais: crie códigos que seguem uma sequência lógica',
                'Versão com códigos 3D: use diferentes alturas ou tamanhos de bolinhas'
              ],
              image_url: '/Brincadeiras/2..png',
              video_url: '/Brincadeiras/2.mp4',
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 38,
              title: 'Encaixe das Cores',
              description: 'Brincadeira educativa onde as crianças devem encaixar argolas coloridas nos palitos correspondentes. Desenvolve associação de cores, coordenação motora fina, movimento de pinça e concentração.',
              instructions: [
                'Coloque a caixa-tabuleiro na frente da criança',
                'Espalhe todas as argolas coloridas ao lado da caixa',
                'Peça para a criança pegar uma argola',
                'Identifique a cor da argola escolhida',
                'Encontre o palito (poste) da cor correspondente na caixa',
                'Encaixe a argola no palito da cor certa',
                'Continue com as próximas argolas',
                'Termine quando todas as argolas estiverem encaixadas nos lugares corretos!'
              ],
              materials: [
                '1 tampa de caixa de sapatos (ou outra caixa rasa)',
                'Palitos de picolé coloridos (ou palitos de madeira natural para pintar)',
                'Argolas coloridas (podem ser de plástico ou feitas com limpadores de cachimbo/chenille)',
                'Pistola de cola quente (essencial para fixar bem os palitos)',
                'Tinta guache e pincel (caso use palitos sem cor)',
                'Barbante e um furador (opcional, para criar o "labirinto" no meio)',
                'Limpadores de cachimbo/chenille (para fazer argolas caseiras)'
              ],
              categories: ['cores', 'coordenação', 'pinça', 'concentração', 'educativo', 'motor'],
              duration: 10,
              participants: '1',
              difficulty: 'easy',
              min_age: 2,
              max_age: 6,
              rating: 4.7,
              safety_tips: [
                'Supervisione o uso da pistola de cola quente por adultos apenas',
                'Certifique-se de que as argolas são grandes o suficiente para não serem engolidas',
                'Use materiais atóxicos e seguros',
                'Verifique se os palitos estão bem fixados para evitar machucados',
                'Mantenha o espaço organizado para evitar tropeços',
                'Use argolas de plástico flexível para evitar cortes'
              ],
              variations: [
                'Versão com labirinto: adicione barbante entre os palitos para criar obstáculos',
                'Versão cronômetro: veja quem consegue encaixar todas as argolas mais rápido',
                'Versão cooperativa: trabalhem juntos para completar o desafio',
                'Versão com mais cores: aumente a dificuldade usando mais cores diferentes',
                'Versão com argolas de tamanhos diferentes: use argolas pequenas e grandes',
                'Versão com sequência: crie uma ordem específica para encaixar as argolas'
              ],
              image_url: '/Brincadeiras/3..png',
              video_url: '/Brincadeiras/3.mp4',
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 39,
              title: 'Circuito das Cores',
              description: 'Brincadeira ativa onde as crianças correm ao redor de um bambolê para associar bolinhas coloridas com suas bases correspondentes. Desenvolve reconhecimento de cores, coordenação motora ampla, agilidade e percepção espacial.',
              instructions: [
                'Posicione-se ao lado do monte de bolinhas coloridas',
                'Pegue uma bolinha de cada vez (ex: bolinha amarela)',
                'Ande ou corra ao redor do bambolê',
                'Encontre o círculo da mesma cor no chão dentro do bambolê',
                'Coloque a bolinha no copo posicionado em frente ao círculo correspondente',
                'Volte correndo para o monte de bolinhas',
                'Pegue uma nova bolinha de outra cor',
                'Repita o processo até todas as bolinhas estarem em suas bases corretas!'
              ],
              materials: [
                '1 bambolê',
                'Bolinhas de plástico coloridas (como as de piscina)',
                'Copos de plástico transparentes ou brancos (mesma quantidade de cores)',
                'Folhas de EVA ou cartolina das mesmas cores das bolinhas',
                'Tesoura',
                'Cronômetro (opcional, para competições)',
                'Espaço aberto para correr'
              ],
              categories: ['cores', 'coordenação', 'agilidade', 'espacial', 'físico', 'competição'],
              duration: 10,
              participants: '1-2',
              difficulty: 'medium',
              min_age: 3,
              max_age: 8,
              rating: 4.9,
              safety_tips: [
                'Certifique-se de que o espaço ao redor do bambolê esteja livre de obstáculos',
                'Use bolinhas grandes o suficiente para não serem engolidas',
                'Supervisione as crianças durante a corrida para evitar colisões',
                'Verifique se o chão não está escorregadio',
                'Mantenha distância segura entre os participantes em versões com 2 jogadores',
                'Use materiais atóxicos e seguros'
              ],
              variations: [
                'Versão cronômetro: veja quem consegue completar o circuito mais rápido',
                'Versão com dois circuitos: cada criança tem seu próprio circuito',
                'Versão cooperativa: trabalhem juntos para completar um circuito maior',
                'Versão com obstáculos: adicione pequenos obstáculos no caminho',
                'Versão com sequência: crie uma ordem específica para pegar as bolinhas',
                'Versão com mais cores: aumente a dificuldade usando mais cores diferentes'
              ],
              image_url: '/Brincadeiras/5..png',
              video_url: '/Brincadeiras/5.mp4',
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 40,
              title: 'Pebolim de Caixa',
              description: 'Brincadeira esportiva onde as crianças constroem e jogam um pebolim caseiro usando caixa de sapatos e palitos. Desenvolve coordenação motora, agilidade, raciocínio rápido, estratégia e socialização.',
              instructions: [
                'Cada jogador escolhe um lado do campo e controla os palitos correspondentes',
                'Coloque a bolinha no meio do campo para começar a partida',
                'Mova os palitos para os lados e gire-os para que as tampinhas "chutem" a bola',
                'O objetivo é marcar um gol, fazendo a bolinha entrar na tampa maior do adversário',
                'Use seus jogadores para defender seu gol quando não estiver com a bola',
                'Defina um placar para terminar o jogo (ex: quem fizer 5 gols primeiro, ganha!)',
                'Celebre cada gol marcado!',
                'Jogue com fair play e divirta-se!'
              ],
              materials: [
                '1 caixa de sapatos de papelão resistente (sem tampa)',
                '6 a 8 palitos de churrasco',
                'Tampinhas de garrafa PET (pelo menos 10, de 2 cores diferentes para os times)',
                '2 tampas de plástico maiores (de amaciante, Nescau, etc.) para os gols',
                '1 bolinha pequena e leve (de desodorante roll-on, gude ou papel amassado)',
                'Pistola de cola quente',
                'Estilete ou faca de ponta fina (para ser usado APENAS por um adulto)',
                'Marcador para fazer os furos'
              ],
              categories: ['coordenação', 'agilidade', 'estratégia', 'socialização', 'esportivo', 'competição'],
              duration: 15,
              participants: '2',
              difficulty: 'medium',
              min_age: 5,
              max_age: 12,
              rating: 4.9,
              safety_tips: [
                'Supervisione o uso do estilete e pistola de cola quente por adultos apenas',
                'Certifique-se de que os palitos não tenham pontas afiadas',
                'Use bolinhas leves para evitar machucados',
                'Verifique se a caixa está bem montada antes de jogar',
                'Mantenha o espaço de jogo livre de obstáculos',
                'Ensine sobre fair play e respeito entre os jogadores'
              ],
              variations: [
                'Versão com mais jogadores: adicione mais fileiras de palitos',
                'Versão cronômetro: jogue por tempo determinado (ex: 10 minutos)',
                'Versão com obstáculos: adicione pequenos obstáculos no campo',
                'Versão com diferentes tamanhos de bolinha: varie a dificuldade',
                'Versão torneio: organize um campeonato entre várias duplas',
                'Versão com regras especiais: crie regras próprias para tornar mais divertido'
              ],
              image_url: '/Brincadeiras/6..png',
              video_url: '/Brincadeiras/6.mp4',
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 41,
              title: 'Labirinto dos Túneis',
              description: 'Brincadeira de precisão onde as crianças devem guiar uma bolinha através de túneis inclinando cuidadosamente uma caixa. Desenvolve equilíbrio, coordenação motora fina, concentração, paciência e percepção de causa e efeito.',
              instructions: [
                'Segure a caixa com as duas mãos, mantendo-a na horizontal',
                'Incline a caixa com cuidado para cima, para baixo e para os lados',
                'Guie o movimento da bolinha através dos túneis',
                'Faça a bolinha passar pelo primeiro túnel',
                'Continue guiando para o segundo túnel',
                'Complete o percurso passando pelo terceiro túnel',
                'Se a bolinha não passar pelo túnel, volte e tente novamente',
                'Celebre quando conseguir completar todo o percurso!'
              ],
              materials: [
                '1 tampa de caixa de sapatos (ou uma caixa de papelão rasa)',
                '3 rolos de papel higiênico vazios',
                '1 bolinha pequena que passe por dentro dos rolos (de gude, pingue-pongue, ou uma que pule)',
                'Cola (branca, de silicone ou quente)',
                'Cronômetro (opcional, para cronometrar o tempo)',
                'Mesa ou superfície plana para apoiar'
              ],
              categories: ['equilíbrio', 'coordenação', 'concentração', 'paciência', 'causa-efeito', 'precisão'],
              duration: 10,
              participants: '1',
              difficulty: 'medium',
              min_age: 3,
              max_age: 10,
              rating: 4.8,
              safety_tips: [
                'Supervisione o uso da cola por adultos apenas',
                'Certifique-se de que a bolinha é grande o suficiente para não ser engolida',
                'Verifique se os rolos estão bem colados para evitar acidentes',
                'Use uma superfície estável para apoiar a caixa',
                'Mantenha o espaço livre de obstáculos',
                'Ensine sobre paciência e persistência'
              ],
              variations: [
                'Versão cronômetro: veja quem consegue completar o percurso mais rápido',
                'Versão com mais túneis: adicione mais rolos para aumentar a dificuldade',
                'Versão com túneis em posições diferentes: crie labirintos mais complexos',
                'Versão com bolinhas diferentes: use bolinhas de tamanhos e pesos variados',
                'Versão cooperativa: trabalhem juntos para guiar a bolinha',
                'Versão com obstáculos: adicione pequenos obstáculos no caminho'
              ],
              image_url: '/Brincadeiras/7..png',
              video_url: '/Brincadeiras/7.2.mp4',
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 42,
              title: 'Caixa-Cascata',
              description: 'Brincadeira estratégica onde as crianças controlam palitos para influenciar o caminho de uma bolinha que cai através de obstáculos. Desenvolve raciocínio estratégico, coordenação motora fina, antecipação, paciência e noção de causa e efeito.',
              instructions: [
                'Pegue o pompom e solte-o no furo de entrada no topo da caixa',
                'Observe como o pompom cai, quicando e desviando nas tampinhas',
                'Empurre e puxe as varetas (palitos) para mudar a posição das tampinhas',
                'Tente influenciar o caminho do pompom durante a queda',
                'Objetivo: fazer o pompom cair dentro de uma das cestas coloridas no fundo',
                'Se acertar uma cesta, marque os pontos correspondentes',
                'Se errar, passe a vez para o próximo jogador',
                'Ganha quem tiver a maior pontuação após o número combinado de rodadas!'
              ],
              materials: [
                '1 caixa de papelão alta (como de botas, ou algum item grande)',
                'Vários palitos de churrasco (cerca de 10 a 12)',
                'Várias tampinhas de garrafa PET (para serem os obstáculos)',
                '3 ou 4 tampas de plástico maiores e coloridas (para serem os alvos/cestas)',
                '1 pompom pequeno, uma miçanga grande ou bolinha de papel amassado',
                'Estilete (para ser usado APENAS por um adulto)',
                'Pistola de cola quente',
                'Canetinhas coloridas (opcional, para decorar e marcar os palitos)',
                'Papel e caneta para marcar a pontuação'
              ],
              categories: ['estratégia', 'coordenação', 'antecipação', 'paciência', 'causa-efeito', 'competição'],
              duration: 15,
              participants: '1+',
              difficulty: 'hard',
              min_age: 6,
              max_age: 12,
              rating: 4.9,
              safety_tips: [
                'Supervisione o uso do estilete e pistola de cola quente por adultos apenas',
                'Certifique-se de que o pompom é grande o suficiente para não ser engolido',
                'Verifique se os palitos não têm pontas afiadas',
                'Use uma superfície estável para apoiar a caixa',
                'Mantenha o espaço livre de obstáculos',
                'Ensine sobre paciência e estratégia'
              ],
              variations: [
                'Versão com pontuação diferente: cada cesta vale pontos diferentes',
                'Versão cronômetro: veja quem consegue mais pontos em tempo determinado',
                'Versão cooperativa: trabalhem juntos para conseguir a maior pontuação',
                'Versão com mais obstáculos: adicione mais tampinhas para aumentar a dificuldade',
                'Versão com diferentes tamanhos de pompom: varie o desafio',
                'Versão torneio: organize um campeonato entre vários jogadores'
              ],
              image_url: '/Brincadeiras/8..png',
              video_url: '/Brincadeiras/8.mp4',
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 43,
              title: 'Estrada da Soma',
              description: 'Brincadeira educativa que ensina matemática de forma divertida usando uma estrada numerada e um carrinho deslizante. Desenvolve conceitos de adição, contagem, reconhecimento de números, coordenação motora fina e resolução de problemas.',
              instructions: [
                'Modo 1 - Com Dados: Jogue os dois dados e escreva os números nos quadrados da equação',
                'Posicione o carrinho no ponto "zero" (antes do número 1)',
                'Dirija o carrinho pelo primeiro número de espaços na estrada',
                'A partir do número onde parou, dirija pelo segundo número de espaços',
                'O carrinho vai parar no resultado da soma!',
                'Escreva o resultado no quadrado da equação',
                'Apague tudo e comece uma nova conta!',
                'Modo 2 - Contas Prontas: Resolva contas escritas por um adulto usando o mesmo método'
              ],
              materials: [
                '1 pedaço de papelão retangular e comprido',
                'Canetão permanente preto',
                'Canetão para quadro branco (apagável) e um pequeno apagador ou pano',
                'Fita adesiva larga e transparente',
                'Barbante',
                'Papel, tesoura e lápis de cor para fazer o carrinho',
                'Cola',
                '2 dados (opcional)',
                'Furadeira ou estilete (para fazer os furos)'
              ],
              categories: ['matemática', 'adição', 'números', 'coordenação', 'educativo', 'cognitivo'],
              duration: 20,
              participants: '1-2',
              difficulty: 'medium',
              min_age: 4,
              max_age: 10,
              rating: 4.9,
              safety_tips: [
                'Supervisione o uso de ferramentas pontiagudas por adultos apenas',
                'Certifique-se de que o barbante está bem fixado para evitar acidentes',
                'Use materiais atóxicos e seguros',
                'Verifique se o carrinho desliza suavemente pelo barbante',
                'Mantenha o espaço organizado para evitar tropeços',
                'Ensine sobre paciência e persistência na resolução de problemas'
              ],
              variations: [
                'Versão com subtração: use a estrada para ensinar subtração',
                'Versão cronômetro: veja quem resolve mais contas em tempo determinado',
                'Versão cooperativa: trabalhem juntos para resolver as contas',
                'Versão com números maiores: estenda a estrada até 20 ou mais',
                'Versão com multiplicação: adapte para ensinar multiplicação',
                'Versão com contas de três números: adicione mais quadrados na equação'
              ],
              image_url: '/Brincadeiras/9..png',
              video_url: '/Brincadeiras/9.mp4',
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 44,
              title: 'Carrinho Foguete a Ar',
              description: 'Brincadeira de engenharia onde as crianças constroem um carrinho movido a ar usando balão e canudo. Desenvolve criatividade, noções de engenharia, compreensão de princípios da física (Ação e Reação - 3ª Lei de Newton) e habilidades manuais.',
              instructions: [
                'Fure a garrafinha para criar os eixos (2 furos na frente, 2 atrás)',
                'Fure o centro de cada tampinha para as rodas',
                'Monte a suspensão passando os palitos pelos furos e encaixando as tampinhas',
                'Crie o motor encaixando a boca do balão na ponta do canudo',
                'Vede bem com fita adesiva para o ar não escapar',
                'Cole o canudo com balão em cima da garrafinha apontando para trás',
                'Assopre pela ponta livre do canudo até encher bem o balão',
                'Tape a ponta do canudo com o dedo para segurar o ar',
                'Faça a contagem regressiva... 3... 2... 1...',
                'Tire o dedo e veja seu carrinho disparar!'
              ],
              materials: [
                '1 garrafinha plástica pequena (de iogurte líquido, por exemplo)',
                '4 tampinhas de garrafa PET (para as rodas)',
                '2 palitos de churrasco (para os eixos)',
                '1 canudo (de preferência um pouco mais rígido)',
                '1 balão (bexiga)',
                'Fita adesiva',
                'Tesoura',
                '1 objeto pontiagudo para furar (como um prego ou a ponta da tesoura)',
                'Superfície lisa para as corridas'
              ],
              categories: ['criatividade', 'engenharia', 'física', 'manuais', 'competição', 'ciência'],
              duration: 15,
              participants: '1+',
              difficulty: 'hard',
              min_age: 6,
              max_age: 12,
              rating: 4.9,
              safety_tips: [
                'Supervisione o uso de objetos pontiagudos por adultos apenas',
                'Certifique-se de que os palitos não têm pontas afiadas',
                'Use uma superfície lisa e livre de obstáculos para as corridas',
                'Mantenha o espaço organizado para evitar tropeços',
                'Ensine sobre paciência e persistência na construção',
                'Verifique se o balão está bem vedado para evitar vazamentos'
              ],
              variations: [
                'Versão competição: organize corridas entre vários carrinhos',
                'Versão cronômetro: veja qual carrinho vai mais longe',
                'Versão cooperativa: trabalhem juntos para construir o melhor carrinho',
                'Versão com diferentes tamanhos: use garrafas maiores ou menores',
                'Versão com decoração: personalize o carrinho com adesivos e cores',
                'Versão com obstáculos: crie uma pista com obstáculos para contornar'
              ],
              image_url: '/Brincadeiras/10..png',
              video_url: '/Brincadeiras/10.mp4',
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 45,
              title: 'Alinhamento Colorido',
              description: 'Brincadeira de sequenciamento onde as crianças devem organizar tampinhas coloridas seguindo um padrão de referência. Desenvolve reconhecimento de cores, raciocínio lógico, sequenciamento, percepção espacial e organização.',
              instructions: [
                'Prepare o gabarito: levante os palitos e coloque as tampinhas nas canaletas separadas por cor',
                'Feche o portão: abaixe os palitos para manter as tampinhas presas como guia de cores',
                'Crie o desafio: pegue uma tampinha de cada cor e coloque-as desordenadas na parte de baixo',
                'Observe a sequência de cores das canaletas na parte de cima (o gabarito)',
                'Arraste as tampinhas soltas na parte de baixo para ficarem na mesma ordem',
                'Continue organizando até a sequência de baixo ficar idêntica à de cima',
                'Quando estiver correto, o desafio está concluído!',
                'Bagunçar as tampinhas de baixo e começar um novo desafio'
              ],
              materials: [
                '1 base de papelão retangular',
                'Tiras de papelão ondulado (para fazer as divisórias)',
                'Tampinhas de garrafa PET de cores variadas (várias unidades de cada cor)',
                '2 palitos de churrasco',
                'Cola quente ou cola forte (para ser usada por um adulto)',
                'Estilete ou objeto pontiagudo para furar (para ser usado por um adulto)',
                'Tesoura para cortar as tiras',
                'Mesa ou superfície plana para apoiar'
              ],
              categories: ['cores', 'sequenciamento', 'lógica', 'espacial', 'organização', 'cognitivo'],
              duration: 5,
              participants: '1',
              difficulty: 'medium',
              min_age: 3,
              max_age: 8,
              rating: 4.8,
              safety_tips: [
                'Supervisione o uso de ferramentas pontiagudas por adultos apenas',
                'Certifique-se de que as tampinhas são grandes o suficiente para não serem engolidas',
                'Use materiais atóxicos e seguros',
                'Verifique se os palitos estão bem fixados para evitar acidentes',
                'Mantenha o espaço organizado para evitar tropeços',
                'Ensine sobre paciência e persistência na organização'
              ],
              variations: [
                'Versão cronômetro: veja quem consegue organizar mais rápido',
                'Versão com mais cores: aumente a dificuldade usando mais cores diferentes',
                'Versão com sequências mais longas: use mais tampinhas de cada cor',
                'Versão cooperativa: trabalhem juntos para organizar as tampinhas',
                'Versão com padrões diferentes: crie sequências alternadas ou repetitivas',
                'Versão com números: substitua cores por números para ensinar sequências numéricas'
              ],
              image_url: '/Brincadeiras/11..png',
              video_url: '/Brincadeiras/11.mp4',
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 46,
              title: 'Guerra de Discos',
              description: 'Brincadeira de ação rápida onde dois jogadores competem para esvaziar seu campo atirando discos através de um gol central usando elásticos. Desenvolve agilidade, reflexos, coordenação olho-mão, precisão e concentração sob pressão.',
              instructions: [
                'Cada jogador fica de um lado do tabuleiro com seus 5 discos coloridos',
                'Ao sinal de "JÁ!", ambos começam a atirar simultaneamente',
                'Para atirar: puxe um disco para trás esticando o elástico e solte',
                'Objetivo: fazer o disco passar pelo "gol" no meio da divisória',
                'Qualquer disco que vier do campo adversário se torna seu para atirar',
                'Continue atirando sem parar até esvaziar seu campo',
                'O GRANDE OBJETIVO: ser o primeiro a limpar completamente seu lado',
                'Quem conseguir esvaziar seu campo primeiro vence a partida!'
              ],
              materials: [
                '1 tampa de caixa de sapatos (ou caixa de papelão baixa e retangular)',
                '1 tira de papelão (para a divisória do meio)',
                '10 círculos (discos) de papelão recortados de outra caixa',
                'Tinta ou canetinhas de 2 cores diferentes',
                'Fio de elástico (lastex) ou elástico fino e comprido',
                'Cola quente ou cola forte (para ser usada por um adulto)',
                'Estilete (para ser usado por um adulto)',
                'Cronômetro (opcional, para cronometrar as partidas)'
              ],
              categories: ['agilidade', 'reflexos', 'coordenação', 'precisão', 'concentração', 'competição'],
              duration: 5,
              participants: '2',
              difficulty: 'hard',
              min_age: 6,
              max_age: 12,
              rating: 4.9,
              safety_tips: [
                'Supervisione o uso do estilete por adultos apenas',
                'Certifique-se de que os discos são grandes o suficiente para não serem engolidos',
                'Use elásticos de boa qualidade para evitar quebras durante o jogo',
                'Mantenha o espaço de jogo livre de obstáculos',
                'Ensine sobre fair play e respeito entre os jogadores',
                'Verifique se a divisória está bem fixada para evitar acidentes'
              ],
              variations: [
                'Versão cronômetro: veja quem consegue mais gols em tempo determinado',
                'Versão com mais discos: aumente a dificuldade usando mais discos',
                'Versão com gols menores: diminua o tamanho do gol para maior desafio',
                'Versão com diferentes tamanhos de discos: varie o desafio',
                'Versão torneio: organize um campeonato entre várias duplas',
                'Versão com obstáculos: adicione pequenos obstáculos no campo'
              ],
              image_url: '/Brincadeiras/12..png',
              video_url: '/Brincadeiras/12.mp4',
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 47,
              title: 'Conexão das Formas',
              description: 'Brincadeira de pareamento onde as crianças conectam formas coloridas usando barbantes, criando um emaranhado de fios que cruzam o tabuleiro. Desenvolve reconhecimento de formas e cores, pareamento, coordenação motora fina e percepção espacial (cruzamento da linha média do corpo).',
              instructions: [
                'Deixe o tabuleiro na frente da criança com todas as peças móveis soltas no meio',
                'Pegue uma das peças móveis (ex: estrela amarela)',
                'Olhe a coluna da direita e encontre a forma fixa correspondente',
                'Quando encontrar o par, estique o fio e coloque a peça móvel em cima da sua gêmea',
                'Repita o processo com todas as outras formas, uma por uma',
                'Continue conectando cada forma ao seu par correspondente',
                'Estique os fios para criar conexões visuais entre as formas',
                'Termine quando todas as formas estiverem conectadas, criando um lindo emaranhado!'
              ],
              materials: [
                '1 base de papelão grande',
                'Folhas de EVA ou cartolina de cores variadas',
                'Barbante ou lã (várias cores)',
                'Cola forte ou pistola de cola quente (para ser usada por um adulto)',
                'Tesoura',
                'Velcro adesivo (opcional, para uma variação do jogo)',
                'Marcadores ou canetinhas (para desenhar as formas)',
                'Régua (para desenhar formas simétricas)'
              ],
              categories: ['formas', 'cores', 'pareamento', 'coordenação', 'espacial', 'cognitivo'],
              duration: 5,
              participants: '1',
              difficulty: 'medium',
              min_age: 3,
              max_age: 8,
              rating: 4.7,
              safety_tips: [
                'Supervisione o uso da tesoura e cola quente por adultos apenas',
                'Certifique-se de que as formas são grandes o suficiente para não serem engolidas',
                'Use materiais atóxicos e seguros',
                'Verifique se os barbantes estão bem fixados para evitar acidentes',
                'Mantenha o espaço organizado para evitar tropeços',
                'Ensine sobre paciência e persistência na conexão das formas'
              ],
              variations: [
                'Versão cronômetro: veja quem consegue conectar todas as formas mais rápido',
                'Versão com mais formas: aumente a dificuldade usando mais tipos de formas',
                'Versão cooperativa: trabalhem juntos para conectar todas as formas',
                'Versão com cores diferentes: use formas da mesma cor mas de tipos diferentes',
                'Versão com sequência: conecte as formas em uma ordem específica',
                'Versão com velcro: use velcro para fixar as formas temporariamente'
              ],
              image_url: '/Brincadeiras/13..png',
              video_url: '/Brincadeiras/13.mp4',
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 48,
              title: 'Estação das Formas',
              description: 'Brincadeira de classificação onde as crianças organizam palitos com formas coloridas em potes correspondentes. Desenvolve classificação por forma e cor, reconhecimento de padrões, associação, concentração e coordenação motora fina.',
              instructions: [
                'Coloque a "Estação das Formas" na frente da criança',
                'Espalhe ou empilhe todos os palitos ao lado da estação',
                'Pegue um palito de cada vez e observe a forma e cor em sua ponta',
                'Procure qual dos potes tem a forma correspondente desenhada',
                'Ao encontrar o pote correto, coloque o palito dentro dele',
                'Continue pegando os próximos palitos e classificando',
                'Repita o processo até todos os palitos estarem organizados',
                'Ao final, todos os triângulos estarão no pote de triângulos, corações no pote de corações, etc!'
              ],
              materials: [
                '1 base de papelão retangular',
                '4 rolos de papel higiênico',
                'Vários palitos de picolé',
                'Folhas de EVA ou cartolina de cores variadas (vermelho, verde, amarelo, azul)',
                'Cola forte ou pistola de cola quente (para ser usada por um adulto)',
                'Tesoura',
                'Marcadores ou canetinhas (para desenhar as formas)',
                'Mesa ou superfície plana para apoiar'
              ],
              categories: ['formas', 'cores', 'classificação', 'padrões', 'associação', 'cognitivo'],
              duration: 10,
              participants: '1',
              difficulty: 'easy',
              min_age: 3,
              max_age: 8,
              rating: 4.8,
              safety_tips: [
                'Supervisione o uso da tesoura e cola quente por adultos apenas',
                'Certifique-se de que as formas são grandes o suficiente para não serem engolidas',
                'Use materiais atóxicos e seguros',
                'Verifique se os rolos estão bem fixados na base',
                'Mantenha o espaço organizado para evitar tropeços',
                'Ensine sobre paciência e persistência na classificação'
              ],
              variations: [
                'Versão cronômetro: veja quem consegue classificar mais rápido',
                'Versão com mais formas: aumente a dificuldade usando mais tipos de formas',
                'Versão cooperativa: trabalhem juntos para classificar todas as formas',
                'Versão com cores diferentes: use formas da mesma cor mas de tipos diferentes',
                'Versão com sequência: classifique as formas em uma ordem específica',
                'Versão com números: substitua formas por números para ensinar classificação numérica'
              ],
              image_url: '/Brincadeiras/14..png',
              video_url: '/Brincadeiras/14.mp4',
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 49,
              title: 'Pinball de Caixa',
              description: 'Brincadeira de fliperama caseiro onde as crianças constroem um pinball usando caixa de papelão e materiais criativos. Desenvolve coordenação motora fina, noção de causa e efeito, contagem e soma de pontos.',
              instructions: [
                'Posicione a bolinha sobre o palito do lançador',
                'Use um dedo para puxar para trás a ponta livre do pregador',
                'Solte o pregador de uma vez para dar impulso na bolinha',
                'A bolinha será atirada com velocidade pela rampa',
                'Observe a bolinha percorrer o caminho e descer pelo campo',
                'A bolinha vai quicar nas paredes até cair em uma das cestas',
                'Anote os pontos que marcou!',
                'Para competir: cada jogador tem direito a 5 lançamentos'
              ],
              materials: [
                '1 tampa de caixa de sapatos ou caixa de papelão rasa',
                'Cartolina branca ou de outras cores',
                '1 pregador de roupa de madeira ou plástico',
                '1 palito de picolé',
                '1 bolinha pequena (de borracha, gude ou miçanga grande)',
                'Canetinhas coloridas',
                'Cola quente (para ser usada por um adulto)',
                'Tesoura',
                'Papel colorido para os marcadores de pontos',
                'Mesa ou superfície plana para apoiar'
              ],
              categories: ['coordenação', 'causa-efeito', 'contagem', 'competição', 'criatividade', 'físico'],
              duration: 10,
              participants: '1+',
              difficulty: 'medium',
              min_age: 5,
              max_age: 12,
              rating: 4.9,
              safety_tips: [
                'Supervisione o uso da cola quente por adultos apenas',
                'Certifique-se de que a bolinha é grande o suficiente para não ser engolida',
                'Use uma superfície estável para apoiar a caixa',
                'Mantenha o espaço livre de obstáculos',
                'Ensine sobre paciência e persistência',
                'Verifique se o pregador está bem fixado para evitar acidentes'
              ],
              variations: [
                'Versão cronômetro: veja quem consegue mais pontos em tempo determinado',
                'Versão com diferentes tamanhos de bolinha: varie o desafio',
                'Versão cooperativa: trabalhem juntos para conseguir a maior pontuação',
                'Versão com obstáculos: adicione pequenos obstáculos no campo',
                'Versão torneio: organize um campeonato entre vários jogadores',
                'Versão com pontuação diferente: cada cesta vale pontos diferentes'
              ],
              image_url: '/Brincadeiras/15..png',
              video_url: '/Brincadeiras/15.mp4',
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 50,
              title: 'Alinha Cor',
              description: 'Brincadeira de precisão onde as crianças encaixam pinos coloridos em furos seguindo padrões desenhados. Desenvolve coordenação motora fina (movimento de pinça), precisão, concentração, reconhecimento de cores e associação de padrões.',
              instructions: [
                'Coloque o tabuleiro na frente da criança',
                'Entregue um potinho com todos os pinos coloridos misturados',
                'Observe o padrão ou as cores desenhadas no tabuleiro',
                'Pegue um pino da cor correspondente a um dos desenhos',
                'Use o movimento de pinça (polegar e indicador) para segurar o pino',
                'Encaixe o pino no furo correto',
                'Continue até que todos os furos do padrão estejam preenchidos',
                'Para recomeçar, retire todos os pinos e embaralhe novamente!'
              ],
              materials: [
                '1 tampa de caixa de sapatos',
                'Pinos coloridos (cotonetes com algodão cortado, pedaços de canudo, refis de caneta vazios ou palitos pintados)',
                'Canetinhas coloridas',
                '1 objeto pontiagudo para fazer os furos (prego pequeno ou furador)',
                'Pote pequeno para guardar os pinos',
                'Mesa ou superfície plana para apoiar'
              ],
              categories: ['cores', 'coordenação', 'precisão', 'concentração', 'padrões', 'pinça'],
              duration: 10,
              participants: '1',
              difficulty: 'medium',
              min_age: 3,
              max_age: 8,
              rating: 4.8,
              safety_tips: [
                'Supervisione o uso do objeto pontiagudo por adultos apenas',
                'Certifique-se de que os pinos são grandes o suficiente para não serem engolidos',
                'Use materiais atóxicos e seguros',
                'Verifique se os furos não têm bordas afiadas',
                'Mantenha o espaço organizado para evitar tropeços',
                'Ensine sobre paciência e persistência na precisão'
              ],
              variations: [
                'Versão cronômetro: veja quem consegue completar o padrão mais rápido',
                'Versão com padrões mais complexos: aumente a dificuldade usando mais cores',
                'Versão cooperativa: trabalhem juntos para completar o padrão',
                'Versão com formas geométricas: crie padrões de triângulos, quadrados, etc.',
                'Versão com letras: use os furos para formar letras do alfabeto',
                'Versão com números: crie padrões numéricos usando os pinos'
              ],
              image_url: '/Brincadeiras/16..png',
              video_url: '/Brincadeiras/16.mp4',
              active: true,
              created_at: new Date().toISOString()
            }
          ]
          
          // Log para debug - VERIFICAÇÃO COMPLETA
          console.log('🎯 CARREGANDO ATIVIDADES:', demoActivities.length)
          console.log('🎬 ATIVIDADES PREMIUM:', demoActivities.filter(a => a.video_url).length)
          console.log('📚 ATIVIDADES TRADICIONAIS:', demoActivities.filter(a => !a.video_url).length)
          console.log('✅ NOVA ATIVIDADE PREMIUM: Encaixe das Caixas de Ovos')
          console.log('🎮 NOVAS ATIVIDADES TRADICIONAIS: 15 brincadeiras clássicas adicionadas')
          console.log('🧠 FOCO: Raciocínio lógico, coordenação motora e pensamento estratégico')
          console.log('🎨 TODAS COM IMAGENS: URLs do Unsplash para visualização')
          console.log('📺 DESENHOS ATUALIZADOS: Bluey, Caillou, Comic, Puffin Rock, Daniel Tigre, Show da Luna, Detetive Labrador, Diário de Mika')
          
          const ligaLetras = demoActivities.find(a => a.title === 'Liga Letras')
          if (ligaLetras) {
            console.log('🔗 LIGA LETRAS CRIADA:', {
              id: ligaLetras.id,
              title: ligaLetras.title,
              duration: ligaLetras.duration,
              min_age: ligaLetras.min_age,
              categories: ligaLetras.categories
            })
          }
          
          const equilibrioFita = demoActivities.find(a => a.title === 'Equilíbrio da Fita')
          if (equilibrioFita) {
            console.log('⚖️ EQUILÍBRIO DA FITA CRIADA:', {
              id: equilibrioFita.id,
              title: equilibrioFita.title,
              duration: equilibrioFita.duration,
              min_age: equilibrioFita.min_age,
              categories: equilibrioFita.categories,
              video_url: equilibrioFita.video_url
            })
          }
          
          const luvaCores = demoActivities.find(a => a.title === 'Luva das Cores')
          if (luvaCores) {
            console.log('🧤 LUVA DAS CORES CRIADA:', {
              id: luvaCores.id,
              title: luvaCores.title,
              duration: luvaCores.duration,
              min_age: luvaCores.min_age,
              categories: luvaCores.categories,
              video_url: luvaCores.video_url
            })
          }
          
          const cordaGuia = demoActivities.find(a => a.title === 'Desafio da Corda Guia')
          if (cordaGuia) {
            console.log('🎯 DESAFIO DA CORDA GUIA CRIADA:', {
              id: cordaGuia.id,
              title: cordaGuia.title,
              duration: cordaGuia.duration,
              min_age: cordaGuia.min_age,
              categories: cordaGuia.categories,
              difficulty: cordaGuia.difficulty,
              video_url: cordaGuia.video_url
            })
          }
          
          const pincaDedoes = demoActivities.find(a => a.title === 'Pinça dos Dedões')
          if (pincaDedoes) {
            console.log('🤏 PINÇA DOS DEDÕES CRIADA:', {
              id: pincaDedoes.id,
              title: pincaDedoes.title,
              duration: pincaDedoes.duration,
              min_age: pincaDedoes.min_age,
              categories: pincaDedoes.categories,
              difficulty: pincaDedoes.difficulty,
              video_url: pincaDedoes.video_url
            })
          }
          
          const resgateBonecos = demoActivities.find(a => a.title === 'Resgate dos Bonecos')
          if (resgateBonecos) {
            console.log('🎭 RESGATE DOS BONECOS CRIADA:', {
              id: resgateBonecos.id,
              title: resgateBonecos.title,
              duration: resgateBonecos.duration,
              min_age: resgateBonecos.min_age,
              categories: resgateBonecos.categories,
              difficulty: resgateBonecos.difficulty,
              video_url: resgateBonecos.video_url,
              image_url: resgateBonecos.image_url
            })
          }
          
          
          const cacaTesouro = demoActivities.find(a => a.title === 'Caça ao Tesouro Lógico')
          if (cacaTesouro) {
            console.log('🏴‍☠️ CAÇA AO TESOURO LÓGICO CRIADA:', {
              id: cacaTesouro.id,
              title: cacaTesouro.title,
              duration: cacaTesouro.duration,
              min_age: cacaTesouro.min_age,
              categories: cacaTesouro.categories,
              difficulty: cacaTesouro.difficulty,
              video_url: cacaTesouro.video_url,
              image_url: cacaTesouro.image_url
            })
          }
          
          // Atualização completa
          set({ 
            activities: demoActivities,
            cachedData: { 
              activities: demoActivities,
              lastUpdated: new Date().toISOString()
            }
          })
          
          // DEBUG: Log todas as atividades com imagens
          console.log('🖼️ ATIVIDADES COM IMAGENS:', demoActivities
            .filter(a => a.image_url || a.image)
            .map(a => ({ title: a.title, image_url: a.image_url, image: a.image }))
          )
          
          return { data: demoActivities, error: null }
        }
        
        try {
          const { data, error } = await supabase
            .from('activities')
            .select('*')
            .eq('active', true)
            .order('created_at', { ascending: false })
          
          if (error) throw error
          
          set({ activities: data })
          
          // Atualizar cache offline
          set({ 
            cachedData: { 
              ...get().cachedData, 
              activities: data,
              lastUpdated: new Date().toISOString()
            }
          })
          
          return { data, error: null }
        } catch (error) {
          console.error('Erro ao carregar brincadeiras:', error)
          // Em caso de erro, usar dados do cache
          const cachedActivities = get().cachedData.activities
          if (cachedActivities.length > 0) {
            set({ activities: cachedActivities })
          }
          return { data: null, error }
        }
      },

      // Actions de desenhos
      setCartoons: (cartoons) => set({ cartoons }),
      
      loadCartoons: async () => {
        if (!supabase) {
          // Dados de demonstração para os 8 desenhos especificados
          const demoCartoons = [
            {
              id: 1,
              title: 'Bluey',
              description: 'Aventuras da cachorrinha Bluey e sua família que ensinam sobre criatividade, amizade, resolução de problemas e vida familiar. Cada episódio traz lições valiosas sobre relacionamentos e desenvolvimento emocional.',
              category: 'educational',
              min_age: 2,
              max_age: 7,
              duration: 22,
              rating: 4.9,
              image: '/desenhos/bluey/blueycapa.jpeg',
              thumbnail_url: '/desenhos/bluey/blueycapa.jpeg',
              gallery: [
                '/desenhos/bluey/blueycapa.jpeg',
                '/desenhos/bluey/bluey1.jpeg',
                '/desenhos/bluey/bluey2.jpeg',
                '/desenhos/bluey/bluey3.jpeg',
                '/desenhos/bluey/bluey4.jpeg',
                '/desenhos/bluey/bluey5.jpeg',
                '/desenhos/bluey/bluey6.jpeg'
              ],
              video_url: 'https://youtu.be/4-W8mS24aGc?si=uqpBq2Ld1F79J9s7',
              watch_platforms: [
                {
                  name: 'YouTube',
                  url: 'https://youtu.be/4-W8mS24aGc?si=uqpBq2Ld1F79J9s7',
                  type: 'free',
                  icon: '▶️',
                  description: 'Episódios gratuitos no YouTube'
                },
                {
                  name: 'TV Cultura',
                  type: 'tv',
                  icon: '📺',
                  description: 'Canal aberto - horários variados'
                },
                {
                  name: 'Disney+',
                  type: 'streaming',
                  icon: '🏰',
                  description: 'Todos os episódios disponíveis'
                },
                {
                  name: 'Amazon Prime Video',
                  type: 'streaming',
                  icon: '📦',
                  description: 'Temporadas completas'
                }
              ]
            },
            {
              id: 2,
              title: 'Caillou',
              description: 'Histórias do garotinho de 4 anos que explora o mundo ao seu redor. Ensina sobre curiosidade, aprendizado, família e como lidar com diferentes situações do dia a dia.',
              category: 'educational',
              min_age: 2,
              max_age: 6,
              duration: 25,
              rating: 4.7,
              image: '/desenhos/caillou/fotodecapa.jpeg',
              thumbnail_url: '/desenhos/caillou/fotodecapa.jpeg',
              gallery: [
                '/desenhos/caillou/fotodecapa.jpeg',
                '/desenhos/caillou/caillou1.jpeg',
                '/desenhos/caillou/caillou2.jpeg',
                '/desenhos/caillou/caillou3.jpeg',
                '/desenhos/caillou/caillou4.jpeg'
              ],
              video_url: 'https://youtu.be/W8nBWjLzOuM?si=4jFAEkZ73Mq5lGoZ',
              watch_platforms: [
                {
                  name: 'YouTube',
                  url: 'https://youtu.be/W8nBWjLzOuM?si=4jFAEkZ73Mq5lGoZ',
                  type: 'free',
                  icon: '▶️',
                  description: 'Episódios gratuitos no YouTube'
                },
                {
                  name: 'TV Cultura',
                  type: 'tv',
                  icon: '📺',
                  description: 'Canal aberto - manhãs e tardes'
                },
                {
                  name: 'Pluto TV',
                  type: 'free',
                  icon: '🆓',
                  description: 'Canal 24h gratuito'
                },
                {
                  name: 'Paramount+',
                  type: 'streaming',
                  icon: '⭐',
                  description: 'Todas as temporadas'
                }
              ]
            },
            {
              id: 3,
              title: 'Puffin Rock',
              description: 'Aventuras suaves e educativas na ilha de Puffin Rock, onde as crianças aprendem sobre natureza, animais e o mundo ao seu redor de forma gentil e relaxante.',
              category: 'educational',
              min_age: 2,
              max_age: 6,
              duration: 15,
              rating: 4.6,
              image: '/desenhos/puffin/imagemdecapa.jpeg',
              thumbnail_url: '/desenhos/puffin/imagemdecapa.jpeg',
              gallery: [
                '/desenhos/puffin/imagemdecapa.jpeg',
                '/desenhos/puffin/puffin1.jpeg',
                '/desenhos/puffin/puffin2.jpeg',
                '/desenhos/puffin/puffin3.jpeg',
                '/desenhos/puffin/puffin4.jpeg',
                '/desenhos/puffin/puffin5.jpeg'
              ],
              video_url: 'https://youtu.be/IY-CN54eASg?si=2Ia7DFl3mzGCTmJz',
              watch_platforms: [
                {
                  name: 'YouTube',
                  url: 'https://youtu.be/IY-CN54eASg?si=2Ia7DFl3mzGCTmJz',
                  type: 'free',
                  icon: '▶️',
                  description: 'Episódios gratuitos no YouTube'
                },
                {
                  name: 'Netflix Kids',
                  type: 'streaming',
                  icon: '🎬',
                  description: 'Série completa disponível'
                },
                {
                  name: 'RTE Player',
                  type: 'free',
                  icon: '📺',
                  description: 'Canal oficial irlandês'
                },
                {
                  name: 'Amazon Prime Video',
                  type: 'streaming',
                  icon: '📦',
                  description: 'Temporadas disponíveis'
                }
              ]
            },
            {
              id: 4,
              title: 'Daniel Tigre',
              description: 'Série que ensina sobre emoções, desenvolvimento social e habilidades de vida. Daniel aprende a lidar com diferentes sentimentos e situações com a ajuda de sua família e amigos.',
              category: 'educational',
              min_age: 2,
              max_age: 5,
              duration: 25,
              rating: 4.8,
              image: '/desenhos/Daniel tigre/imagemdecapa.jpeg',
              thumbnail_url: '/desenhos/Daniel tigre/imagemdecapa.jpeg',
              gallery: [
                '/desenhos/Daniel tigre/imagemdecapa.jpeg',
                '/desenhos/Daniel tigre/daniel1.jpeg',
                '/desenhos/Daniel tigre/daniel2.jpeg',
                '/desenhos/Daniel tigre/daniel3.jpeg',
                '/desenhos/Daniel tigre/daniel4.jpeg'
              ],
              video_url: 'https://youtu.be/dW6lfOV5vis?si=bh4y0luJ3RmdBoX9',
              watch_platforms: [
                {
                  name: 'YouTube',
                  url: 'https://youtu.be/dW6lfOV5vis?si=bh4y0luJ3RmdBoX9',
                  type: 'free',
                  icon: '▶️',
                  description: 'Episódios gratuitos no YouTube'
                },
                {
                  name: 'PBS Kids',
                  type: 'free',
                  icon: '📚',
                  description: 'Canal oficial PBS Kids'
                },
                {
                  name: 'Amazon Prime Video',
                  type: 'streaming',
                  icon: '📦',
                  description: 'Temporadas completas'
                },
                {
                  name: 'Paramount+',
                  type: 'streaming',
                  icon: '⭐',
                  description: 'Biblioteca completa'
                }
              ]
            },
            {
              id: 5,
              title: 'Show da Luna',
              description: 'Aventuras da menina Luna que explora o mundo da ciência de forma divertida e acessível. Ensina conceitos científicos básicos através de experiências e descobertas.',
              category: 'educational',
              min_age: 3,
              max_age: 8,
              duration: 30,
              rating: 4.7,
              image: '/desenhos/luna/imagemdecapa.jpeg',
              thumbnail_url: '/desenhos/luna/imagemdecapa.jpeg',
              gallery: [
                '/desenhos/luna/imagemdecapa.jpeg',
                '/desenhos/luna/luna1.jpeg',
                '/desenhos/luna/luna2.jpeg',
                '/desenhos/luna/luna3.jpeg',
                '/desenhos/luna/luna4.jpeg',
                '/desenhos/luna/luna5.jpeg'
              ],
              video_url: 'https://youtu.be/QIoK32NhaPw?si=6JyauOz-II1wIOPb',
              watch_platforms: [
                {
                  name: 'YouTube',
                  url: 'https://youtu.be/QIoK32NhaPw?si=6JyauOz-II1wIOPb',
                  type: 'free',
                  icon: '▶️',
                  description: 'Episódios gratuitos no YouTube'
                },
                {
                  name: 'TV Cultura',
                  type: 'tv',
                  icon: '📺',
                  description: 'Canal brasileiro - programação infantil'
                },
                {
                  name: 'Discovery Kids',
                  type: 'tv',
                  icon: '🔬',
                  description: 'Canal especializado em educação'
                },
                {
                  name: 'Globo Play',
                  type: 'streaming',
                  icon: '🌐',
                  description: 'Temporadas disponíveis'
                }
              ]
            },
            {
              id: 6,
              title: 'Diário da Mika',
              description: 'Histórias da menina Mika que compartilha suas experiências, sonhos e aventuras através de seu diário. Ensina sobre expressão criativa, autoconhecimento e desenvolvimento pessoal.',
              category: 'creative',
              min_age: 3,
              max_age: 7,
              duration: 20,
              rating: 4.5,
              image: '/desenhos/diario da mika/mika-capa.jpeg',
              thumbnail_url: '/desenhos/diario da mika/mika-capa.jpeg',
              gallery: [
                '/desenhos/diario da mika/mika-capa.jpeg',
                '/desenhos/diario da mika/o-diário-de-mika-.jpg',
                '/desenhos/diario da mika/mika-diary-banner.jpg',
                '/desenhos/diario da mika/20210902155644_capa-de-nota-5-.png',
                '/desenhos/diario da mika/Promo-Mika_2_01482-e1439248916561.png',
                '/desenhos/diario da mika/partner-background-original.jpg',
                '/desenhos/diario da mika/63f70940aeac40722905dc362090ebb3b103c4fdb5693b478e74ab628ff74be5._SX1080_FMjpg_.jpg'
              ],
              video_url: 'https://youtu.be/0QyBh0J3aAU?si=8LxcqeNRgaMDue_P',
              watch_platforms: [
                {
                  name: 'YouTube',
                  url: 'https://youtu.be/0QyBh0J3aAU?si=8LxcqeNRgaMDue_P',
                  type: 'free',
                  icon: '▶️',
                  description: 'Episódios gratuitos no YouTube'
                },
                {
                  name: 'TV Cultura',
                  type: 'tv',
                  icon: '📺',
                  description: 'Canal aberto - programação infantil'
                },
                {
                  name: 'Globo Play',
                  type: 'streaming',
                  icon: '🌐',
                  description: 'Temporadas disponíveis'
                },
                {
                  name: 'Amazon Prime Video',
                  type: 'streaming',
                  icon: '📦',
                  description: 'Conteúdo infantil'
                }
              ]
            },
            {
              id: 7,
              title: 'Urso',
              description: 'Aventuras do Urso e seus amigos que ensinam sobre amizade, resolução de problemas, criatividade e valores importantes da vida. Cada episódio traz lições valiosas sobre relacionamentos e desenvolvimento emocional através de histórias envolventes.',
              category: 'educational',
              min_age: 2,
              max_age: 8,
              duration: 25,
              rating: 4.7,
              image: '/desenhos/urso.png',
              thumbnail_url: '/desenhos/urso.png',
              gallery: [
                '/desenhos/urso.png'
              ],
              video_url: 'https://youtu.be/JGxU4F08fd8?si=ggX2DzQENRYsFDqN',
              watch_platforms: [
                {
                  name: 'YouTube',
                  url: 'https://youtu.be/JGxU4F08fd8?si=ggX2DzQENRYsFDqN',
                  type: 'free',
                  icon: '▶️',
                  description: 'Episódios gratuitos no YouTube'
                },
                {
                  name: 'TV Cultura',
                  type: 'tv',
                  icon: '📺',
                  description: 'Canal aberto - horários variados'
                },
                {
                  name: 'Disney+',
                  type: 'streaming',
                  icon: '🏰',
                  description: 'Todos os episódios disponíveis'
                },
                {
                  name: 'Amazon Prime Video',
                  type: 'streaming',
                  icon: '📦',
                  description: 'Temporadas completas'
                }
              ]
            },
            {
              id: 8,
              title: 'Zé Coleta',
              description: 'Aventuras do Zé Coleta que ensinam sobre sustentabilidade, reciclagem, cuidado com o meio ambiente e responsabilidade social. Cada episódio traz lições valiosas sobre preservação ambiental e consciência ecológica de forma divertida e educativa.',
              category: 'educational',
              min_age: 3,
              max_age: 10,
              duration: 8,
              rating: 4.6,
              image: '/desenhos/zé coleta.png',
              thumbnail_url: '/desenhos/zé coleta.png',
              gallery: [
                '/desenhos/zé coleta.png'
              ],
              video_url: 'https://youtu.be/DRxLfe1ft9M?si=tguDkLAMqb4wage8',
              watch_platforms: [
                {
                  name: 'YouTube',
                  url: 'https://youtu.be/DRxLfe1ft9M?si=tguDkLAMqb4wage8',
                  type: 'free',
                  icon: '▶️',
                  description: 'Episódios gratuitos no YouTube'
                },
                {
                  name: 'TV Cultura',
                  type: 'tv',
                  icon: '📺',
                  description: 'Canal aberto - programação educativa'
                },
                {
                  name: 'Globo Play',
                  type: 'streaming',
                  icon: '🌐',
                  description: 'Conteúdo educativo disponível'
                },
                {
                  name: 'Amazon Prime Video',
                  type: 'streaming',
                  icon: '📦',
                  description: 'Séries educativas'
                }
              ]
            },
            {
              id: 9,
              title: 'Sara e o Pato',
              description: 'Aventuras da Sara e seu amigo pato que ensinam sobre amizade, imaginação, criatividade e descobertas do mundo ao redor. Cada episódio traz lições valiosas sobre relacionamentos, curiosidade e desenvolvimento social de forma lúdica e envolvente.',
              category: 'educational',
              min_age: 2,
              max_age: 6,
              duration: 2,
              rating: 4.5,
              image: '/desenhos/sara e o pato.png',
              thumbnail_url: '/desenhos/sara e o pato.png',
              gallery: [
                '/desenhos/sara e o pato.png'
              ],
              video_url: 'https://youtu.be/ZMhp9uJ5VuE?si=qoE4Y6HCa-ubFDcX',
              watch_platforms: [
                {
                  name: 'YouTube',
                  url: 'https://youtu.be/ZMhp9uJ5VuE?si=qoE4Y6HCa-ubFDcX',
                  type: 'free',
                  icon: '▶️',
                  description: 'Episódios gratuitos no YouTube'
                },
                {
                  name: 'TV Cultura',
                  type: 'tv',
                  icon: '📺',
                  description: 'Canal aberto - programação infantil'
                },
                {
                  name: 'Globo Play',
                  type: 'streaming',
                  icon: '🌐',
                  description: 'Conteúdo educativo disponível'
                },
                {
                  name: 'Amazon Prime Video',
                  type: 'streaming',
                  icon: '📦',
                  description: 'Séries educativas'
                }
              ]
            },
            {
              id: 10,
              title: 'Pooh',
              description: 'As clássicas aventuras do Ursinho Pooh e seus amigos na Floresta dos Cem Acres que ensinam sobre amizade, bondade, imaginação e valores importantes da vida. Cada episódio traz lições valiosas sobre relacionamentos, resolução de problemas e desenvolvimento emocional através de histórias atemporais e encantadoras.',
              category: 'educational',
              min_age: 2,
              max_age: 10,
              duration: 60,
              rating: 4.8,
              image: '/desenhos/pooh.png',
              thumbnail_url: '/desenhos/pooh.png',
              gallery: [
                '/desenhos/pooh.png'
              ],
              video_url: 'https://www.youtube.com/watch?v=p6cS3B3upZc',
              watch_platforms: [
                {
                  name: 'YouTube',
                  url: 'https://www.youtube.com/watch?v=p6cS3B3upZc',
                  type: 'free',
                  icon: '▶️',
                  description: 'Episódios gratuitos no YouTube'
                },
                {
                  name: 'Disney+',
                  type: 'streaming',
                  icon: '🏰',
                  description: 'Todos os episódios disponíveis'
                },
                {
                  name: 'TV Cultura',
                  type: 'tv',
                  icon: '📺',
                  description: 'Canal aberto - programação infantil'
                },
                {
                  name: 'Amazon Prime Video',
                  type: 'streaming',
                  icon: '📦',
                  description: 'Temporadas completas'
                }
              ]
            },
            {
              id: 11,
              title: 'Milly e Molly',
              description: 'Aventuras das irmãs Milly e Molly que ensinam sobre amizade, cooperação, resolução de problemas e valores familiares. Cada episódio traz lições valiosas sobre relacionamentos fraternais, trabalho em equipe e desenvolvimento social através de histórias envolventes e educativas.',
              category: 'educational',
              min_age: 3,
              max_age: 8,
              duration: 15,
              rating: 4.4,
              image: '/desenhos/milly-e-molly.png',
              thumbnail_url: '/desenhos/milly-e-molly.png',
              gallery: [
                '/desenhos/milly-e-molly.png'
              ],
              video_url: 'https://www.youtube.com/watch?v=KIWJ0gSUC4o&t=4s',
              watch_platforms: [
                {
                  name: 'YouTube',
                  url: 'https://www.youtube.com/watch?v=KIWJ0gSUC4o&t=4s',
                  type: 'free',
                  icon: '▶️',
                  description: 'Episódios gratuitos no YouTube'
                },
                {
                  name: 'TV Cultura',
                  type: 'tv',
                  icon: '📺',
                  description: 'Canal aberto - programação infantil'
                },
                {
                  name: 'Globo Play',
                  type: 'streaming',
                  icon: '🌐',
                  description: 'Conteúdo educativo disponível'
                },
                {
                  name: 'Amazon Prime Video',
                  type: 'streaming',
                  icon: '📦',
                  description: 'Séries educativas'
                }
              ]
            },
            {
              id: 12,
              title: 'Cocorico',
              description: 'Aventuras do galo Cocorico que ensinam sobre responsabilidade, pontualidade, rotina e valores importantes do dia a dia. Cada episódio traz lições valiosas sobre organização, disciplina e desenvolvimento de hábitos saudáveis de forma divertida e educativa.',
              category: 'educational',
              min_age: 2,
              max_age: 6,
              duration: 2,
              rating: 4.3,
              image: '/desenhos/cocorico.png',
              thumbnail_url: '/desenhos/cocorico.png',
              gallery: [
                '/desenhos/cocorico.png'
              ],
              video_url: 'https://youtu.be/gA9fVuPFmOE?si=QCuwLEVipeIKg06g',
              watch_platforms: [
                {
                  name: 'YouTube',
                  url: 'https://youtu.be/gA9fVuPFmOE?si=QCuwLEVipeIKg06g',
                  type: 'free',
                  icon: '▶️',
                  description: 'Episódios gratuitos no YouTube'
                },
                {
                  name: 'TV Cultura',
                  type: 'tv',
                  icon: '📺',
                  description: 'Canal aberto - programação infantil'
                },
                {
                  name: 'Globo Play',
                  type: 'streaming',
                  icon: '🌐',
                  description: 'Conteúdo educativo disponível'
                },
                {
                  name: 'Amazon Prime Video',
                  type: 'streaming',
                  icon: '📦',
                  description: 'Séries educativas'
                }
              ]
            },
            {
              id: 13,
              title: 'Pocoyo',
              description: 'As aventuras do Pocoyo e seus amigos que ensinam sobre descobertas, amizade, criatividade e resolução de problemas através de histórias interativas e educativas. Cada episódio traz lições valiosas sobre desenvolvimento social, curiosidade e aprendizado de forma lúdica e envolvente.',
              category: 'educational',
              min_age: 1,
              max_age: 5,
              duration: 120,
              rating: 4.9,
              image: '/desenhos/banner-pocoyo-1.png',
              thumbnail_url: '/desenhos/banner-pocoyo-1.png',
              gallery: [
                '/desenhos/banner-pocoyo-1.png'
              ],
              video_url: 'https://youtu.be/o4yHIhafsw0?si=9062DycxPvOl0Laj',
              watch_platforms: [
                {
                  name: 'YouTube',
                  url: 'https://youtu.be/o4yHIhafsw0?si=9062DycxPvOl0Laj',
                  type: 'free',
                  icon: '▶️',
                  description: 'Episódios gratuitos no YouTube'
                },
                {
                  name: 'Netflix',
                  type: 'streaming',
                  icon: '🎬',
                  description: 'Temporadas completas disponíveis'
                },
                {
                  name: 'TV Cultura',
                  type: 'tv',
                  icon: '📺',
                  description: 'Canal aberto - programação infantil'
                },
                {
                  name: 'Amazon Prime Video',
                  type: 'streaming',
                  icon: '📦',
                  description: 'Conteúdo educativo'
                }
              ]
            },
            {
              id: 14,
              title: 'Auts',
              description: 'Aventuras dos personagens Auts que ensinam sobre inclusão, diversidade, aceitação e desenvolvimento social. Cada episódio traz lições valiosas sobre empatia, respeito às diferenças e construção de uma sociedade mais inclusiva de forma educativa e sensibilizadora.',
              category: 'educational',
              min_age: 4,
              max_age: 12,
              duration: 3,
              rating: 4.7,
              image: '/desenhos/auts.png',
              thumbnail_url: '/desenhos/auts.png',
              gallery: [
                '/desenhos/auts.png'
              ],
              video_url: 'https://youtu.be/SJfVGbfBu9g?si=E5EEfmCPoibEoB4S',
              watch_platforms: [
                {
                  name: 'YouTube',
                  url: 'https://youtu.be/SJfVGbfBu9g?si=E5EEfmCPoibEoB4S',
                  type: 'free',
                  icon: '▶️',
                  description: 'Episódios gratuitos no YouTube'
                },
                {
                  name: 'TV Cultura',
                  type: 'tv',
                  icon: '📺',
                  description: 'Canal aberto - programação educativa'
                },
                {
                  name: 'Globo Play',
                  type: 'streaming',
                  icon: '🌐',
                  description: 'Conteúdo educativo disponível'
                },
                {
                  name: 'Amazon Prime Video',
                  type: 'streaming',
                  icon: '📦',
                  description: 'Séries educativas'
                }
              ]
            }
          ]
          
          set({ cartoons: demoCartoons })
          set({ 
            cachedData: { 
              ...get().cachedData, 
              cartoons: demoCartoons,
              lastUpdated: new Date().toISOString()
            }
          })
          
          return { data: demoCartoons, error: null }
        }
        
        try {
          const { data, error } = await supabase
            .from('cartoons')
            .select('*')
            .eq('active', true)
            .order('title', { ascending: true })
          
          if (error) throw error
          
          set({ cartoons: data })
          
          // Atualizar cache offline
          set({ 
            cachedData: { 
              ...get().cachedData, 
              cartoons: data,
              lastUpdated: new Date().toISOString()
            }
          })
          
          return { data, error: null }
        } catch (error) {
          console.error('Erro ao carregar desenhos:', error)
          const cachedCartoons = get().cachedData.cartoons
          if (cachedCartoons.length > 0) {
            set({ cartoons: cachedCartoons })
          }
          return { data: null, error }
        }
      },

      // Actions de favoritos
      setFavorites: (favorites) => set({ favorites }),
      
      loadFavorites: async () => {
        const { user } = get()
        if (!user) return { error: 'Usuário não autenticado' }
        
        try {
          const { data, error } = await supabase
            .from('user_favorites')
            .select(`
              *,
              activities (*),
              cartoons (*)
            `)
            .eq('user_id', user.id)
          
          if (error) throw error
          
          set({ favorites: data })
          return { data, error: null }
        } catch (error) {
          console.error('Erro ao carregar favoritos:', error)
          return { data: null, error }
        }
      },
      
      addToFavorites: async (type, itemId) => {
        const { user } = get()
        if (!user) return { error: 'Usuário não autenticado' }
        
        try {
          const { data, error } = await supabase
            .from('user_favorites')
            .insert({
              user_id: user.id,
              type: type, // 'activity' ou 'cartoon'
              activity_id: type === 'activity' ? itemId : null,
              cartoon_id: type === 'cartoon' ? itemId : null
            })
            .select()
            .single()
          
          if (error) throw error
          
          // Recarregar favoritos
          get().loadFavorites()
          return { data, error: null }
        } catch (error) {
          console.error('Erro ao adicionar favorito:', error)
          return { data: null, error }
        }
      },
      
      removeFromFavorites: async (type, itemId) => {
        const { user } = get()
        if (!user) return { error: 'Usuário não autenticado' }
        
        try {
          const query = supabase
            .from('user_favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('type', type)
          
          if (type === 'activity') {
            query.eq('activity_id', itemId)
          } else {
            query.eq('cartoon_id', itemId)
          }
          
          const { error } = await query
          if (error) throw error
          
          // Recarregar favoritos
          get().loadFavorites()
          return { error: null }
        } catch (error) {
          console.error('Erro ao remover favorito:', error)
          return { error }
        }
      },

      // Função utilitária para verificar se item está favoritado
      isFavorite: (type, itemId) => {
        const { favorites } = get()
        return favorites.some(fav => 
          fav.type === type && 
          (type === 'activity' ? fav.activity_id === itemId : fav.cartoon_id === itemId)
        )
      },

      // Inicializar dados da aplicação
      initializeApp: async () => {
        console.log('🚀 INICIALIZANDO APLICATIVO...')
        console.log('👤 USUÁRIO ATUAL:', get().user)
        console.log('🔐 AUTENTICADO:', get().isAuthenticated)
        set({ isLoading: true })
        
        try {
          console.log('📊 CARREGANDO DADOS PRINCIPAIS...')
          // Carregar dados principais
          await Promise.all([
            get().loadActivities(),
            get().loadCartoons()
          ])
          
          console.log('👶 CARREGANDO DADOS DE DESENVOLVIMENTO...')
          // Carregar dados de desenvolvimento da criança
          get().loadChildDevelopment()
          
          // Se usuário autenticado, carregar dados pessoais
          const { user } = get()
          if (user) {
            console.log('👤 CARREGANDO DADOS PESSOAIS...')
            await Promise.all([
              get().loadFavorites(),
              get().loadChildProfile()
            ])
          }
          
          // Verificar se precisa resetar dados semanais
          const current = get().childDevelopment
          if (current.lastUpdated) {
            const lastUpdate = new Date(current.lastUpdated)
            const now = new Date()
            const daysDiff = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24))
            
            if (daysDiff >= 7) {
              get().resetWeeklyData()
            }
          }
        } catch (error) {
          console.error('❌ ERRO AO INICIALIZAR APP:', error)
        } finally {
          console.log('✅ INICIALIZAÇÃO CONCLUÍDA')
          set({ isLoading: false })
        }
      },

      // Carregar perfil da criança
      loadChildProfile: async () => {
        const { user } = get()
        if (!user) return { error: 'Usuário não autenticado' }
        
        try {
          const { data, error } = await supabase
            .from('children_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()
          
          if (error && error.code !== 'PGRST116') {
            throw error
          }
          
          set({ child: data })
          return { data, error: null }
        } catch (error) {
          console.error('Erro ao carregar perfil da criança:', error)
          return { data: null, error }
        }
      }
    }),
    {
      name: 'brincafacil-store',
      partialize: (state) => ({
        cachedData: state.cachedData,
        child: state.child
        // Não persistir user, isAuthenticated, isLoading - sempre iniciar deslogado
      })
    }
  )
)

export default useAppStore
