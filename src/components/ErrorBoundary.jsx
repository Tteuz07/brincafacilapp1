import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ ERRO CAPTURADO PELO ERROR BOUNDARY:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border-0">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-3xl">⚠️</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Ops! Algo deu errado</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Ocorreu um erro ao carregar a aplicação. Por favor, recarregue a página.
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Recarregar Página
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary






