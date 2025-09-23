import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react'
import { getLocalPurchaseAccess, checkPurchaseAccess } from '../../lib/kirvano.js'

const PurchaseStatus = ({ userEmail }) => {
  const [purchaseStatus, setPurchaseStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastChecked, setLastChecked] = useState(null)

  // Carregar status da compra
  const loadPurchaseStatus = async () => {
    if (!userEmail) return

    setIsLoading(true)
    
    try {
      // Primeiro verificar cache local
      const localAccess = getLocalPurchaseAccess(userEmail)
      
      if (localAccess) {
        setPurchaseStatus({
          hasAccess: localAccess.hasAccess,
          purchaseData: localAccess.purchaseData,
          source: 'local'
        })
        setLastChecked(new Date(localAccess.checkedAt))
        return
      }
      
      // Se não tiver cache, verificar na API
      const result = await checkPurchaseAccess(userEmail)
      
      setPurchaseStatus({
        hasAccess: result.hasAccess,
        purchaseData: result.purchaseData,
        source: 'api'
      })
      setLastChecked(new Date())
      
    } catch (error) {
      console.error('Erro ao carregar status da compra:', error)
      setPurchaseStatus({
        hasAccess: false,
        error: error.message,
        source: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Recarregar status
  const refreshStatus = () => {
    loadPurchaseStatus()
  }

  // Carregar status inicial
  useEffect(() => {
    loadPurchaseStatus()
  }, [userEmail])

  if (!userEmail) {
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Status da Compra
        </h3>
        <button
          onClick={refreshStatus}
          disabled={isLoading}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
          title="Atualizar status"
        >
          <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Verificando status...</span>
        </div>
      ) : purchaseStatus ? (
        <div className="space-y-4">
          {/* Status Principal */}
          <div className={`p-4 rounded-lg border ${
            purchaseStatus.hasAccess 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center space-x-3">
              {purchaseStatus.hasAccess ? (
                <CheckCircle className="text-green-600" size={24} />
              ) : (
                <XCircle className="text-red-600" size={24} />
              )}
              <div className="flex-1">
                <h4 className={`font-medium ${
                  purchaseStatus.hasAccess ? 'text-green-800' : 'text-red-800'
                }`}>
                  {purchaseStatus.hasAccess ? 'Acesso Ativo' : 'Acesso Não Confirmado'}
                </h4>
                <p className={`text-sm ${
                  purchaseStatus.hasAccess ? 'text-green-600' : 'text-red-600'
                }`}>
                  {purchaseStatus.hasAccess 
                    ? 'Seu acesso está liberado e ativo'
                    : 'Este email não possui compra confirmada'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Detalhes da Compra */}
          {purchaseStatus.purchaseData && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-3">Detalhes da Compra</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">ID da Compra:</span>
                  <p className="font-mono text-gray-900">{purchaseStatus.purchaseData.id}</p>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <p className="capitalize text-gray-900">{purchaseStatus.purchaseData.status}</p>
                </div>
                <div>
                  <span className="text-gray-600">Data da Compra:</span>
                  <p className="text-gray-900">
                    {new Date(purchaseStatus.purchaseData.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                {purchaseStatus.purchaseData.expires_at && (
                  <div>
                    <span className="text-gray-600">Expira em:</span>
                    <p className="text-gray-900">
                      {new Date(purchaseStatus.purchaseData.expires_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
                {purchaseStatus.purchaseData.amount && (
                  <div>
                    <span className="text-gray-600">Valor:</span>
                    <p className="text-gray-900">
                      {purchaseStatus.purchaseData.currency} {purchaseStatus.purchaseData.amount}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Produto:</span>
                  <p className="text-gray-900">{purchaseStatus.purchaseData.product_id}</p>
                </div>
              </div>
            </div>
          )}

          {/* Informações do Sistema */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-blue-600 mt-0.5" size={18} />
              <div className="flex-1">
                <h5 className="font-medium text-blue-800 mb-1">Informações do Sistema</h5>
                <div className="text-sm text-blue-600 space-y-1">
                  <p>• Fonte: {purchaseStatus.source === 'local' ? 'Cache Local' : 'API da Kirvano'}</p>
                  {lastChecked && (
                    <p>• Última verificação: {lastChecked.toLocaleString('pt-BR')}</p>
                  )}
                  {purchaseStatus.source === 'local' && (
                    <p>• Dados em cache (válidos por 24h)</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ações */}
          {!purchaseStatus.hasAccess && (
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Clock className="text-orange-600 mt-0.5" size={18} />
                <div className="flex-1">
                  <h5 className="font-medium text-orange-800 mb-2">Precisa de Acesso?</h5>
                  <p className="text-sm text-orange-600 mb-3">
                    Faça uma compra na nossa loja para liberar o acesso ao BrincaFácil Premium.
                  </p>
                  <button
                    onClick={() => window.open('/shop', '_blank')}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Ir para a Loja
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <AlertCircle size={48} className="mx-auto mb-3 text-gray-300" />
          <p>Não foi possível carregar o status da compra</p>
        </div>
      )}
    </div>
  )
}

export default PurchaseStatus

