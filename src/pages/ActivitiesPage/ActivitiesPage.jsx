import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Search, Filter, X, Shuffle, Brain, Sparkles, Heart } from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import ActivityCard from '../../components/ActivityCard/ActivityCard'


const ActivitiesPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { activities, child, loadActivities } = useAppStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilters, setSelectedFilters] = useState([])
  const [selectedDuration, setSelectedDuration] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedParticipants, setSelectedParticipants] = useState('all')
  const [selectedSpace, setSelectedSpace] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [filteredActivities, setFilteredActivities] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('recommended')
  const [activeCategory, setActiveCategory] = useState('all')
  


  // Novos filtros objetivos por benefício e perfil da criança
  const objectiveFilters = [
    // Filtros por objetivo/benefício
    { 
      category: 'Desenvolver Habilidades',
      filters: [
        { id: 'coordenação', label: 'Treinar Coordenação', emoji: '🤹', description: 'Melhora coordenação motora' },
        { id: 'memória', label: 'Fortalecer Memória', emoji: '🧠', description: 'Exercita a memória e concentração' },
        { id: 'criatividade', label: 'Estimular Criatividade', emoji: '🎨', description: 'Desenvolve imaginação e arte' },
        { id: 'socialização', label: 'Melhorar Socialização', emoji: '👥', description: 'Ensina interação social' }
      ]
    },
    // Filtros por perfil da criança
    { 
      category: 'Perfil da Criança',
      filters: [
        { id: 'agitado', label: 'Criança Agitada', emoji: '⚡', description: 'Para gastar energia' },
        { id: 'calmo', label: 'Acalmar a Criança', emoji: '😌', description: 'Atividades relaxantes' },
        { id: 'timido', label: 'Criança Tímida', emoji: '😊', description: 'Desenvolve confiança' },
        { id: 'curioso', label: 'Criança Curiosa', emoji: '🔍', description: 'Explora e descobre' }
      ]
    },
    // Filtros por situação
    { 
      category: 'Situação',
      filters: [
        { id: 'casa', label: 'Dentro de Casa', emoji: '🏠', description: 'Para dias chuvosos' },
        { id: 'quintal', label: 'No Quintal', emoji: '🌳', description: 'Atividades ao ar livre' },
        { id: 'rapido', label: 'Tempo Limitado', emoji: '⏰', description: 'Até 15 minutos' },
        { id: 'longo', label: 'Mais Tempo', emoji: '🕐', description: 'Mais de 30 minutos' }
      ]
    }
  ]

  const sortOptions = [
    { id: 'recommended', label: 'Recomendadas' },
    { id: 'duration', label: 'Duração' },
    { id: 'difficulty', label: 'Dificuldade' },
    { id: 'rating', label: 'Avaliação' },
    { id: 'alphabetical', label: 'A-Z' }
  ]

  const difficultyOptions = [
    { id: 'all', label: 'Todas' },
    { id: 'easy', label: 'Fácil' },
    { id: 'medium', label: 'Médio' },
    { id: 'hard', label: 'Difícil' }
  ]

  const durationOptions = [
    { id: 'all', label: 'Qualquer duração' },
    { id: '0-15', label: 'Até 15 min' },
    { id: '15-30', label: '15-30 min' },
    { id: '30-60', label: '30-60 min' },
    { id: '60+', label: 'Mais de 1h' }
  ]

  const participantOptions = [
    { id: 'all', label: 'Qualquer quantidade' },
    { id: '1', label: 'Individual' },
    { id: '2', label: 'Em dupla' },
    { id: '3+', label: 'Em grupo' }
  ]

  const spaceOptions = [
    { id: 'all', label: 'Qualquer espaço' },
    { id: 'small', label: 'Espaço pequeno' },
    { id: 'medium', label: 'Espaço médio' },
    { id: 'large', label: 'Espaço amplo' }
  ]

  const typeOptions = [
    { id: 'all', label: 'Todas' },
    { id: 'normal', label: 'Normal (com foto)', emoji: '📸' }
  ]

  const specialCategories = [
    { 
      id: 'all', 
      label: 'Todas', 
      emoji: '🎯', 
      description: 'Todas as brincadeiras',
      color: 'from-gray-500 to-gray-600'
    },
    { 
      id: 'normal', 
      label: 'Tradicionais', 
      emoji: '📸', 
      description: 'Brincadeiras clássicas',
      color: 'from-blue-500 to-cyan-600'
    },
    { 
      id: 'favorites', 
      label: 'Favoritas', 
      emoji: '❤️', 
      description: 'Mais curtidas pelas crianças',
      color: 'from-red-500 to-pink-600'
    }
  ]

  useEffect(() => {
    // Verificar se há filtro na URL
    const urlParams = new URLSearchParams(location.search)
    const filterParam = urlParams.get('filter')
    
    if (filterParam && !selectedFilters.includes(filterParam)) {
      setSelectedFilters([filterParam])
    }
  }, [location.search])

  useEffect(() => {
    loadActivities()
  }, [loadActivities])

  // DEBUG: Log todas as atividades carregadas
  useEffect(() => {
    if (activities.length > 0) {
      console.log('🔍 TODAS AS ATIVIDADES CARREGADAS:', activities.length)
      console.log('🎬 ATIVIDADES COM VÍDEO:', activities.filter(a => a.video_url).map(a => ({
        id: a.id,
        title: a.title,
        video_url: a.video_url
      })))
      
      const memoriaRelampago = activities.find(a => a.title === 'Memória Relâmpago')
      if (memoriaRelampago) {
        console.log('✅ MEMÓRIA RELÂMPAGO ENCONTRADA:', memoriaRelampago)
      } else {
        console.log('❌ MEMÓRIA RELÂMPAGO NÃO ENCONTRADA!')
        console.log('📋 Lista de títulos:', activities.map(a => a.title))
      }
      
      // DEBUG: Verificar as novas brincadeiras
      const equilibrioFita = activities.find(a => a.title === 'Equilíbrio da Fita')
      if (equilibrioFita) {
        console.log('⚖️ EQUILÍBRIO DA FITA ENCONTRADA:', equilibrioFita)
      } else {
        console.log('❌ EQUILÍBRIO DA FITA NÃO ENCONTRADA!')
      }
      
      const luvaCores = activities.find(a => a.title === 'Luva das Cores')
      if (luvaCores) {
        console.log('🧤 LUVA DAS CORES ENCONTRADA:', luvaCores)
      } else {
        console.log('❌ LUVA DAS CORES NÃO ENCONTRADA!')
      }
      
      const cordaGuia = activities.find(a => a.title === 'Desafio da Corda Guia')
      if (cordaGuia) {
        console.log('🎯 DESAFIO DA CORDA GUIA ENCONTRADA:', cordaGuia)
      } else {
        console.log('❌ DESAFIO DA CORDA GUIA NÃO ENCONTRADA!')
      }
      
      const pincaDedoes = activities.find(a => a.title === 'Pinça dos Dedões')
      if (pincaDedoes) {
        console.log('🤏 PINÇA DOS DEDÕES ENCONTRADA:', pincaDedoes)
      } else {
        console.log('❌ PINÇA DOS DEDÕES NÃO ENCONTRADA!')
      }
      
      const resgateBonecos = activities.find(a => a.title === 'Resgate dos Bonecos')
      if (resgateBonecos) {
        console.log('🎭 RESGATE DOS BONECOS ENCONTRADA:', resgateBonecos)
      } else {
        console.log('❌ RESGATE DOS BONECOS NÃO ENCONTRADA!')
        console.log('📋 Lista completa de títulos:', activities.map(a => a.title))
      }
    }
  }, [activities])

  // Garantir que TODAS as atividades apareçam por padrão
  useEffect(() => {
    if (activities.length > 0) {
      console.log('🔄 INICIALIZANDO ATIVIDADES:', activities.length)
      setFilteredActivities(activities)
    }
  }, [activities])

  // Aplicar filtros apenas quando necessário
  useEffect(() => {
    if (activities.length > 0) {
      applyFiltersAndSort()
    }
  }, [searchTerm, selectedFilters, selectedDuration, selectedDifficulty, selectedParticipants, selectedSpace, selectedType, activeCategory, sortBy])

  const applyFiltersAndSort = () => {
    let filtered = [...activities]
    
    console.log('🔍 APLICANDO FILTROS:', {
      totalActivities: activities.length,
      selectedFilters,
      searchTerm,
      selectedDuration,
      selectedDifficulty,
      selectedParticipants,
      selectedSpace,
      selectedType,
      activeCategory
    })

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      console.log('🔍 Após busca:', filtered.length, 'atividades')
    }

    // Novos filtros objetivos + tags
    if (selectedFilters.length > 0) {
      console.log('🎯 Aplicando filtros objetivos:', selectedFilters)
      
      filtered = filtered.filter(activity => {
        const tags = (activity.tags || []).map(t => String(t).toLowerCase())
        const title = (activity.title || '').toLowerCase()
        const matchesFilter = selectedFilters.some(filter => {
          // Mapeamento dos novos filtros para as categorias existentes
          const filterMapping = {
            // Desenvolver Habilidades
            'coordenação': [
              'coordenação', 'motor', 'physical', 'coordination', 'fine-motor', 
              'physical', 'coordination', 'fine-motor', 'pinça', 'equilíbrio',
              'coordenação-motora', 'coordenação-motora-fina', 'movimento-pinça',
              'coordenação-motora-ampla', 'agilidade', 'precisão', 'destreza-manual'
            ],
            'memória': [
              'memória', 'memory', 'cognitive', 'cognitivo', 'focus', 'concentration',
              'sequential', 'visual', 'detail-oriented', 'persistence', 'concentração',
              'memória-visual', 'sequência', 'padrões', 'reconhecimento'
            ],
            'criatividade': [
              'creative', 'criatividade', 'art', 'creative', 'colors', 'imagination',
              'criatividade', 'arte', 'cores', 'imaginação', 'expressão-criativa',
              'desenho', 'pintura', 'construção', 'invenção'
            ],
            'socialização': [
              'social', 'socialização', 'interaction', 'social', 'competição', 'competition',
              'social', 'interação', 'trabalho-em-equipe', 'cooperação', 'comunicação',
              'relacionamentos', 'amizade', 'colaboração'
            ],
            
            // Perfil da Criança
            'agitado': [
              'energy', 'physical', 'motor', 'competição', 'competition', 'quick-thinking',
              'physical', 'coordination', 'competition', 'quick-thinking', 'agilidade',
              'energia', 'movimento', 'atividade-física', 'competitivo', 'rápido'
            ],
            'calmo': [
              'quiet', 'calm', 'relaxing', 'meditation', 'indoor', 'concentration',
              'indoor', 'quiet', 'concentration', 'focus', 'calm', 'tranquilo',
              'concentração', 'paciência', 'relaxante', 'silencioso'
            ],
            'timido': [
              'confidence', 'social', 'self-esteem', 'social', 'socialização',
              'interaction', 'relacionamentos', 'amizade', 'confiança', 'autoestima',
              'comunicação', 'expressão', 'desenvolvimento-social'
            ],
            'curioso': [
              'learning', 'educational', 'discovery', 'observação', 'observation', 'problem-solving',
              'educational', 'learning', 'discovery', 'problem-solving', 'observação',
              'curiosidade', 'exploração', 'descoberta', 'investigação', 'aprendizado'
            ],
            
            // Situação
            'casa': [
              'indoor', 'casa', 'educational', 'fine-motor', 'indoor', 'quiet',
              'logic', 'indoor', 'concentration', 'memory', 'traditional', 'coordination',
              'visual', 'spatial', 'problem-solving', 'traditional', 'physical',
              'strategic', 'traditional', 'social', 'fine-motor', 'sequential',
              'traditional', 'coordination', 'engineering', 'traditional', 'fine-motor',
              'spatial', 'observation', 'memory', 'traditional', 'detail-oriented',
              'logic', 'traditional', 'spatial', 'persistence', 'casa', 'interior'
            ],
            'indoor': [
              'indoor', 'casa', 'educational', 'fine-motor', 'indoor', 'quiet',
              'logic', 'indoor', 'concentration', 'memory', 'traditional', 'coordination',
              'visual', 'spatial', 'problem-solving', 'traditional', 'physical',
              'strategic', 'traditional', 'social', 'fine-motor', 'sequential',
              'traditional', 'coordination', 'engineering', 'traditional', 'fine-motor',
              'spatial', 'observation', 'memory', 'traditional', 'detail-oriented',
              'logic', 'traditional', 'spatial', 'persistence', 'casa', 'interior'
            ],
            'quintal': [
              'outdoor', 'quintal', 'physical', 'coordination', 'traditional',
              'physical', 'educational', 'coordination', 'outdoor', 'exterior',
              'ar-livre', 'natureza', 'espaço-amplo', 'atividades-externas'
            ],
            'rapido': activity.duration <= 15,
            'longo': activity.duration >= 30
          }
          
          if (filter === 'rapido') {
            const quickTitles = ['pinça dos dedões', 'pinça dos dedoes', 'jogo das varetas', 'jogo de varetas']
            if (quickTitles.some(q => title.includes(q))) return true
            return (activity.duration || 0) <= 15
          }
          if (filter === 'longo') {
            return activity.duration >= 30
          }
          
          const mappedCategories = filterMapping[filter]
          if (Array.isArray(mappedCategories)) {
            const hasMatch = (activity.categories || []).some(cat => 
              mappedCategories.includes(String(cat).toLowerCase())
            ) || mappedCategories.some(m => tags.includes(String(m).toLowerCase()))
            if (!hasMatch && filter === 'quintal') {
              const yardTitles = [
                'amarelinha', 'caça ao tesouro', 'caca ao tesouro', 'construção de torre', 
                'construcao de torre', 'construção de torres', 'circuito', 'corrida', 
                'estrada', 'carrinho', 'foguete', 'guerra', 'discos'
              ]
              if (yardTitles.some(y => title.includes(y))) return true
            }
            if (!hasMatch && filter === 'indoor') {
              const indoorTitles = [
                'memória', 'puzzle', 'quebra-cabeça', 'desenho', 'pintura', 'lego', 
                'bloco', 'construção', 'jogo de tabuleiro', 'dominó', 'cartas',
                'pinça', 'pinball', 'labirinto', 'cascata', 'soma', 'alinhamento',
                'conexão', 'estação', 'código', 'encaixe', 'pescador', 'argolas'
              ]
              if (indoorTitles.some(i => title.includes(i))) return true
            }
            if (!hasMatch && filter === 'coordenação') {
              const coordinationTitles = [
                'pinça', 'equilíbrio', 'coordenação', 'motor', 'fina', 'ampla',
                'agilidade', 'precisão', 'destreza', 'movimento', 'pinball',
                'labirinto', 'cascata', 'alinhamento', 'conexão', 'encaixe',
                'pescador', 'argolas', 'circuito', 'carrinho', 'foguete'
              ]
              if (coordinationTitles.some(c => title.includes(c))) return true
            }
            if (!hasMatch && filter === 'memória') {
              const memoryTitles = [
                'memória', 'sequência', 'padrões', 'reconhecimento', 'visual',
                'concentração', 'foco', 'persistência', 'código', 'cores',
                'alinhamento', 'conexão', 'formas'
              ]
              if (memoryTitles.some(m => title.includes(m))) return true
            }
            if (!hasMatch && filter === 'criatividade') {
              const creativityTitles = [
                'criatividade', 'arte', 'cores', 'imaginação', 'expressão',
                'desenho', 'pintura', 'construção', 'invenção', 'código',
                'conexão', 'formas', 'alinhamento', 'carrinho', 'foguete'
              ]
              if (creativityTitles.some(c => title.includes(c))) return true
            }
            if (!hasMatch && filter === 'socialização') {
              const socialTitles = [
                'social', 'interação', 'trabalho-em-equipe', 'cooperação',
                'comunicação', 'relacionamentos', 'amizade', 'colaboração',
                'competição', 'pebolim', 'guerra', 'discos', 'circuito'
              ]
              if (socialTitles.some(s => title.includes(s))) return true
            }
            if (!hasMatch && filter === 'agitado') {
              const activeTitles = [
                'energia', 'movimento', 'atividade-física', 'competitivo',
                'rápido', 'agilidade', 'circuito', 'corrida', 'carrinho',
                'foguete', 'guerra', 'discos', 'pebolim', 'cascata'
              ]
              if (activeTitles.some(a => title.includes(a))) return true
            }
            if (!hasMatch && filter === 'calmo') {
              const calmTitles = [
                'concentração', 'paciência', 'relaxante', 'silencioso',
                'tranquilo', 'código', 'cores', 'alinhamento', 'conexão',
                'formas', 'pinça', 'memória', 'puzzle', 'quebra-cabeça'
              ]
              if (calmTitles.some(c => title.includes(c))) return true
            }
            if (!hasMatch && filter === 'timido') {
              const confidenceTitles = [
                'confiança', 'autoestima', 'comunicação', 'expressão',
                'desenvolvimento-social', 'social', 'interação', 'amizade',
                'relacionamentos', 'colaboração', 'trabalho-em-equipe'
              ]
              if (confidenceTitles.some(c => title.includes(c))) return true
            }
            if (!hasMatch && filter === 'curioso') {
              const curiousTitles = [
                'curiosidade', 'exploração', 'descoberta', 'investigação',
                'aprendizado', 'código', 'cores', 'conexão', 'formas',
                'circuito', 'carrinho', 'foguete', 'labirinto', 'cascata'
              ]
              if (curiousTitles.some(c => title.includes(c))) return true
            }
            if (hasMatch) {
              console.log(`✅ ${activity.title} - Filtro "${filter}" - Categorias:`, activity.categories)
            }
            return hasMatch
          }
          
          return false
        })
        
        if (!matchesFilter) {
          console.log(`❌ ${activity.title} - NÃO atende aos filtros selecionados`)
        }
        
        return matchesFilter
      })
      
      console.log('🎯 Após filtros objetivos:', filtered.length, 'atividades')
    }
    
    // Filtro por categoria especial (normal)
    if (activeCategory !== 'all') {
      filtered = filtered.filter(activity => {
        if (activeCategory === 'normal') {
          return !activity.video_url
        }
        return true
      })
      console.log('🏷️ Após filtro de categoria:', filtered.length, 'atividades')
    }

    // Filtro por idade da criança
    if (child?.age) {
      filtered = filtered.filter(activity => {
        if (activity.min_age && child.age < activity.min_age) return false
        if (activity.max_age && child.age > activity.max_age) return false
        return true
      })
      console.log('👶 Após filtro de idade:', filtered.length, 'atividades')
    }

    // Filtro por duração
    if (selectedDuration !== 'all') {
      filtered = filtered.filter(activity => {
        const duration = activity.duration || 15
        switch (selectedDuration) {
          case '0-15':
            return duration <= 15
          case '15-30':
            return duration > 15 && duration <= 30
          case '30-60':
            return duration > 30 && duration <= 60
          case '60+':
            return duration > 60
          default:
            return true
        }
      })
      console.log('⏰ Após filtro de duração:', filtered.length, 'atividades')
    }

    // Filtro por dificuldade
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(activity => activity.difficulty === selectedDifficulty)
      console.log('🎯 Após filtro de dificuldade:', filtered.length, 'atividades')
    }

    // Filtro por participantes
    if (selectedParticipants !== 'all') {
      filtered = filtered.filter(activity => {
        const participants = activity.participants || '1'
        const participantNumber = parseInt(participants.replace(/[^0-9]/g, ''))
        
        switch (selectedParticipants) {
          case '1':
            return participantNumber === 1 || participants.includes('1')
          case '2':
            return participantNumber === 2 || participants.includes('2')
          case '3+':
            return participantNumber >= 3 || participants.includes('+') || participants.includes('grupo')
          default:
            return true
        }
      })
      console.log('👥 Após filtro de participantes:', filtered.length, 'atividades')
    }

    // Filtro por espaço
    if (selectedSpace !== 'all') {
      filtered = filtered.filter(activity => activity.space === selectedSpace || !activity.space)
      console.log('🏠 Após filtro de espaço:', filtered.length, 'atividades')
    }

    // Filtro por tipo (Normal)
    if (selectedType !== 'all') {
      filtered = filtered.filter(activity => {
        if (selectedType === 'normal') {
          return !activity.video_url // Não tem vídeo = Normal
        }
        return true
      })
      console.log('🎬 Após filtro de tipo:', filtered.length, 'atividades')
    }

    // Filtro por categoria especial
    if (activeCategory !== 'all') {
      filtered = filtered.filter(activity => {
        let shouldInclude = false
        switch (activeCategory) {
          case 'normal':
            shouldInclude = !activity.video_url
            break
          case 'favorites':
            shouldInclude = activity.rating >= 4.5
            break
          default:
            shouldInclude = true
        }
        return shouldInclude
      })
      console.log('🏷️ Após filtro de categoria especial:', filtered.length, 'atividades')
    }

    // Ordenação
    switch (sortBy) {
      case 'duration':
        filtered.sort((a, b) => (a.duration || 15) - (b.duration || 15))
        break
      case 'difficulty':
        const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
        filtered.sort((a, b) => 
          (difficultyOrder[a.difficulty] || 2) - (difficultyOrder[b.difficulty] || 2)
        )
        break
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'recommended':
      default:
        // Ordenar por relevância baseada nos interesses da criança
        if (child?.interests && child.interests.length > 0) {
          filtered.sort((a, b) => {
            const aMatches = a.categories?.filter(cat => child.interests.includes(cat)).length || 0
            const bMatches = b.categories?.filter(cat => child.interests.includes(cat)).length || 0
            return bMatches - aMatches
          })
        }
        break
    }

    console.log('🎉 RESULTADO FINAL:', filtered.length, 'atividades filtradas')
    setFilteredActivities(filtered)
  }

  const toggleFilter = (filterId) => {
    setSelectedFilters(prev => 
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    )
  }

  const clearFilters = () => {
    console.log('🧹 LIMPANDO TODOS OS FILTROS')
    setSelectedFilters([])
    setSearchTerm('')
    setSelectedDuration('all')
    setSelectedDifficulty('all')
    setSelectedParticipants('all')
    setSelectedSpace('all')
    setSelectedType('all')
    setActiveCategory('all')
    // Forçar exibição de todas as atividades
    setFilteredActivities(activities)
  }



  const getActiveFiltersCount = () => {
    let count = selectedFilters.length
    if (selectedDuration !== 'all') count++
    if (selectedDifficulty !== 'all') count++
    if (selectedParticipants !== 'all') count++
    if (selectedSpace !== 'all') count++
    if (selectedType !== 'all') count++
    if (activeCategory !== 'all') count++
    return count
  }

  const getRandomActivity = () => {
    if (filteredActivities.length === 0) return
    const randomIndex = Math.floor(Math.random() * filteredActivities.length)
    const randomActivity = filteredActivities[randomIndex]
    navigate(`/activities/${randomActivity.id}`)
  }

  return (
    <div className="container-app py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Brincadeiras 🎯
          </h1>
          <p className="text-gray-600 text-sm">
            {filteredActivities.length} atividades encontradas
          </p>
        </div>
        

        
        <button
          onClick={getRandomActivity}
          disabled={filteredActivities.length === 0}
          className="p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Atividade surpresa"
        >
          <Shuffle size={20} />
        </button>
      </div>

      {/* Botão de Filtro Chamativo */}
      <div className="space-y-4">
        {/* Botão Principal de Filtros */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`relative overflow-hidden rounded-2xl p-4 text-center transition-all duration-300 transform hover:scale-105 ${
            showFilters ? 'ring-2 ring-orange-400 shadow-xl' : 'shadow-lg hover:shadow-xl'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 opacity-95"></div>
          <div className="relative z-10 text-white">
            <div className="flex items-center justify-center mb-2">
              <Filter size={24} className="mr-2" />
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="font-bold text-base mb-1">Encontre a Brincadeira Perfeita</h3>
            <p className="text-xs text-white/90 mb-2">
              Use nossos filtros inteligentes para encontrar atividades ideais para seu filho
              {selectedFilters.length > 0 && (
                <span className="block mt-1 text-orange-200 font-medium">
                  {selectedFilters.length} filtro{selectedFilters.length > 1 ? 's' : ''} ativo{selectedFilters.length > 1 ? 's' : ''}
                </span>
              )}
            </p>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xs bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 font-medium">
                {filteredActivities.length} atividades
              </span>
            </div>
          </div>
          
          {showFilters && (
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          )}
        </button>
      </div>

      {/* Popup de Filtros Interativo */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Header do Popup */}
            <div className="sticky top-0 bg-gradient-to-r from-orange-400 to-orange-600 text-white p-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-2">🎯 Filtros Inteligentes</h2>
                  <p className="text-orange-100">
                    Selecione os filtros que melhor atendem às necessidades do seu filho
                  </p>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Conteúdo dos Filtros */}
            <div className="p-6 space-y-8">
              {/* Filtros por Desenvolver Habilidades */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-2xl mr-3">🧠</span>
                  Desenvolver Habilidades
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {objectiveFilters[0].filters.map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => toggleFilter(filter.id)}
                      className={`relative group p-4 rounded-2xl text-center transition-all duration-300 transform hover:scale-105 ${
                        selectedFilters.includes(filter.id)
                          ? 'bg-orange-500 text-white shadow-lg ring-2 ring-orange-300'
                          : 'bg-gray-50 text-gray-700 hover:bg-orange-50 hover:border-orange-200 border-2 border-transparent'
                      }`}
                    >
                      <span className="text-3xl block mb-2">{filter.emoji}</span>
                      <h4 className="font-bold text-sm mb-1">{filter.label}</h4>
                      <p className={`text-xs ${
                        selectedFilters.includes(filter.id) ? 'text-orange-100' : 'text-gray-500'
                      }`}>
                        {filter.description}
                      </p>
                      {selectedFilters.includes(filter.id) && (
                        <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtros por Perfil da Criança */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-2xl mr-3">👶</span>
                  Perfil da Criança
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {objectiveFilters[1].filters.map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => toggleFilter(filter.id)}
                      className={`relative group p-4 rounded-2xl text-center transition-all duration-300 transform hover:scale-105 ${
                        selectedFilters.includes(filter.id)
                          ? 'bg-orange-500 text-white shadow-lg ring-2 ring-orange-300'
                          : 'bg-gray-50 text-gray-700 hover:bg-orange-50 hover:border-orange-200 border-2 border-transparent'
                      }`}
                    >
                      <span className="text-3xl block mb-2">{filter.emoji}</span>
                      <h4 className="font-bold text-sm mb-1">{filter.label}</h4>
                      <p className={`text-xs ${
                        selectedFilters.includes(filter.id) ? 'text-orange-100' : 'text-gray-500'
                      }`}>
                        {filter.description}
                      </p>
                      {selectedFilters.includes(filter.id) && (
                        <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtros por Situação */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-2xl mr-3">🏠</span>
                  Situação
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {objectiveFilters[2].filters.map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => toggleFilter(filter.id)}
                      className={`relative group p-4 rounded-2xl text-center transition-all duration-300 transform hover:scale-105 ${
                        selectedFilters.includes(filter.id)
                          ? 'bg-orange-500 text-white shadow-lg ring-2 ring-orange-300'
                          : 'bg-gray-50 text-gray-700 hover:bg-orange-50 hover:border-orange-200 border-2 border-transparent'
                      }`}
                    >
                      <span className="text-3xl block mb-2">{filter.emoji}</span>
                      <h4 className="font-bold text-sm mb-1">{filter.label}</h4>
                      <p className={`text-xs ${
                        selectedFilters.includes(filter.id) ? 'text-orange-100' : 'text-gray-500'
                      }`}>
                        {filter.description}
                      </p>
                      {selectedFilters.includes(filter.id) && (
                        <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer com Ações */}
            <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-3xl border-t">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedFilters.length} filtro{selectedFilters.length !== 1 ? 's' : ''} selecionado{selectedFilters.length !== 1 ? 's' : ''}
                  </span>
                  {selectedFilters.length > 0 && (
                    <button
                      onClick={() => setSelectedFilters([])}
                      className="text-orange-600 hover:text-orange-700 text-sm font-medium underline"
                    >
                      Limpar todos
                    </button>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
                  >
                    Aplicar Filtros
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar brincadeiras..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-12 pr-4"
        />
      </div>

      {/* Filtros e Ordenação */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-colors ${
            getActiveFiltersCount() > 0 || showFilters
              ? 'bg-primary-500 text-white'
              : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          <Filter size={16} />
          <span>Filtros</span>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {getActiveFiltersCount()}
            </span>
          )}
        </button>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:border-primary-500"
        >
          {sortOptions.map(option => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Painel de Filtros - REMOVIDO - Agora usa popup interativo */}

      {/* Filtros Ativos */}
      {selectedFilters.length > 0 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <span className="text-sm font-medium text-gray-600 flex-shrink-0">
            Filtros ativos:
          </span>
          {selectedFilters.map(filterId => {
            // Buscar o filtro nos novos filtros objetivos
            let filter = null
            objectiveFilters.forEach(category => {
              const found = category.filters.find(f => f.id === filterId)
              if (found) filter = found
            })
            
            return (
              <button
                key={filterId}
                onClick={() => toggleFilter(filterId)}
                className="flex items-center space-x-1 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium flex-shrink-0"
              >
                <span>{filter?.emoji}</span>
                <span>{filter?.label}</span>
                <X size={14} />
              </button>
            )
          })}
        </div>
      )}





      {/* Lista de Atividades */}
      {filteredActivities.length > 0 ? (
        <div className="grid gap-4">
          {filteredActivities.map(activity => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium mb-2">Nenhuma brincadeira encontrada</h3>
          <p className="text-sm mb-4">
            Tente ajustar os filtros ou buscar por outros termos
          </p>
          <button
            onClick={clearFilters}
            className="btn-primary"
          >
            Limpar filtros
          </button>
          <div className="mt-6 text-sm text-gray-500">
            Em breve teremos muito mais brincadeiras! ✨
          </div>
          


        </div>
      )}


    </div>
  )
}

export default ActivitiesPage
