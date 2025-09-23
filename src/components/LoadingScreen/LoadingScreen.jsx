import React from 'react'

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
      <div className="text-center">
        {/* Logo/Ícone animado */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto bg-primary-500 rounded-full flex items-center justify-center shadow-lg animate-bounce-soft">
            <span className="text-4xl">🎯</span>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-lg">✨</span>
          </div>
        </div>
        
        {/* Nome do app */}
        <h1 className="text-3xl font-bold text-primary-500 mb-2">
          BrincaFácil
        </h1>
        
        {/* Subtitle */}
        <p className="text-gray-600 mb-8">
          Carregando brincadeiras incríveis...
        </p>
        
        {/* Loading spinner */}
        <div className="flex justify-center">
          <div className="spinner"></div>
        </div>
        
        {/* Elementos decorativos */}
        <div className="mt-8 flex justify-center space-x-4 opacity-60">
          <div className="w-3 h-3 bg-yellow-300 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-primary-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen















