import { useState, useEffect } from 'react'

const useWelcomePopup = (pageKey) => {
  // Popups desabilitados - sempre retorna false
  const [showWelcome, setShowWelcome] = useState(false)

  // Não executa nenhum useEffect - popups nunca aparecem
  // useEffect(() => {
  //   // Verifica se é a primeira vez acessando esta página
  //   const hasVisited = localStorage.getItem(`welcome_${pageKey}`)
  //   
  //   if (!hasVisited) {
  //     // Pequeno delay para garantir que a página carregou completamente
  //     const timer = setTimeout(() => {
  //       setShowWelcome(true)
  //     }, 1000)
  //     
  //     return () => clearTimeout(timer)
  //   }
  // }, [pageKey])

  const closeWelcome = () => {
    setShowWelcome(false)
    // Marca que a página já foi visitada
    localStorage.setItem(`welcome_${pageKey}`, 'true')
  }

  const resetWelcome = () => {
    localStorage.removeItem(`welcome_${pageKey}`)
    setShowWelcome(true)
  }

  return {
    showWelcome: false, // Sempre retorna false
    closeWelcome,
    resetWelcome
  }
}

export default useWelcomePopup

