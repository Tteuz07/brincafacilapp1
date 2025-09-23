import React, { useState } from 'react'
import { 
  Settings, 
  LogOut, 
  HelpCircle, 
  Lightbulb,
  User,
  Bell,
  Shield,
  Info,
  RefreshCw,
  Moon,
  Sun,
  Volume2,
  VolumeX
} from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import toast from 'react-hot-toast'

const SettingsPage = () => {
  const { user, logout } = useAppStore()
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [sound, setSound] = useState(true)

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Até logo! 👋')
    } catch (error) {
      toast.error('Erro ao sair')
    }
  }

  const handleResetTutorials = () => {
    // Remove todas as chaves de tutorial do localStorage
    localStorage.removeItem('welcome_home')
    localStorage.removeItem('welcome_activities')
    localStorage.removeItem('welcome_cartoons')
    
    toast.success('Tutoriais resetados! Os popups de boas-vindas aparecerão novamente 🎉')
  }

  const settingsSections = [
    {
      title: 'Preferências',
      items: [
        {
          icon: Bell,
          title: 'Notificações',
          description: 'Receber alertas e lembretes',
          type: 'toggle',
          value: notifications,
          onChange: setNotifications,
          color: 'text-blue-500'
        },
        {
          icon: Volume2,
          title: 'Sons',
          description: 'Ativar sons do aplicativo',
          type: 'toggle',
          value: sound,
          onChange: setSound,
          color: 'text-green-500'
        },
        {
          icon: darkMode ? Moon : Sun,
          title: 'Modo Escuro',
          description: 'Alternar entre tema claro e escuro',
          type: 'toggle',
          value: darkMode,
          onChange: setDarkMode,
          color: 'text-purple-500'
        }
      ]
    },
    {
      title: 'Aplicativo',
      items: [
        {
          icon: Lightbulb,
          title: 'Resetar Tutoriais',
          description: 'Ver popups de boas-vindas novamente',
          type: 'action',
          action: 'resetTutorials',
          color: 'text-orange-500'
        },
        {
          icon: RefreshCw,
          title: 'Limpar Cache',
          description: 'Liberar espaço de armazenamento',
          type: 'action',
          action: 'clearCache',
          color: 'text-cyan-500'
        }
      ]
    },
    {
      title: 'Suporte',
      items: [
        {
          icon: HelpCircle,
          title: 'Ajuda & FAQ',
          description: 'Perguntas frequentes e guias',
          type: 'link',
          link: '/help',
          color: 'text-blue-500'
        },
        {
          icon: Info,
          title: 'Sobre o App',
          description: 'Versão e informações técnicas',
          type: 'info',
          color: 'text-gray-500'
        }
      ]
    }
  ]

  const handleAction = (action) => {
    switch (action) {
      case 'resetTutorials':
        handleResetTutorials()
        break
      case 'clearCache':
        // Simular limpeza de cache
        toast.success('Cache limpo com sucesso! 🧹')
        break
      default:
        break
    }
  }

  return (
    <div className="container-app py-6 space-y-6">
      {/* Header das Configurações */}
      <div className="card bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-slate-600 rounded-full flex items-center justify-center text-white shadow-lg">
            <Settings size={28} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
            <p className="text-gray-600">Personalize sua experiência no app</p>
          </div>
        </div>
      </div>

      {/* Informações da Conta */}
      <div className="card border-t-4 border-t-primary-200">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <User size={20} className="text-primary-500" />
          <span>Conta</span>
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium text-gray-800">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Versão do App:</span>
            <span className="font-medium text-gray-800">1.0.0</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Última Atualização:</span>
            <span className="font-medium text-gray-800">Hoje</span>
          </div>
        </div>
      </div>

      {/* Seções de Configurações */}
      {settingsSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-3">
          <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
            <span>{section.title}</span>
          </h3>
          
          {section.items.map((item, itemIndex) => {
            const Icon = item.icon
            
            if (item.type === 'toggle') {
              return (
                <div key={itemIndex} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-gray-50 ${item.color}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.value}
                        onChange={(e) => item.onChange(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                </div>
              )
            }
            
            if (item.type === 'action') {
              return (
                <button
                  key={itemIndex}
                  onClick={() => handleAction(item.action)}
                  className="w-full card hover:shadow-lg transition-shadow hover:border-orange-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-gray-50 ${item.color}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-medium text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <div className="text-orange-400">
                      <Icon size={20} />
                    </div>
                  </div>
                </button>
              )
            }
            
            if (item.type === 'link') {
              return (
                <div key={itemIndex} className="card hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-gray-50 ${item.color}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <div className="text-gray-400">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              )
            }
            
            if (item.type === 'info') {
              return (
                <div key={itemIndex} className="card">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-gray-50 ${item.color}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              )
            }
            
            return null
          })}
        </div>
      ))}

      {/* Botão de Logout */}
      <button
        onClick={handleLogout}
        className="w-full card hover:shadow-lg transition-shadow border-red-200 hover:border-red-300"
      >
        <div className="flex items-center justify-center space-x-2 text-red-600">
          <LogOut size={20} />
          <span className="font-medium">Sair da Conta</span>
        </div>
      </button>

      {/* Informações Legais */}
      <div className="text-center text-xs text-gray-500 space-y-1">
        <p>© 2024 BrincaFácil App</p>
        <p>Desenvolvido com ❤️ para crianças</p>
      </div>
    </div>
  )
}

export default SettingsPage



