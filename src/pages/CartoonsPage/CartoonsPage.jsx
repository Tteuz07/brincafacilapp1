import React, { useState, useEffect } from 'react'
import { Search, Play, Clock, Sparkles, Heart, Brain } from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import CartoonCard from '../../components/CartoonCard/CartoonCard'
import CartoonModal from '../../components/CartoonModal/CartoonModal'


const CartoonsPage = () => {
  const { cartoons, child, loadCartoons } = useAppStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCartoons, setFilteredCartoons] = useState([])
  const [selectedCartoon, setSelectedCartoon] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  



  useEffect(() => {
    if (cartoons.length === 0) {
      loadCartoons()
    }
  }, [cartoons.length, loadCartoons])

  useEffect(() => {
    applyFilters()
  }, [cartoons, searchTerm])

  const applyFilters = () => {
    let filtered = [...cartoons]

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(cartoon =>
        cartoon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cartoon.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Ordenar por adequação à idade da criança se ela estiver configurada
    if (child?.age) {
      filtered.sort((a, b) => {
        const aFits = (!a.min_age || child.age >= a.min_age) && (!a.max_age || child.age <= a.max_age)
        const bFits = (!b.min_age || child.age >= b.min_age) && (!b.max_age || child.age <= b.max_age)
        
        if (aFits && !bFits) return -1
        if (!aFits && bFits) return 1
        return 0
      })
    }

    setFilteredCartoons(filtered)
  }

  const handleFeaturedCartoonClick = () => {
    if (filteredCartoons.length > 0) {
      setSelectedCartoon(filteredCartoons[0])
      setIsModalOpen(true)
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
  }



  return (
    <div className="container-app py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Desenhos Animados 📺
        </h1>
        <p className="text-gray-600 text-sm">
          {filteredCartoons.length} desenhos disponíveis
        </p>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar desenhos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-12 pr-4"
        />
      </div>

      {/* Desenho em Destaque */}
      {filteredCartoons.length > 0 && (
        <div 
          onClick={handleFeaturedCartoonClick}
          className="relative overflow-hidden rounded-2xl p-6 text-white cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 opacity-90"></div>
          <div className="relative z-10">
            {/* Header do Card */}
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl">✨</span>
              <span className="text-sm font-medium uppercase tracking-wide">
                Em Destaque
              </span>
            </div>
            
            {/* Conteúdo Principal */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center text-3xl overflow-hidden flex-shrink-0">
                {filteredCartoons[0].thumbnail_url || filteredCartoons[0].image ? (
                  <img 
                    src={filteredCartoons[0].thumbnail_url || filteredCartoons[0].image} 
                    alt={filteredCartoons[0].title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  '📺'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl mb-2 line-clamp-2">{filteredCartoons[0].title}</h3>
                <p className="text-purple-100 text-sm line-clamp-2">
                  {filteredCartoons[0].description || 'Desenho perfeito para relaxar e se divertir!'}
                </p>
              </div>
            </div>
            
            {/* Footer do Card */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm">
                {filteredCartoons[0].duration && (
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span>{filteredCartoons[0].duration} min</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <span>👶</span>
                  <span>
                    {filteredCartoons[0].min_age && filteredCartoons[0].max_age
                      ? `${filteredCartoons[0].min_age}-${filteredCartoons[0].max_age} anos`
                      : 'Todas as idades'}
                  </span>
                </div>
              </div>
              
              {/* Botão Play */}
              <div className="bg-white text-purple-500 p-3 rounded-xl hover:bg-purple-50 transition-colors">
                <Play size={20} />
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Desenho em Destaque - REMOVIDO - Agora está no grid com o botão de filtros */}

      {/* Lista de Desenhos */}
      {filteredCartoons.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {filteredCartoons.map(cartoon => (
            <CartoonCard 
              key={cartoon.id} 
              cartoon={cartoon} 
              compact 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">📺</div>
          <h3 className="text-lg font-medium mb-2">Nenhum desenho encontrado</h3>
          <p className="text-sm mb-4">
            Tente buscar por outros termos
          </p>
          <button
            onClick={clearFilters}
            className="btn-primary"
          >
            Limpar busca
          </button>
        </div>
      )}

      {/* Recomendações Personalizadas */}
      {child && filteredCartoons.length > 0 && (
        <div className="card bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <h3 className="font-bold mb-2 flex items-center space-x-2">
            <span>🎯</span>
            <span>Perfeito para {child.name}</span>
          </h3>
          <p className="text-blue-100 text-sm mb-4">
            Baseado na idade de {child.age} anos, selecionamos conteúdos calmos que promovem bem-estar emocional e aprendizado gentil.
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Dica:</span>
            <span className="text-blue-100 text-sm">
              Assista junto para uma experiência ainda melhor! 👨‍👩‍👧
            </span>
          </div>
        </div>
      )}

      {/* Informações sobre Conteúdo Calmo */}
      <div className="card border-l-4 border-l-green-400 bg-green-50">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">🌱</div>
          <div>
            <h4 className="font-bold text-green-800 mb-2">Conteúdo de Baixa Estimulação</h4>
            <p className="text-green-700 text-sm mb-2">
              Nossos desenhos são cuidadosamente selecionados para:
            </p>
            <ul className="text-green-700 text-sm space-y-1">
              <li>• Promover calma e regulação emocional</li>
              <li>• Usar música suave e ritmo lento</li>
              <li>• Ensinar habilidades sociais e emocionais</li>
              <li>• Estimular a imaginação sem superexcitação</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Informações sobre Tempo de Tela */}
      <div className="card border-l-4 border-l-orange-400 bg-orange-50">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">💡</div>
          <div>
            <h4 className="font-bold text-orange-800 mb-2">Tempo de Tela Saudável</h4>
            <p className="text-orange-700 text-sm">
              A Academia Americana de Pediatria recomenda:
            </p>
            <ul className="text-orange-700 text-sm mt-2 space-y-1">
              <li>• 2-3 anos: máximo 1 hora por dia</li>
              <li>• 4-5 anos: máximo 1-2 horas por dia</li>
              <li>• 6+ anos: tempo limitado com supervisão</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal */}
      <CartoonModal 
        cartoon={selectedCartoon}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedCartoon(null)
        }}
      />


    </div>
  )
}

export default CartoonsPage


