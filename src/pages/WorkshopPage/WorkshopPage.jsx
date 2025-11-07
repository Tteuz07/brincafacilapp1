import React, { useState, useEffect } from 'react'
import { ArrowLeft, Wrench, Clock, Users, Scissors } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const WorkshopPage = () => {
  const navigate = useNavigate()
  const [selectedWorkshop, setSelectedWorkshop] = useState(null)
  const [workshops, setWorkshops] = useState([])

  // Função para obter oficinas padrão
  const getDefaultWorkshops = () => {
    return [
      {
        id: 1,
        title: 'Vulcão de Bicarbonato',
        emoji: '🌋',
        image: '🌋',
        imageUrl: '/Oficina/vulc%C3%A3o.jpg', // URL da imagem real (vulcão.jpg com encoding)
        duration: 15,
        participants: '1-2',
        difficulty: 'Fácil',
        materials: [
          '2 colheres de sopa de Bicarbonato de sódio',
          '1/2 xícara de Vinagre',
          'Corante alimentício (vermelho ou laranja)',
          'Detergente líquido (opcional, para mais espuma)',
          'Recipiente pequeno (o "vulcão") e bandeja de apoio'
        ],
        steps: [
          'Coloque o recipiente na bandeja.',
          'Dentro dele, adicione o bicarbonato, o corante e o detergente.',
          'Despeje o vinagre rapidamente e veja a erupção!'
        ],
        explanation: 'O vinagre (um ácido) e o bicarbonato (uma base) reagem, criando o gás dióxido de carbono (o mesmo das bolhas do refrigerante). Esse gás sobe, empurrando o líquido para fora do vulcão em forma de espuma.',
        description: 'Uma explosão colorida, segura e divertida que ensina química.'
      },
      {
        id: 2,
        title: 'Arco-íris em Copo',
        emoji: '🌈',
        image: '🌈',
        imageUrl: '/Oficina/arco.jpg', // URL da imagem real
        duration: 20,
        participants: '1-2',
        difficulty: 'Fácil',
        materials: [
          'Água',
          'Corante alimentício de 4 cores diferentes',
          'Açúcar em 4 níveis: 0, 1, 2 e 3 colheres de chá',
          'Copos pequenos para misturar e 1 copo transparente alto'
        ],
        steps: [
          'Em 4 copos diferentes, prepare as águas coloridas com a quantidade crescente de açúcar.',
          'No copo alto, despeje a água mais açucarada (mais pesada) primeiro.',
          'Com muito cuidado, use uma colher para despejar as outras camadas, da mais açucarada para a menos açucarada, escorrendo pela lateral do copo.'
        ],
        explanation: 'A densidade é o "peso" do líquido. Quanto mais açúcar na água, mais pesada ela fica. Os líquidos mais densos (mais açúcar) afundam e os menos densos flutuam, criando as camadas separadas.',
        description: 'Camadas coloridas de líquido que não se misturam, ensinando sobre densidade.'
      },
      {
        id: 3,
        title: 'Plantinha de Feijão',
        emoji: '🌱',
        image: '🌱',
        imageUrl: '/Oficina/feij%C3%A3o.jpg', // URL da imagem real (feijão.jpg com encoding)
        duration: 7,
        participants: '1',
        difficulty: 'Muito Fácil',
        materials: [
          '1 ou 2 Grãos de feijão',
          'Algodão',
          'Água (o suficiente para umedecer)',
          'Copo transparente'
        ],
        steps: [
          'Forre o copo com algodão.',
          'Coloque o feijão entre o algodão e o vidro.',
          'Umedeça o algodão (não precisa encharcar) e deixe em um lugar claro.',
          'Mantenha o algodão úmido e observe o broto nascer!'
        ],
        explanation: 'O feijão é uma semente "dormindo". A água o acorda, ativando o embrião dentro dele. A semente usa sua própria reserva de energia para começar a crescer, primeiro a raiz e depois o caule em direção à luz.',
        description: 'O clássico experimento que mostra o ciclo da vida e a germinação.'
      },
      {
        id: 4,
        title: 'Massinha Caseira',
        emoji: '🎨',
        image: '🎨',
        imageUrl: '/Oficina/massa.jpg', // URL da imagem real
        duration: 15,
        participants: '1-2',
        difficulty: 'Fácil',
        materials: [
          '2 xícaras de Farinha de trigo',
          '1/2 xícara de Sal',
          '1 colher de sopa de Óleo de cozinha',
          '3/4 de xícara de Água morna',
          'Corante alimentício (a gosto)'
        ],
        steps: [
          'Misture a farinha e o sal em uma tigela.',
          'Em outro copo, misture a água, o óleo e o corante.',
          'Junte as duas misturas e amasse com as mãos até a massa ficar lisa e parar de grudar.'
        ],
        explanation: 'Quando misturamos farinha e água e amassamos, desenvolvemos o glúten. O glúten é como uma rede de moléculas que dá a elasticidade e a textura maleável à massinha.',
        description: 'Uma massinha macia e totalmente segura, feita com ingredientes da cozinha.'
      },
      {
        id: 5,
        title: 'Tinta Mágica Invisível',
        emoji: '🍋',
        image: '🍋',
        imageUrl: '/Oficina/ferro.jpg', // URL da imagem real
        duration: 10,
        participants: '1',
        difficulty: 'Fácil',
        materials: [
          '1/4 de xícara de Suco de limão',
          'Cotonete ou palito',
          'Papel branco',
          'Fonte de calor (lâmpada, ferro de passar – com a ajuda de um adulto)'
        ],
        steps: [
          'Escreva a mensagem no papel usando o suco de limão. Deixe secar bem.',
          'Peça a um adulto para aquecer suavemente o papel com o ferro ou uma lâmpada acesa.',
          'A mensagem vai aparecer, ficando com uma cor marrom.'
        ],
        explanation: 'O suco de limão contém ácidos e açúcares. Quando aquecidos, eles reagem mais rápido que o papel (isso se chama oxidação), "queimando" de leve e ficando marrons, revelando a tinta mágica.',
        description: 'Escrever uma mensagem secreta que só pode ser revelada com calor.'
      },
      {
        id: 6,
        title: 'Barquinho que Anda Sozinho',
        emoji: '⛵',
        image: '⛵',
        imageUrl: '/Oficina/barco.jpg', // URL da imagem real
        duration: 5,
        participants: '1',
        difficulty: 'Muito Fácil',
        materials: [
          '1 gota de Detergente líquido',
          'Barquinho de papel ou papelão com um pequeno corte na parte traseira',
          'Prato ou bacia com água',
          'Palito de dente'
        ],
        steps: [
          'Coloque o barquinho na água.',
          'Molhe a ponta do palito no detergente.',
          'Encoste o palito com detergente na parte de trás do barco (no corte).',
          'Veja o barco se mover sozinho!'
        ],
        explanation: 'A água tem uma "pele" invisível chamada tensão superficial. O detergente quebra essa "pele" na parte de trás do barco. A força da "pele" na frente do barco fica maior e o puxa para frente como um motor.',
        description: 'Um barquinho movido a detergente, ensinando sobre física da água.'
      },
      {
        id: 7,
        title: 'Perfume Natural das Flores',
        emoji: '🌸',
        image: '🌸',
        imageUrl: '/Oficina/rosa.jpg', // URL da imagem real
        duration: 24,
        participants: '1',
        difficulty: 'Fácil',
        materials: [
          '1 xícara de Pétalas ou folhas cheirosas',
          '1 xícara de Água morna',
          'Pote com tampa e peneira'
        ],
        steps: [
          'Coloque as pétalas e a água morna no pote.',
          'Tampe e deixe em descanso por 24 horas.',
          'Passe o líquido pela peneira para separar as pétalas. O líquido restante é o perfume.'
        ],
        explanation: 'O cheiro das flores vem de óleos essenciais. A água morna ajuda a soltar e dissolver esses óleos das pétalas, transferindo o aroma para o líquido.',
        description: 'Extrair o cheiro da natureza e criar uma água perfumada.'
      },
      {
        id: 8,
        title: 'Pintura com Bolhas',
        emoji: '🫧',
        image: '🫧',
        imageUrl: '/Oficina/bolha.jpg', // URL da imagem real
        duration: 15,
        participants: '1-2',
        difficulty: 'Fácil',
        materials: [
          '1/4 de xícara de Água',
          '1 colher de sopa de Detergente',
          'Corante (a gosto)',
          'Copos pequenos, canudos e papel'
        ],
        steps: [
          'Misture água, detergente e corante em um copo.',
          'Sopre com o canudo até a espuma colorida sair do copo.',
          'Pressione o papel sobre a espuma/bolhas.',
          'Quando as bolhas estourarem, o corante deixará lindos desenhos.'
        ],
        explanation: 'As bolhas são feitas de uma fina película de detergente e água que prende o ar (tensão superficial). O corante fica nessa película e, ao estourar, a cor é transferida para o papel.',
        description: 'Criar arte colorida e abstrata usando bolhas de sabão.'
      },
      {
        id: 9,
        title: 'Slime Natural (Sem Bórax)',
        emoji: '🟢',
        image: '🟢',
        imageUrl: '/Oficina/slime.jpg', // URL da imagem real
        duration: 10,
        participants: '1-2',
        difficulty: 'Fácil',
        materials: [
          '1/2 xícara de Sabão líquido de roupas',
          'Aprox. 1 xícara de Amido de milho (maisena)',
          'Corante (opcional)'
        ],
        steps: [
          'Misture o sabão líquido e o corante na tigela.',
          'Adicione o amido de milho aos poucos, misturando bem.',
          'Quando ficar difícil de mexer, amasse com as mãos por 5 minutos até a massa ficar com textura de slime.'
        ],
        explanation: 'O slime é um polímero, uma substância com moléculas longas. O amido de milho tem moléculas que gostam de se juntar. O sabão líquido atua como um "cola elástica", ligando essas moléculas para criar a textura mágica.',
        description: 'Fazer um slime elástico e seguro com amido de milho e sabão.'
      },
      {
        id: 10,
        title: 'Nuvem no Pote',
        emoji: '☁️',
        image: '☁️',
        imageUrl: '/Oficina/nuvem.jpg', // URL da imagem real
        duration: 5,
        participants: '1',
        difficulty: 'Fácil',
        materials: [
          '1 dedo de Água quente (com a ajuda de um adulto)',
          'Cubos de gelo',
          'Spray de cabelo (laquê)',
          'Pote de vidro grande com tampa'
        ],
        steps: [
          'Coloque a água quente no pote.',
          'Coloque a tampa de cabeça para baixo e o gelo em cima.',
          'Após 1 minuto, tire a tampa, borrife um pouco do spray de cabelo e feche rapidamente.',
          'Observe a nuvem se formar no pote.'
        ],
        explanation: 'O vapor de água quente sobe. O gelo resfria o ar no topo, fazendo o vapor se transformar em gotículas de água líquida (condensação). O spray de cabelo é a "poeira" onde essas gotículas se agarram para formar a nuvem.',
        description: 'Simular a formação de uma nuvem dentro de um vidro.'
      }
    ]
  }

  // Carregar oficinas do localStorage ou usar dados padrão
  useEffect(() => {
    // Sempre usar os dados padrão atualizados para garantir que novos experimentos apareçam
    const defaultWorkshops = getDefaultWorkshops()
    setWorkshops(defaultWorkshops)
    localStorage.setItem('brincafacil-workshops', JSON.stringify(defaultWorkshops))
  }, [])

  const handleBack = () => {
    if (selectedWorkshop) {
      setSelectedWorkshop(null)
    } else {
      navigate(-1)
    }
  }

  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'Muito Fácil') return 'bg-green-100 text-green-800'
    if (difficulty === 'Fácil') return 'bg-blue-100 text-blue-800'
    if (difficulty === 'Médio') return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  if (selectedWorkshop) {
    return (
      <div className="container-app py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {selectedWorkshop.title}
            </h1>
            <p className="text-gray-600 text-sm">
              Oficina de Criação
            </p>
          </div>
        </div>

        {/* Imagem da oficina */}
        <div className="card p-0 overflow-hidden shadow-lg">
          {selectedWorkshop.imageUrl ? (
            <div className="w-full h-[400px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative">
              <img 
                src={selectedWorkshop.imageUrl} 
                alt={selectedWorkshop.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Se a imagem não carregar, esconder e mostrar o emoji
                  e.target.style.display = 'none'
                  const emojiDiv = e.target.parentElement?.querySelector('.emoji-fallback')
                  if (emojiDiv) {
                    emojiDiv.classList.remove('hidden')
                    emojiDiv.classList.add('block')
                  }
                }}
              />
              <div className="text-8xl hidden emoji-fallback absolute inset-0 flex items-center justify-center">
                {selectedWorkshop.emoji}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gradient-to-br from-orange-50 to-yellow-50">
              <div className="text-8xl mb-4">{selectedWorkshop.emoji}</div>
            </div>
          )}
          <div className="px-6 py-5 bg-white">
            {selectedWorkshop.description && (
              <p className="text-gray-700 text-base mb-4 text-center font-medium">
                {selectedWorkshop.description}
              </p>
            )}
            <div className="flex items-center justify-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                <Clock size={18} className="text-orange-500" />
                <span className="text-sm font-medium">{selectedWorkshop.duration} min</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                <Users size={18} className="text-orange-500" />
                <span className="text-sm font-medium">{selectedWorkshop.participants}</span>
              </div>
              <span className={`px-3 py-2 rounded-lg text-sm font-medium ${getDifficultyColor(selectedWorkshop.difficulty)}`}>
                {selectedWorkshop.difficulty}
              </span>
            </div>
          </div>
        </div>

        {/* Materiais */}
        <div className="card shadow-md">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center space-x-2 text-lg">
            <Scissors size={22} className="text-orange-500" />
            <span>Materiais Necessários</span>
          </h3>
          <ul className="space-y-3">
            {selectedWorkshop.materials.map((material, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="text-orange-500 font-bold text-lg mt-0.5">•</span>
                <span className="text-gray-700 text-base leading-relaxed">{material}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Passo a passo */}
        <div className="card shadow-md">
          <h3 className="font-bold text-gray-800 mb-5 flex items-center space-x-2 text-lg">
            <Wrench size={22} className="text-orange-500" />
            <span>Passo a Passo</span>
          </h3>
          <div className="space-y-5">
            {selectedWorkshop.steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md">
                  {index + 1}
                </div>
                <p className="text-gray-700 text-base leading-relaxed flex-1 pt-1.5">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Explicação Científica */}
        {selectedWorkshop.explanation && (
          <div className="card bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 shadow-md">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center space-x-2 text-lg">
              <span className="text-blue-600 text-2xl">🔬</span>
              <span>Explicação</span>
            </h3>
            <p className="text-gray-700 text-base leading-relaxed">
              {selectedWorkshop.explanation}
            </p>
          </div>
        )}

        {/* Botão de voltar */}
        <button
          onClick={handleBack}
          className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Voltar para Oficinas
        </button>
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
            Oficina de Criação 🧰
          </h1>
          <p className="text-gray-600 text-sm">
            Experimentos científicos divertidos e educativos
          </p>
        </div>
      </div>

      {/* Lista de Experimentos Legais (oficinas) */}
      {workshops.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
            <Wrench size={20} className="text-primary-500" />
            <span>Experimentos Legais</span>
          </h2>
          {workshops.map((workshop) => (
            <button
              key={workshop.id}
              onClick={() => setSelectedWorkshop(workshop)}
              className="w-full card hover:shadow-lg transition-shadow text-left p-0 overflow-hidden"
            >
              {/* Imagem ocupando toda a largura */}
              {workshop.imageUrl ? (
                <div className="w-full h-48 relative">
                  <img 
                    src={workshop.imageUrl} 
                    alt={workshop.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Se a imagem não carregar, esconder e mostrar o emoji
                      e.target.style.display = 'none'
                      const emojiDiv = e.target.parentElement?.querySelector('.emoji-fallback')
                      if (emojiDiv) {
                        emojiDiv.classList.remove('hidden')
                        emojiDiv.classList.add('flex')
                      }
                    }}
                  />
                  <div className="text-4xl hidden emoji-fallback absolute inset-0 items-center justify-center bg-orange-100">
                    {workshop.emoji}
                  </div>
                </div>
              ) : (
                <div className="w-full h-48 bg-orange-100 flex items-center justify-center">
                  <span className="text-4xl text-orange-500">{workshop.emoji}</span>
                </div>
              )}
              
              {/* Conteúdo abaixo da imagem */}
              <div className="px-4 py-4">
                <h3 className="font-semibold text-gray-800 text-lg mb-2">
                  {workshop.title}
                </h3>
                <div className="flex items-center space-x-3 text-gray-600 text-sm">
                  <div className="flex items-center space-x-1.5 bg-gray-50 px-2 py-1 rounded-md">
                    <Clock size={14} className="text-orange-500" />
                    <span className="font-medium">{workshop.duration} min</span>
                  </div>
                  <div className="flex items-center space-x-1.5 bg-gray-50 px-2 py-1 rounded-md">
                    <Users size={14} className="text-orange-500" />
                    <span className="font-medium">{workshop.participants}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${getDifficultyColor(workshop.difficulty)}`}>
                    {workshop.difficulty}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Mensagem de boas-vindas */}
      <div className="card bg-white border-gray-200">
        <div className="flex items-center space-x-3">
          <Wrench size={24} className="text-orange-500" />
          <div>
            <h3 className="font-bold text-gray-800 mb-1">Experimentos Científicos</h3>
            <p className="text-gray-600 text-sm">
              Descubra a ciência de forma divertida! Use materiais simples para aprender enquanto se diverte.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkshopPage

