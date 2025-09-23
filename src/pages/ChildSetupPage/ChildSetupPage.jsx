import React, { useState } from 'react'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '../../store/useAppStore'
import toast from 'react-hot-toast'

const ChildSetupPage = () => {
  const navigate = useNavigate()
  const { updateChild } = useAppStore()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    avatar: '🧒',
    interests: [],
    space: '',
    companionship: ''
  })

  const totalSteps = 4

  const avatarOptions = [
    '👶', '🧒', '👦', '👧', '🦄', '🐻', '🐱', '🐶', '🦊', '🐼', '🦋', '🌟'
  ]

  const interestOptions = [
    { id: 'creative', label: 'Atividades Criativas', emoji: '🎨' },
    { id: 'physical', label: 'Atividades Físicas', emoji: '🏃' },
    { id: 'quiet', label: 'Atividades Calmas', emoji: '📚' },
    { id: 'outdoor', label: 'Ao Ar Livre', emoji: '🌳' },
    { id: 'indoor', label: 'Dentro de Casa', emoji: '🏠' },
    { id: 'educational', label: 'Educativas', emoji: '🧠' },
    { id: 'musical', label: 'Musicais', emoji: '🎵' },
    { id: 'games', label: 'Jogos e Puzzles', emoji: '🧩' }
  ]

  const spaceOptions = [
    { id: 'small', label: 'Espaço Pequeno', description: 'Apartamento, quarto' },
    { id: 'medium', label: 'Espaço Médio', description: 'Casa com sala ampla' },
    { id: 'large', label: 'Espaço Grande', description: 'Casa com quintal/jardim' }
  ]

  const companionshipOptions = [
    { id: 'alone', label: 'Sozinho(a)', emoji: '👤' },
    { id: 'siblings', label: 'Com irmãos', emoji: '👦👧' },
    { id: 'friends', label: 'Com amigos', emoji: '👫' },
    { id: 'parents', label: 'Com os pais', emoji: '👨‍👩‍👧' }
  ]

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    try {
      const { error } = await updateChild({
        ...formData,
        age: parseInt(formData.age)
      })
      
      if (error) {
        toast.error('Erro ao salvar perfil. Tente novamente.')
        console.error('Erro ao salvar perfil:', error)
      } else {
        toast.success(`Perfil do ${formData.name} criado com sucesso! 🎉`)
        navigate('/')
      }
    } catch (error) {
      toast.error('Erro inesperado. Tente novamente.')
      console.error('Erro inesperado:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleInterest = (interestId) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }))
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name.length >= 2 && formData.age
      case 2:
        return true // Avatar é opcional
      case 3:
        return formData.interests.length > 0
      case 4:
        return formData.space && formData.companionship
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">👋</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Vamos conhecer sua criança!
              </h2>
              <p className="text-gray-600">
                Conte-nos um pouco sobre ela para personalizar as brincadeiras
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da criança
                </label>
                <input
                  type="text"
                  placeholder="Digite o nome..."
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idade
                </label>
                <select
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  className="input"
                >
                  <option value="">Selecione a idade</option>
                  {[2, 3, 4, 5, 6, 7, 8].map(age => (
                    <option key={age} value={age}>
                      {age} anos
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{formData.avatar}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Escolha um avatar para {formData.name}
              </h2>
              <p className="text-gray-600">
                Selecione o avatar que mais combina
              </p>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {avatarOptions.map(avatar => (
                <button
                  key={avatar}
                  onClick={() => setFormData(prev => ({ ...prev, avatar }))}
                  className={`p-4 rounded-xl text-3xl transition-all ${
                    formData.avatar === avatar
                      ? 'bg-primary-500 scale-110 shadow-lg'
                      : 'bg-white hover:bg-gray-50 shadow-md hover:scale-105'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Que tipo de atividades {formData.name} gosta?
              </h2>
              <p className="text-gray-600">
                Selecione todos os interesses (pode escolher vários)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {interestOptions.map(interest => (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    formData.interests.includes(interest.id)
                      ? 'bg-primary-500 text-white shadow-lg scale-105'
                      : 'bg-white hover:bg-gray-50 shadow-md hover:scale-105'
                  }`}
                >
                  <div className="text-2xl mb-1">{interest.emoji}</div>
                  <div className="text-sm font-medium">{interest.label}</div>
                </button>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🏠</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Últimas configurações
              </h2>
              <p className="text-gray-600">
                Isso nos ajuda a recomendar as melhores atividades
              </p>
            </div>

            <div className="space-y-6">
              {/* Espaço disponível */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Qual o espaço disponível para brincadeiras?
                </label>
                <div className="space-y-2">
                  {spaceOptions.map(space => (
                    <button
                      key={space.id}
                      onClick={() => setFormData(prev => ({ ...prev, space: space.id }))}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        formData.space === space.id
                          ? 'bg-primary-500 text-white shadow-lg'
                          : 'bg-white hover:bg-gray-50 shadow-md'
                      }`}
                    >
                      <div className="font-medium">{space.label}</div>
                      <div className="text-sm opacity-80">{space.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Companhia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {formData.name} costuma brincar:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {companionshipOptions.map(comp => (
                    <button
                      key={comp.id}
                      onClick={() => setFormData(prev => ({ ...prev, companionship: comp.id }))}
                      className={`p-3 rounded-xl text-center transition-all ${
                        formData.companionship === comp.id
                          ? 'bg-primary-500 text-white shadow-lg scale-105'
                          : 'bg-white hover:bg-gray-50 shadow-md'
                      }`}
                    >
                      <div className="text-xl mb-1">{comp.emoji}</div>
                      <div className="text-sm font-medium">{comp.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-8">
      <div className="container-app">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Passo {currentStep} de {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step content */}
        <div className="card animate-slide-up">
          {renderStep()}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
              currentStep === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white'
            }`}
          >
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!isStepValid() || isLoading}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <span>
                  {currentStep === totalSteps ? 'Finalizar' : 'Próximo'}
                </span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChildSetupPage















