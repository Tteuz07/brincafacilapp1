import React, { useState } from 'react'
import { Menu } from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import MenuDrawer from '../MenuDrawer/MenuDrawer'

const Header = () => {
  const { child } = useAppStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const getAvatarEmoji = () => {
    if (!child?.avatar) {
      // Avatar padrão baseado na idade
      if (child?.age <= 3) return '👶'
      if (child?.age <= 6) return '🧒'
      return '👦'
    }
    return child.avatar
  }

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-40">
        <div className="container-app py-4">
          <div className="flex items-center justify-between">
            {/* Saudação e avatar */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-2xl shadow-lg">
                {getAvatarEmoji()}
              </div>
              <div>
                <p className="text-sm text-gray-600">{getGreeting()},</p>
                <h1 className="text-lg font-bold text-gray-800">
                  Brincadeiras {child?.name ? `para ${child.name}` : 'para sua criança'}! 👋
                </h1>
              </div>
            </div>
            
            {/* Botão de menu */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Menu size={24} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menu Drawer */}
      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  )
}

export default Header


