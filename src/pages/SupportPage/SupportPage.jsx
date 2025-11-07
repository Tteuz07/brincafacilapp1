import React, { useState } from 'react'
import { ArrowLeft, MessageCircle, HelpCircle, FileText, Star, Heart, Users, Lightbulb, Gift, Mail, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const SupportPage = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showContactForm, setShowContactForm] = useState(false)
  const [showAffiliateModal, setShowAffiliateModal] = useState(false)

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


          {/* Informações Adicionais */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 text-center mb-4">
              💡 Outras Opções
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Card Indique e Ganhe */}
              <button
                onClick={() => setShowAffiliateModal(true)}
                className="card hover:shadow-lg transition-all duration-200 text-left"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Gift size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 mb-1">🎁 Indique e Ganhe</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Indique o BrincaFácil e ganhe comissões! Seja nossa parceira e ganhe dinheiro enquanto ajuda famílias.
                    </p>
                  </div>
                </div>
              </button>
              
              {/* Card Sugestões */}
              <div className="card hover:shadow-lg transition-all duration-200 text-left">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 mb-1">💡 Sugestões</h4>
                    <p className="text-gray-600 text-sm leading-relaxed mb-2">
                      Tem ideias para melhorar o app? Envie suas sugestões e ajude-nos a crescer!
                    </p>
                    <p className="text-primary-500 text-sm font-semibold">
                      Email: brincafacil@gmail.com
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

      {/* Modal Indique e Ganhe */}
      {showAffiliateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center pb-20">
          <div className="bg-white rounded-t-3xl w-full flex flex-col shadow-2xl" style={{ height: 'calc(100vh - 80px)', maxHeight: 'calc(100vh - 80px)' }} onClick={(e) => e.stopPropagation()}>
            {/* Header do Modal */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                Indique e Ganhe
              </h3>
              <button
                onClick={() => setShowAffiliateModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 active:scale-95"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="flex-1 overflow-y-auto min-h-0 px-5 py-6 pb-8">
              <div className="space-y-5">
                {/* Ícone e Título */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Gift size={40} className="text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Seja uma Afiliada BrincaFácil!
                  </h4>
                </div>

                {/* Como Funciona */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                  <h5 className="font-bold text-gray-800 mb-3 text-lg">📋 Passo a passo:</h5>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <span className="text-orange-600 font-bold text-lg">1.</span>
                      <p className="text-gray-700 text-sm flex-1">
                        Cadastre-se como afiliada através do link abaixo.
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-orange-600 font-bold text-lg">2.</span>
                      <p className="text-gray-700 text-sm flex-1">
                        Receba seu link exclusivo de indicação automaticamente.
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-orange-600 font-bold text-lg">3.</span>
                      <p className="text-gray-700 text-sm flex-1">
                        Compartilhe o BrincaFácil com outras famílias.
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-orange-600 font-bold text-lg">4.</span>
                      <p className="text-gray-700 text-sm flex-1">
                        Ganhe 30% de comissão por cada venda confirmada, paga direto pela Eduzz.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Benefícios */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h5 className="font-bold text-gray-800 mb-3">✨ Benefícios:</h5>
                  <ul className="space-y-2.5 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2 text-base">✨</span>
                      <span>Comissões reais e recorrentes em cada venda.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2 text-base">⚡</span>
                      <span>Pagamentos rápidos e seguros via Eduzz.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2 text-base">🎯</span>
                      <span>Bonificações e prêmios conforme seu desempenho.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2 text-base">📱</span>
                      <span>Tudo pelo celular, de forma simples e prática.</span>
                    </li>
                  </ul>
                </div>

                {/* Botão Quero ser Afiliada */}
                <button
                  onClick={() => {
                    window.open('https://orbita.eduzz.com/affiliate/invite/2894302', '_blank', 'noopener,noreferrer')
                  }}
                  className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-600 hover:from-orange-600 hover:via-orange-700 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    boxShadow: '0 10px 25px -5px rgba(255, 122, 0, 0.4), 0 10px 10px -5px rgba(255, 122, 0, 0.2)'
                  }}
                >
                  <Gift className="w-5 h-5" />
                  <span className="text-lg">Quero Ser Afiliada</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SupportPage