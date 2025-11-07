import React, { useState, useRef, useEffect } from 'react'
import { X, Camera, Star, Send, Smile, Meh, Frown, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

export const ActivityRegistrationModal = ({ 
  isOpen, 
  onClose, 
  area, 
  activity, 
  onRegister 
}) => {
  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    photo: null,
    duration: 15,
    difficulty: 'easy',
    funLevel: 'fun'
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [showDurationDropdown, setShowDurationDropdown] = useState(false)
  const durationDropdownRef = useRef(null)

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (durationDropdownRef.current && !durationDropdownRef.current.contains(event.target)) {
        setShowDurationDropdown(false)
      }
    }

    if (showDurationDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDurationDropdown])

  const durationOptions = [
    { value: 5, label: '5 minutos' },
    { value: 10, label: '10 minutos' },
    { value: 15, label: '15 minutos' },
    { value: 20, label: '20 minutos' },
    { value: 30, label: '30 minutos' },
    { value: 45, label: '45 minutos' },
    { value: 60, label: '1 hora ou mais' }
  ]

  const selectedDuration = durationOptions.find(opt => opt.value === formData.duration)?.label || '15 minutos'

  if (!isOpen) return null

  const handlePhotoChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validar tipo e tamanho
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas imagens! 📸')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error('A imagem deve ter menos de 5MB! 📏')
        return
      }

      setFormData(prev => ({ ...prev, photo: file }))
      
      // Criar preview
      const reader = new FileReader()
      reader.onload = (e) => setPhotoPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.rating === 0) {
      toast.error('Por favor, dê uma nota para a brincadeira! ⭐')
      return
    }
    
    if (!formData.photo) {
      toast.error('Tire uma foto da brincadeira para comprovar! 📸')
      return
    }
    
    if (formData.comment.trim().length < 10) {
      toast.error('Conte mais sobre o que achou da brincadeira! 💭')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simular upload da foto (em produção seria para um servidor)
      const photoUrl = await simulatePhotoUpload(formData.photo)
      
      const activityData = {
        name: activity,
        description: formData.comment,
        rating: formData.rating,
        photo: photoUrl,
        duration: formData.duration,
        difficulty: formData.difficulty,
        funLevel: formData.funLevel,
        points: calculatePoints(formData),
        date: new Date().toISOString(),
        completed: true
      }
      
      // Chamar função de registro
      await onRegister(activityData)
      
      toast.success('Atividade registrada com sucesso! 🎉')
      onClose()
      
      // Resetar formulário
      setFormData({
        rating: 0,
        comment: '',
        photo: null,
        duration: 15,
        difficulty: 'easy',
        funLevel: 'fun'
      })
      setPhotoPreview(null)
      
    } catch (error) {
      toast.error('Erro ao registrar atividade. Tente novamente! ❌')
    } finally {
      setIsSubmitting(false)
    }
  }

  const simulatePhotoUpload = (file) => {
    return new Promise((resolve) => {
      // Converter a imagem para base64 para salvar no localStorage
      const reader = new FileReader()
      reader.onload = (e) => {
        // Salvar como data URL (base64) para persistir no localStorage
        resolve(e.target.result)
      }
      reader.onerror = () => {
        // Fallback para blob URL se der erro
        resolve(URL.createObjectURL(file))
      }
      reader.readAsDataURL(file)
    })
  }

  const calculatePoints = (data) => {
    let points = 10 // Base
    
    // Bônus por nota alta
    if (data.rating >= 4) points += 5
    if (data.rating === 5) points += 5
    
    // Bônus por comentário longo
    if (data.comment.length > 20) points += 3
    
    // Bônus por foto
    if (data.photo) points += 2
    
    return points
  }

  const getAreaColor = (area) => {
    const colors = {
      cognitive: 'from-blue-500 to-cyan-500',
      motor: 'from-green-500 to-emerald-500',
      social: 'from-purple-500 to-pink-500',
      emotional: 'from-red-500 to-orange-500'
    }
    return colors[area] || 'from-gray-500 to-slate-500'
  }

  const getAreaIcon = (area) => {
    const icons = {
      cognitive: '🧠',
      motor: '🏃',
      social: '👥',
      emotional: '❤️'
    }
    return icons[area] || '🎯'
  }

  const getAreaName = (area) => {
    const names = {
      cognitive: 'Cognitivo',
      motor: 'Motor',
      social: 'Social',
      emotional: 'Emocional'
    }
    return names[area] || 'Desenvolvimento'
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" style={{paddingTop: '2rem', paddingBottom: '2rem'}}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative" style={{maxHeight: '85vh'}}>
        <div className="overflow-y-auto" style={{maxHeight: '85vh'}}>
          {/* Header */}
          <div className={`bg-gradient-to-r ${getAreaColor(area)} p-4 rounded-t-2xl text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getAreaIcon(area)}</span>
                <div>
                  <h3 className="font-bold text-lg">Registrar Atividade</h3>
                  <p className="text-sm opacity-90">{getAreaName(area)}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mt-3 p-3 bg-white/20 rounded-lg">
              <p className="text-sm font-medium">Atividade: {activity}</p>
              <p className="text-xs opacity-90 mt-1">
                Desenvolvendo: {getAreaName(area)}
              </p>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Foto da Atividade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📸 Foto da Brincadeira
            </label>
            
            {photoPreview ? (
              <div className="relative">
                <img 
                  src={photoPreview} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, photo: null }))
                    setPhotoPreview(null)
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors"
              >
                <Camera size={32} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Clique para tirar uma foto</span>
                <span className="text-xs text-gray-400">ou selecionar da galeria</span>
              </button>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>

          {/* Avaliação com Estrelas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ⭐ Como foi a brincadeira?
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                  className={`p-1 transition-all ${
                    formData.rating >= star 
                      ? 'text-yellow-500 scale-110' 
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                >
                  <Star size={24} className={formData.rating >= star ? 'fill-current' : ''} />
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <Frown size={14} />
                <span>Ruim</span>
              </span>
              <span className="flex items-center space-x-1">
                <Meh size={14} />
                <span>Mais ou menos</span>
              </span>
              <span className="flex items-center space-x-1">
                <Smile size={14} />
                <span>Ótima!</span>
              </span>
            </div>
          </div>

          {/* Comentário */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              💭 Conte o que achou da brincadeira
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Ex: Foi muito divertido! Gostei de... (mínimo 10 caracteres)"
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
              rows={3}
              minLength={10}
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.comment.length}/100 caracteres
            </div>
          </div>

          {/* Duração - Dropdown Customizado */}
          <div className="relative" ref={durationDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ⏱️ Quanto tempo brincou?
            </label>
            <button
              type="button"
              onClick={() => setShowDurationDropdown(!showDurationDropdown)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white cursor-pointer flex items-center justify-between text-left"
            >
              <span>{selectedDuration}</span>
              <ChevronDown 
                size={20} 
                className={`text-gray-400 transition-transform ${showDurationDropdown ? 'rotate-180' : ''}`}
              />
            </button>
            
            {showDurationDropdown && (
              <div className="absolute z-[10000] w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {durationOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, duration: option.value }))
                      setShowDurationDropdown(false)
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                      formData.duration === option.value ? 'bg-blue-100 font-medium' : ''
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dificuldade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🎯 Foi fácil ou difícil?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'easy', label: 'Fácil', color: 'bg-green-100 border-green-300 text-green-700' },
                { value: 'medium', label: 'Médio', color: 'bg-yellow-100 border-yellow-300 text-yellow-700' },
                { value: 'hard', label: 'Difícil', color: 'bg-red-100 border-red-300 text-red-700' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, difficulty: option.value }))}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.difficulty === option.value
                      ? `${option.color} scale-105`
                      : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Nível de Diversão */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              😊 Foi divertido?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'boring', label: 'Chato', icon: '😴' },
                { value: 'ok', label: 'Ok', icon: '😐' },
                { value: 'fun', label: 'Muito Legal!', icon: '🤩' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, funLevel: option.value }))}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.funLevel === option.value
                      ? 'bg-blue-100 border-blue-300 text-blue-700 scale-105'
                      : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-lg mb-1">{option.icon}</div>
                  <div className="text-xs">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Resumo de Pontos */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">Pontos que vai ganhar:</span>
              <span className="text-lg font-bold text-blue-600">
                +{calculatePoints(formData)} pontos
              </span>
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Para {getAreaName(area)} • Base: 10 + Bônus por nota alta + Foto + Comentário detalhado
            </div>
          </div>

          {/* Botões */}
          <div className="flex space-x-3 pt-4 pb-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.photo || formData.rating === 0 || formData.comment.length < 10}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Registrando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Send size={16} />
                  <span>Registrar</span>
                </div>
              )}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}
