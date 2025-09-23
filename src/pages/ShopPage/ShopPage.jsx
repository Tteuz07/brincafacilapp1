import React from 'react'

const ShopPage = () => {
  return (
    <div className="container-app py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Lojinha 🛍️
        </h1>
        <p className="text-gray-600 text-sm">
          Brinquedos educativos selecionados
        </p>
      </div>

      {/* Mensagem de Desenvolvimento - Melhor visual */}
      <div className="relative">
        <div className="card overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 border-pink-200">
          <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
            <div className="w-24 h-24 rounded-2xl bg-white shadow-md flex items-center justify-center text-5xl mb-4 md:mb-0">
              🚧
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
                Em construção com muito carinho
              </h2>
              <p className="text-gray-600 text-sm md:text-base mb-4 max-w-2xl">
                Estamos preparando uma lojinha com produtos educativos, seguros e selecionados para apoiar o desenvolvimento da sua criança.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-white/80 border border-pink-100 flex items-center space-x-2">
                  <span>🎯</span>
                  <span className="text-sm text-gray-700">Curadoria pedagógica</span>
                </div>
                <div className="p-3 rounded-xl bg-white/80 border border-purple-100 flex items-center space-x-2">
                  <span>🧸</span>
                  <span className="text-sm text-gray-700">Materiais seguros</span>
                </div>
                <div className="p-3 rounded-xl bg-white/80 border border-indigo-100 flex items-center space-x-2">
                  <span>💝</span>
                  <span className="text-sm text-gray-700">Ofertas especiais</span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500">Lançamento em breve 🚀</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopPage