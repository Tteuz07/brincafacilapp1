import React from 'react'
import { X, Sparkles, Heart, Brain, Users, Star, ArrowRight } from 'lucide-react'

const WelcomePopup = ({ 
  isOpen, 
  onClose, 
  page, 
  title, 
  subtitle, 
  description, 
  benefits, 
  icon, 
  colorScheme,
  children 
}) => {
  if (!isOpen) return null

  const getColorScheme = () => {
    switch (colorScheme) {
      case 'blue':
        return {
          bg: 'from-blue-400 via-blue-500 to-blue-600',
          text: 'text-blue-50',
          accent: 'text-blue-200',
          button: 'bg-blue-600 hover:bg-blue-700',
          ring: 'ring-blue-300'
        }
      case 'green':
        return {
          bg: 'from-green-400 via-green-500 to-green-600',
          text: 'text-green-50',
          accent: 'text-green-200',
          button: 'bg-green-600 hover:bg-green-700',
          ring: 'ring-green-300'
        }
      case 'purple':
        return {
          bg: 'from-purple-400 via-purple-500 to-purple-600',
          text: 'text-purple-50',
          accent: 'text-purple-200',
          button: 'bg-purple-600 hover:bg-purple-700',
          ring: 'ring-purple-300'
        }
      case 'orange':
        return {
          bg: 'from-orange-400 via-orange-500 to-orange-600',
          text: 'text-orange-50',
          accent: 'text-orange-200',
          button: 'bg-orange-600 hover:bg-orange-700',
          ring: 'ring-orange-300'
        }
      default:
        return {
          bg: 'from-blue-400 via-blue-500 to-blue-600',
          text: 'text-blue-50',
          accent: 'text-blue-200',
          button: 'bg-blue-600 hover:bg-blue-700',
          ring: 'ring-blue-300'
        }
    }
  }

  const colors = getColorScheme()

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
        {/* Header com gradiente */}
        <div className={`bg-gradient-to-r ${colors.bg} p-6 rounded-t-3xl relative overflow-hidden`}>
          {/* Decoração de fundo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-20 h-20 bg-white/20 rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/20 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/10 rounded-full"></div>
          </div>
          
          {/* Conteúdo do header */}
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-4xl">{icon}</div>
                <div>
                  <h1 className={`text-2xl font-bold ${colors.text}`}>{title}</h1>
                  <p className={`${colors.accent} text-sm`}>{subtitle}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={24} className={colors.text} />
              </button>
            </div>
            
            <p className={`${colors.text} text-lg leading-relaxed`}>
              {description}
            </p>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="p-6 space-y-6">
          {/* Benefícios */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Heart className="w-5 h-5 text-red-500 mr-2" />
              Por que é importante para seu filho?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 text-sm">{benefit.title}</h4>
                    <p className="text-gray-600 text-xs">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conteúdo específico da página */}
          {children}

          {/* Dica especial */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-bold text-yellow-800 text-sm mb-1">💡 Dica Especial</h4>
                <p className="text-yellow-700 text-sm">
                  Explore todos os recursos desta página para encontrar o que melhor se adapta ao perfil e momento do seu filho!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer com botão */}
        <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-3xl border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="font-medium">✨</span> Primeira vez aqui? Explore tudo!
            </div>
            <button
              onClick={onClose}
              className={`${colors.button} text-white px-6 py-2 rounded-xl font-medium transition-colors flex items-center space-x-2`}
            >
              <span>Entendi!</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomePopup





