import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Gamepad2, Tv, Heart, ShoppingBag } from 'lucide-react'

const BottomNavigation = () => {
  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Início',
      exact: true
    },
    {
      path: '/activities',
      icon: Gamepad2,
      label: 'Brincadeiras'
    },
    {
      path: '/cartoons',
      icon: Tv,
      label: 'Desenhos'
    },
    {
      path: '/shop',
      icon: ShoppingBag,
      label: 'Lojinha'
    },
    {
      path: '/profile',
      icon: Heart,
      label: 'Minha Criança'
    }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between py-2 px-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isStringIcon = typeof item.icon === 'string'
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 flex-1 min-w-0 ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'text-gray-500 hover:text-primary-500 hover:bg-primary-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isStringIcon ? (
                      <span 
                        className={`text-xl mb-1 ${isActive ? 'animate-bounce-soft' : ''}`}
                      >
                        {Icon}
                      </span>
                    ) : (
                      <Icon 
                        size={20} 
                        className={`mb-1 ${isActive ? 'animate-bounce-soft' : ''}`} 
                      />
                    )}
                    <span className="text-xs font-medium text-center leading-tight">
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default BottomNavigation
