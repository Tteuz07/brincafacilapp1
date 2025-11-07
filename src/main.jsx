console.log('🚀 Iniciando aplicação...')

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

console.log('✅ Imports carregados')

// Verificar se o root existe
const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('❌ Elemento #root não encontrado!')
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; background: linear-gradient(to bottom right, #fef3c7, #fed7aa);">
      <div style="max-width: 400px; width: 100%; background: white; border-radius: 24px; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
          <h2 style="font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">Erro ao carregar</h2>
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 24px;">Elemento #root não encontrado no DOM.</p>
          <button onclick="window.location.reload()" style="width: 100%; padding: 16px; border-radius: 12px; background: linear-gradient(to right, #f97316, #eab308); color: white; font-weight: 600; border: none; cursor: pointer; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
            Recarregar Página
          </button>
        </div>
      </div>
    </div>
  `
} else {
  console.log('✅ Elemento #root encontrado')
  
  try {
    console.log('🔄 Criando root React...')
    const root = ReactDOM.createRoot(rootElement)
    console.log('✅ Root React criado')
    
    console.log('🔄 Renderizando aplicação...')
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>,
    )
    console.log('✅ Aplicação renderizada')
  } catch (error) {
    console.error('❌ ERRO AO INICIALIZAR REACT:', error)
    rootElement.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; background: linear-gradient(to bottom right, #fef3c7, #fed7aa);">
        <div style="max-width: 400px; width: 100%; background: white; border-radius: 24px; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center;">
            <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
            <h2 style="font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">Erro ao carregar</h2>
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 24px;">Erro ao inicializar a aplicação: ${error.message}</p>
            <button onclick="window.location.reload()" style="width: 100%; padding: 16px; border-radius: 12px; background: linear-gradient(to right, #f97316, #eab308); color: white; font-weight: 600; border: none; cursor: pointer; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
              Recarregar Página
            </button>
          </div>
        </div>
      </div>
    `
  }
}















