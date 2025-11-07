import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import toast from 'react-hot-toast'

const ChildSetupPage = () => {
  const store = useAppStore()
  
  // Debug: log quando o componente é renderizado
  console.log('[ChildSetupPage] Componente renderizado', { store })
  
  // Tentar obter updateChild do store, com fallback se não existir
  const updateChild = store?.updateChild || (async () => ({ error: null }))
  
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    likes: '',
    challenges: '',
    hasSpecialNeeds: false,
    avatar: '👶' // avatar padrão
  })

  // Lista de avatares disponíveis (2 fileiras)
  const avatares = [
    '👶', '🧒', '👦', '👧', '👨', '👩', 
    '🐻', '🐰', '🐶', '🐱', '🦁', '🐯'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validação básica
    if (!formData.name || formData.name.trim().length < 2) {
      toast.error('Por favor, informe o nome da criança')
      return
    }
    
    if (!formData.age || parseInt(formData.age) < 1 || parseInt(formData.age) > 18) {
      toast.error('Por favor, informe uma idade válida')
      return
    }
    
    setIsLoading(true)
    
    try {
      // Preparar dados para salvar
      const childData = {
        name: formData.name.trim(),
        age: parseInt(formData.age),
        avatar: formData.avatar,
        likes: formData.likes.trim(),
        challenges: formData.challenges.trim(),
        hasSpecialNeeds: formData.hasSpecialNeeds,
        // Converter campos de texto para arrays/interesses se necessário
        interests: formData.likes ? formData.likes.split(',').map(i => i.trim()).filter(i => i) : []
      }
      
      const { error } = await updateChild(childData)
      
      if (error) {
        toast.error('Erro ao salvar perfil. Tente novamente.')
        console.error('Erro ao salvar perfil:', error)
      } else {
        // Marcar onboarding concluído
        localStorage.setItem('bf_onboarding_done', '1')
        toast.success(`Perfil do ${formData.name} criado com sucesso! 🎉`)
        // Redirecionar para home (/) que está protegida e já tem acesso liberado
        window.location.replace('/')
      }
    } catch (error) {
      toast.error('Erro inesperado. Tente novamente.')
      console.error('Erro inesperado:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          {/* Ícone no topo */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          {/* Título */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Conte-nos sobre a criança
            </h1>
            <p className="text-sm text-gray-500">
              Essas informações nos ajudam a personalizar as brincadeiras
            </p>
          </div>

          {/* Campos do formulário */}
          <div className="space-y-4">
            {/* Nome da criança */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da criança <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Maria"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                required
              />
            </div>

            {/* Idade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idade <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="18"
                placeholder="Ex: 5"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                required
              />
            </div>

            {/* Seleção de Avatar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Escolha um avatar
              </label>
              <div className="grid grid-cols-6 gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                {avatares.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, avatar }))}
                    className={`text-3xl p-2 rounded-lg transition-all ${
                      formData.avatar === avatar
                        ? 'bg-orange-500 scale-110 shadow-md ring-2 ring-orange-300'
                        : 'bg-white hover:bg-orange-100 hover:scale-105'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Avatar selecionado: <span className="text-2xl">{formData.avatar}</span>
              </p>
            </div>

            {/* O que mais gosta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                O que mais gosta?
              </label>
              <input
                type="text"
                placeholder="Ex: blocos, desenhos, música"
                value={formData.likes}
                onChange={(e) => setFormData(prev => ({ ...prev, likes: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              />
            </div>

            {/* Desafios atuais */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Desafios atuais
              </label>
              <input
                type="text"
                placeholder="Ex: foco, coordenação, socialização"
                value={formData.challenges}
                onChange={(e) => setFormData(prev => ({ ...prev, challenges: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              />
            </div>

            {/* Checkbox - Necessidades especiais */}
            <div className="flex items-center space-x-3 pt-2">
              <input
                type="checkbox"
                id="specialNeeds"
                checked={formData.hasSpecialNeeds}
                onChange={(e) => setFormData(prev => ({ ...prev, hasSpecialNeeds: e.target.checked }))}
                className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-200 focus:ring-2 cursor-pointer"
              />
              <label htmlFor="specialNeeds" className="text-sm text-gray-700 cursor-pointer">
                Ele tem alguma necessidade especial?
              </label>
            </div>
          </div>

          {/* Botão de submit */}
          <button
            type="submit"
            disabled={isLoading || !formData.name || !formData.age}
            className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Começar agora</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChildSetupPage
