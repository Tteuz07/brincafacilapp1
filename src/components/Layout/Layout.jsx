import React from 'react'
import { useLocation } from 'react-router-dom'
import BottomNavigation from './BottomNavigation'
import Header from './Header'

const Layout = ({ children }) => {
  const location = useLocation()
  
  // Páginas que não mostram header nem navegação inferior
  const hideAllPages = ['/child-setup', '/login', '/gate']
  const showHeader = !hideAllPages.includes(location.pathname)
  const showBottomNav = !hideAllPages.includes(location.pathname)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Header */}
      {showHeader && <Header />}
      
      {/* Main content */}
      <main className={showBottomNav ? "pb-20" : ""}>
        {children}
      </main>
      
      {/* Bottom Navigation */}
      {showBottomNav && <BottomNavigation />}
    </div>
  )
}

export default Layout















