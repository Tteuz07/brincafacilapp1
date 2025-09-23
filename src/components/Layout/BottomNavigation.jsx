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
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isStringIcon = typeof item.icon === 'string'
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-500 hover:text-primary-500 hover:bg-primary-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isStringIcon ? (
                      <span 
                        className={`text-2xl mb-1 ${isActive ? 'animate-bounce-soft' : ''}`}
                      >
                        {Icon}
                      </span>
                    ) : (
                      <Icon 
                        size={24} 
                        className={`mb-1 ${isActive ? 'animate-bounce-soft' : ''}`} 
                      />
                    )}
                    <span className="text-xs font-medium text-center">
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
