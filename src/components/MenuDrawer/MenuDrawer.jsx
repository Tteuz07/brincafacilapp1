import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, BookOpen, Palette, Wrench, HelpCircle, Settings, Heart } from 'lucide-react'
import useAppStore from '../../store/useAppStore'

const MenuDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const [isAnimating, setIsAnimating] = useState(false)
  const { favorites } = useAppStore()

  // Fechar ao pressionar ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  // Prevenir scroll do body quando o drawer está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Trigger animação de entrada
      setTimeout(() => setIsAnimating(true), 10)
    } else {
      document.body.style.overflow = 'unset'
      setIsAnimating(false)
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const menuItems = [
    {
      id: 'stories',
      title: 'Hora da História',
      subtitle: 'Leitura em Família',
      icon: BookOpen,
      path: '/stories'
    },
    {
      id: 'drawings',
      title: 'Desenhos para Imprimir',
      subtitle: 'Galeria de desenhos',
      icon: Palette,
      path: '/drawings'
    },
    {
      id: 'workshop',
      title: 'Oficina de Criação',
      subtitle: 'Experimentos científicos divertidos e educativos',
      icon: Wrench,
      path: '/workshop'
    },
    {
      id: 'favorites',
      title: 'Meus Favoritos',
      subtitle: `${favorites?.length || 0} itens especiais salvos`,
      icon: Heart,
      path: '/favorites'
    },
    {
      id: 'support',
      title: 'Suporte',
      subtitle: 'Como podemos ajudar',
      icon: HelpCircle,
      path: '/support'
    },
    {
      id: 'settings',
      title: 'Configurações',
      subtitle: 'Personalize sua experiência',
      icon: Settings,
      path: '/settings'
    }
  ]

  const handleItemClick = (path) => {
    onClose()
    // Pequeno delay para permitir a animação de fechamento
    setTimeout(() => {
      navigate(path)
    }, 200)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay escuro com backdrop blur */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Drawer lateral */}
      <div
        className={`fixed right-0 top-0 h-full w-[80%] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out rounded-tl-3xl rounded-bl-3xl ${
          isAnimating ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header do Drawer */}
        <div className="bg-primary-500 px-6 py-5 rounded-tl-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Menu</h2>
              <p className="text-white text-sm mt-1">Escolha uma opção</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
            >
              <X size={22} className="text-white" />
            </button>
          </div>
        </div>

        {/* Lista de itens do menu */}
        <div className="overflow-y-auto h-[calc(100vh-130px)] px-5 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.path)}
                className="w-full flex items-center justify-between py-3.5 px-3 rounded-xl transition-all duration-200 hover:bg-gray-50 text-left"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {/* Ícone simples */}
                  <div className="text-gray-500 flex-shrink-0">
                    <Icon size={22} />
                  </div>
                  
                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 text-base">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                {/* Seta */}
                <div className="text-gray-400 flex-shrink-0 ml-2">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer do Drawer */}
        <div className="border-t border-gray-200 px-6 py-3.5 bg-gray-50 rounded-bl-3xl">
          <p className="text-center text-xs text-gray-500">
            © 2024 BrincaFácil App
          </p>
        </div>
      </div>
    </>
  )
}

export default MenuDrawer

