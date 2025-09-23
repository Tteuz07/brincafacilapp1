import React from 'react'
import { useLocation } from 'react-router-dom'
import BottomNavigation from './BottomNavigation'
import Header from './Header'

const Layout = ({ children }) => {
  const location = useLocation()
  
  // Páginas que não mostram header
  const hideHeaderPages = ['/child-setup']
  const showHeader = !hideHeaderPages.includes(location.pathname)

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Header */}
      {showHeader && <Header />}
      
      {/* Main content */}
      <main className="pb-20">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}

export default Layout















