import React, { useState } from 'react'
import { ArrowLeft, MessageCircle, Phone, Mail, HelpCircle, FileText, Star, Heart, Users, Lightbulb } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const SupportPage = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showContactForm, setShowContactForm] = useState(false)

  const supportCategories = [
    {
      id: 'general',
      title: 'Dúvidas Gerais',
      description: 'Como usar o app, funcionalidades básicas',
      icon: '❓',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'activities',
      title: 'Brincadeiras',
      description: 'Como registrar atividades, ganhar pontos',
      icon: '🎯',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'child-profile',
      title: 'Perfil da Criança',
      description: 'Configurar dados, idade, interesses',
      icon: '👶',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'technical',
      title: 'Problemas Técnicos',
      description: 'App não funciona, erros, bugs',
      icon: '🔧',
      color: 'from-orange-500 to-red-500'
    }
  ]

  const faqs = {
    general: [
      {
        question: 'Como começar a usar o app?',
        answer: 'Primeiro, configure o perfil da sua criança com nome, idade e interesses. Depois explore as brincadeiras e comece a registrar atividades!'
      },
      {
        question: 'O app é gratuito?',
        answer: 'Sim! O BrincaFácil é completamente gratuito. Todas as funcionalidades estão disponíveis sem custo.'
      },
      {
        question: 'Posso usar offline?',
        answer: 'Sim! O app funciona offline. Seus dados são salvos localmente e sincronizados quando houver conexão.'
      }
    ],
    activities: [
      {
        question: 'Como registrar uma brincadeira?',
        answer: 'Clique em uma brincadeira, depois no botão "Registrar que Brincou". Tire uma foto, avalie e comente sobre a experiência!'
      },
      {
        question: 'Como ganhar pontos?',
        answer: 'Registre atividades regularmente! Pontos são ganhos por completar brincadeiras, manter rotinas e atingir metas semanais.'
      },
      {
        question: 'O que são as áreas de desenvolvimento?',
        answer: 'São 4 áreas: Cognitivo (memória, lógica), Motor (coordenação), Social (interação) e Emocional (criatividade).'
      }
    ],
    'child-profile': [
      {
        question: 'Como alterar a idade da criança?',
        answer: 'Vá em "Minha Criança" → "Configurações" → "Editar Perfil" e atualize a idade. As recomendações se ajustarão automaticamente.'
      },
      {
        question: 'Posso ter mais de uma criança?',
        answer: 'Atualmente o app suporta um perfil por vez. Para múltiplas crianças, você pode alternar entre perfis.'
      },
      {
        question: 'Como personalizar interesses?',
        answer: 'Em "Minha Criança", você pode selecionar os interesses da criança para receber recomendações mais precisas.'
      }
    ],
    technical: [
      {
        question: 'O app está travando, o que fazer?',
        answer: 'Tente fechar e abrir novamente. Se persistir, limpe o cache do navegador ou reinstale o app.'
      },
      {
        question: 'Não consigo fazer upload de fotos',
        answer: 'Verifique as permissões de câmera e galeria. Em alguns dispositivos, pode ser necessário autorizar manualmente.'
      },
      {
        question: 'Meus dados foram perdidos',
        answer: 'Os dados são salvos localmente. Se foram perdidos, verifique se não limpou o cache ou reinstalou o app.'
      }
    ]
  }

  const contactMethods = [
    {
      icon: <Mail size={20} />,
      title: 'Email',
      description: 'suporte@brincafacil.com',
      action: () => window.open('mailto:suporte@brincafacil.com')
    },
    {
      icon: <MessageCircle size={20} />,
      title: 'Chat Online',
      description: 'Disponível 24/7',
      action: () => setShowContactForm(true)
    },
    {
      icon: <Phone size={20} />,
      title: 'Telefone',
      description: '(11) 99999-9999',
      action: () => window.open('tel:+5511999999999')
    }
  ]

  const renderFAQ = (categoryId) => {
    const categoryFAQs = faqs[categoryId] || []
    
    return (
      <div className="space-y-4">
        {categoryFAQs.map((faq, index) => (
          <div key={index} className="card">
            <h4 className="font-bold text-gray-800 mb-3 text-lg">❓ {faq.question}</h4>
            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    )
  }

  const renderContactForm = () => {
    if (!showContactForm) return null

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Chat de Suporte</h3>
            <button
              onClick={() => setShowContactForm(false)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-2xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Users size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-blue-800">Suporte Online</p>
                  <p className="text-blue-600 text-sm">Responderemos em até 2 horas</p>
                </div>
              </div>
            </div>
            
            <textarea
              placeholder="Descreva sua dúvida ou problema..."
              className="w-full p-4 border border-gray-200 rounded-2xl resize-none h-32 focus:border-primary-500 focus:outline-none"
            />
            
            <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-2xl transition-colors">
              Enviar Mensagem
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-app py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Suporte 🆘
          </h1>
          <p className="text-gray-600 text-sm">
            Como podemos ajudar você?
          </p>
        </div>
      </div>

      {!selectedCategory ? (
        <>
          {/* Categorias de Suporte */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supportCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`bg-gradient-to-r ${category.color} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-left`}
              >
                <div className="text-3xl mb-3">{category.icon}</div>
                <h3 className="text-lg font-bold mb-2">{category.title}</h3>
                <p className="text-white/90 text-sm">{category.description}</p>
              </button>
            ))}
          </div>

          {/* Métodos de Contato */}
          <div className="card">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MessageCircle size={24} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Precisa de Ajuda Personalizada?</h2>
              <p className="text-gray-600 text-sm">Entre em contato conosco através de um dos canais abaixo</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {contactMethods.map((method, index) => (
                <button
                  key={index}
                  onClick={method.action}
                  className="flex items-center space-x-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-primary-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white">
                      {method.icon}
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-gray-800 mb-1">{method.title}</h3>
                    <p className="text-gray-600 text-sm">{method.description}</p>
                  </div>
                  <div className="text-primary-500 group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 text-center mb-4">
              💡 Outras Opções
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="card">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Star size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 mb-1">⭐ Avalie o App</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Sua opinião é muito importante para nós! Ajude-nos a melhorar avaliando o app na loja.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Heart size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 mb-1">💡 Sugestões</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Tem ideias para melhorar o app? Envie suas sugestões e ajude-nos a crescer!
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Lightbulb size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 mb-1">📚 Tutoriais</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Aprenda a usar todas as funcionalidades do app com nossos guias passo a passo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Voltar para categorias */}
          <div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <ArrowLeft size={16} />
              <span>Voltar para categorias</span>
            </button>
          </div>
          
          {/* Título da categoria */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {supportCategories.find(c => c.id === selectedCategory)?.title}
            </h2>
            <p className="text-gray-600 text-sm">
              {supportCategories.find(c => c.id === selectedCategory)?.description}
            </p>
          </div>
          
          {/* FAQs da categoria */}
          {renderFAQ(selectedCategory)}
        </>
      )}

      {/* Modal de contato */}
      {renderContactForm()}
    </div>
  )
}

export default SupportPage