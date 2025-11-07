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

      {/* Desenho Recomendado para a Criança */}
      {filteredCartoons.length > 0 && (
        <div 
          onClick={handleFeaturedCartoonClick}
          className="relative overflow-hidden rounded-3xl bg-white cursor-pointer transition-all duration-300 hover:scale-[1.01] shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] border-[3px] border-orange-400"
        >
          {/* Badge de Recomendação */}
          <div className="bg-gradient-to-r from-orange-400 to-pink-500 px-5 py-3">
            <div className="flex items-center space-x-2">
              <Sparkles size={18} className="text-white animate-pulse" />
              <span className="text-white text-sm font-bold">
                {child ? `Recomendado para ${child.name}` : 'Recomendado'}
              </span>
            </div>
          </div>

          {/* Container Principal */}
          <div className="p-5">
            <div className="flex items-center space-x-4">
              {/* Imagem do Desenho */}
              <div className="relative flex-shrink-0">
                <div className="w-28 h-28 bg-white rounded-2xl overflow-hidden shadow-md border-2 border-gray-100">
                  {filteredCartoons[0].thumbnail_url || filteredCartoons[0].image ? (
                    <img 
                      src={filteredCartoons[0].thumbnail_url || filteredCartoons[0].image} 
                      alt={filteredCartoons[0].title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-orange-50 to-pink-50">
                      📺
                    </div>
                  )}
                </div>
              </div>

              {/* Informações do Desenho */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl text-gray-900 mb-1.5 line-clamp-1">
                  {filteredCartoons[0].title}
                </h3>
                <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">
                  {filteredCartoons[0].description || 'Aventuras incríveis e educativas!'}
                </p>
                
                {/* Metadados */}
                <div className="flex items-center space-x-3">
                  {filteredCartoons[0].duration && (
                    <div className="flex items-center space-x-1.5 bg-blue-50 px-2.5 py-1.5 rounded-lg">
                      <Clock size={14} className="text-blue-600" />
                      <span className="text-xs font-semibold text-blue-700">{filteredCartoons[0].duration} min</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1.5 bg-orange-50 px-2.5 py-1.5 rounded-lg">
                    <span className="text-sm">👶</span>
                    <span className="text-xs font-semibold text-orange-700">
                      {filteredCartoons[0].min_age && filteredCartoons[0].max_age
                        ? `${filteredCartoons[0].min_age}-${filteredCartoons[0].max_age} anos`
                        : 'Todas'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botão Play */}
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
                  <Play size={22} className="text-white fill-white ml-0.5" />
                </div>
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


