import React, { useState } from 'react'
import { ShoppingBag, X, ChevronLeft, ChevronRight, ExternalLink, Star, Search } from 'lucide-react'

const ShopPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [failedImages, setFailedImages] = useState(new Set())

  // Produtos da lojinha - você pode adicionar seus produtos aqui
  const products = [
    {
      id: 1,
      name: 'Kit Alfabeto + Numerais + Formas + Mapa do Brasil Brinquedos pedagógicos',
      price: 65.90,
      originalPrice: 82.90,
      image: '/produtos/Produto 1/1.webp',
      images: [
        '/produtos/Produto 1/1.webp',
        '/produtos/Produto 1/produto 1.1.webp',
        '/produtos/Produto 1/produto1.2.webp',
        '/produtos/Produto 1/produto1.3.webp'
      ],
      shopeeUrl: 'https://shopee.com.br/produto1',
      description: 'Kit completo de brinquedos pedagógicos com alfabeto, numerais, formas geométricas e mapa do Brasil. Ideal para desenvolver habilidades cognitivas, coordenação motora e aprendizado de forma lúdica e divertida.',
      rating: 4.9,
      reviews: 495
    },
    {
      id: 2,
      name: 'Quebra-Cabeças Coloridos De Madeira Arco-Íris',
      price: 19.99,
      originalPrice: 33.99,
      image: '/produtos/Produto 2/1.webp',
      images: [
        '/produtos/Produto 2/1.webp',
        '/produtos/Produto 2/sg-11134201-7rasd-mavnwepdfdk250@resize_w900_nl.webp',
        '/produtos/Produto 2/sg-11134201-7rauy-mavnwcoyddvab0@resize_w900_nl.webp'
      ],
      shopeeUrl: 'https://s.shopee.com.br/3qF0Eacn1l',
      description: 'Quebra-cabeças coloridos de madeira com formato arco-íris. Ideal para desenvolver habilidades motoras, coordenação e raciocínio lógico de forma divertida e educativa.',
      rating: 4.8,
      reviews: 193
    },
    {
      id: 3,
      name: 'Kit Brinquedo Pedagógico Educativo Madeira Xilofone + Prancha Seleção + Aramado M + Cubo De Encaixe',
      price: 99.88,
      originalPrice: 99.88,
      image: '/produtos/Produto 3/1.webp',
      images: [
        '/produtos/Produto 3/1.webp',
        '/produtos/Produto 3/br-11134207-7r98o-lz3nmpuegrwh29@resize_w900_nl.webp',
        '/produtos/Produto 3/br-11134207-81z1k-men8zgd64g0128.webp'
      ],
      shopeeUrl: 'https://s.shopee.com.br/3qF0Ed2JN9',
      description: 'Kit completo de brinquedos pedagógicos em madeira com xilofone, prancha de seleção, aramado e cubo de encaixe. Perfeito para desenvolver habilidades motoras, coordenação e criatividade.',
      rating: 4.8,
      reviews: 462
    },
    {
      id: 4,
      name: 'Jogo Memória Animais Fazenda Safari Brinquedos De Menina Menino Alfabetização Educativo Pedagógico',
      price: 29.90,
      originalPrice: 39.90,
      image: '/produtos/Produto 4/1.webp',
      images: [
        '/produtos/Produto 4/1.webp',
        '/produtos/Produto 4/br-11134207-7r98o-mchz5dxps7xu2e@resize_w900_nl.webp',
        '/produtos/Produto 4/br-11134207-7r98o-mchz5dxzds75f8@resize_w900_nl.webp'
      ],
      shopeeUrl: 'https://s.shopee.com.br/5VNEDjYkwc',
      description: 'Jogo de memória com animais da fazenda e safari. Ideal para desenvolver habilidades cognitivas, memória e concentração de forma lúdica e educativa.',
      rating: 4.9,
      reviews: 534
    },
    {
      id: 5,
      name: 'Brinquedo Educativo Formando Palavras Pedagógico Madeira e Papel',
      price: 28.61,
      originalPrice: 28.61,
      image: '/produtos/Produto 5/1.webp',
      images: [
        '/produtos/Produto 5/1.webp',
        '/produtos/Produto 5/br-11134207-81z1k-mg7xyp1cqcxxbb.webp',
        '/produtos/Produto 5/br-11134207-81z1k-mg7xyp1ct62tfc.webp'
      ],
      shopeeUrl: 'https://s.shopee.com.br/9pWDNkuiK5',
      description: 'Brinquedo educativo em madeira e papel para formar palavras. Perfeito para desenvolver habilidades de alfabetização, leitura e escrita de forma divertida e interativa.',
      rating: 4.8,
      reviews: 10000
    },
    {
      id: 6,
      name: 'Cubo Didático Grande Formas Encaixar Brinquedo Educativo Bebê',
      price: 85.99,
      originalPrice: 85.99,
      image: '/produtos/Produto 6/1.webp',
      images: [
        '/produtos/Produto 6/1.webp',
        '/produtos/Produto 6/sg-11134201-7qved-li97xh9i3nyl37@resize_w900_nl.webp',
        '/produtos/Produto 6/sg-11134201-7qvfz-li97xnc5943x23.webp'
      ],
      shopeeUrl: 'https://s.shopee.com.br/12HfiDk4k',
      description: 'Cubo didático grande com formas para encaixar. Ideal para desenvolver habilidades motoras, coordenação e reconhecimento de formas de forma lúdica e educativa.',
      rating: 4.9,
      reviews: 2000
    },
    {
      id: 7,
      name: 'Cubo Didático Encaixe Peças Educativo Pedagógico',
      price: 17.90,
      originalPrice: 17.90,
      image: '/produtos/Produto 7/1.webp',
      images: [
        '/produtos/Produto 7/1.webp',
        '/produtos/Produto 7/br-11134207-7r98o-lpb9nm9pembp2c@resize_w900_nl.webp',
        '/produtos/Produto 7/br-11134207-81z1k-mfl2xb1biznoc1@resize_w900_nl.webp'
      ],
      shopeeUrl: 'https://s.shopee.com.br/20nM3QreHk',
      description: 'Cubo didático com peças para encaixar. Perfeito para desenvolver habilidades motoras, coordenação e raciocínio lógico de forma divertida e educativa.',
      rating: 4.8,
      reviews: 4000
    },
    {
      id: 8,
      name: 'Brinquedo Pedagógico Educativo Aramado Montanha Russa Tamanho M',
      price: 34.90,
      originalPrice: 34.90,
      image: '/produtos/Produto 8/1.webp',
      images: [
        '/produtos/Produto 8/1.webp',
        '/produtos/Produto 8/br-11134207-7r98o-ls276m3yyvwtee@resize_w900_nl.webp',
        '/produtos/Produto 8/br-11134207-81z1k-met94tmwth4zc7@resize_w900_nl.webp'
      ],
      shopeeUrl: 'https://s.shopee.com.br/9zpdaBUmST',
      description: 'Brinquedo pedagógico educativo aramado em formato de montanha russa tamanho M. Ideal para desenvolver habilidades motoras, coordenação e criatividade de forma divertida.',
      rating: 4.8,
      reviews: 9000
    },
    {
      id: 9,
      name: 'Brinquedos Educativos Monta & Desmonta-Diversão e Aprendizado',
      price: 19.90,
      originalPrice: 19.90,
      image: '/produtos/Produto 9/1.webp',
      images: [
        '/produtos/Produto 9/1.webp',
        '/produtos/Produto 9/sg-11134201-7renf-m8go75yn3u7d9c.webp',
        '/produtos/Produto 9/sg-11134201-7reqg-m8go76whouqvb1.webp'
      ],
      shopeeUrl: 'https://s.shopee.com.br/Lf84SiRHZ',
      description: 'Brinquedos educativos que podem ser montados e desmontados. Perfeito para desenvolver habilidades motoras, coordenação e raciocínio lógico de forma divertida e educativa.',
      rating: 4.9,
      reviews: 666
    },
    {
      id: 10,
      name: 'Brinquedo Educativo Pedagógico Aprendendo o Alfabeto Original Divertido - Coluna',
      price: 21.98,
      originalPrice: 21.98,
      image: '/produtos/Produto 10/1.webp',
      images: [
        '/produtos/Produto 10/1.webp',
        '/produtos/Produto 10/br-11134207-7r98o-load1m0cjg7g23@resize_w900_nl.webp',
        '/produtos/Produto 10/br-11134207-7r98o-load1m0cjgrtad.webp'
      ],
      shopeeUrl: 'https://s.shopee.com.br/6KwLDX2ia7',
      description: 'Brinquedo educativo pedagógico para aprender o alfabeto em formato de coluna. Ideal para desenvolver habilidades de alfabetização, leitura e escrita de forma divertida e interativa.',
      rating: 4.8,
      reviews: 279
    },
    {
      id: 11,
      name: 'Kit 10 Quebra Cabeça em Mdf 9 Peças Jogo Pedagógico Infantil Lúdico Educativo',
      price: 45.90,
      originalPrice: 45.90,
      image: '/produtos/Produto 11/1.webp',
      images: [
        '/produtos/Produto 11/1.webp',
        '/produtos/Produto 11/sg-11134201-7rd49-m77b8pmdwk2ac6@resize_w900_nl.webp',
        '/produtos/Produto 11/sg-11134201-7rd5m-m77b8ylmrk9gb8@resize_w900_nl.webp'
      ],
      shopeeUrl: 'https://s.shopee.com.br/10uornCfvL',
      description: 'Kit com 10 quebra-cabeças em MDF com 9 peças cada. Perfeito para desenvolver habilidades cognitivas, coordenação motora e raciocínio lógico de forma lúdica e educativa.',
      rating: 5.0,
      reviews: 3000
    },
    {
      id: 12,
      name: 'Brinquedo Educativo Tetris Tabuleiro Madeira Mdf - Mega Impress',
      price: 27.90,
      originalPrice: 27.90,
      image: '/produtos/Produto 12/1.webp',
      images: [
        '/produtos/Produto 12/1.webp',
        '/produtos/Produto 12/sg-11134201-7qve0-ljbpgulqzl1lfe.webp',
        '/produtos/Produto 12/sg-11134201-7qvfj-ljbpgnp53do7d3.webp'
      ],
      shopeeUrl: 'https://s.shopee.com.br/Lf84gciOr',
      description: 'Brinquedo educativo Tetris em tabuleiro de madeira MDF. Ideal para desenvolver habilidades motoras, coordenação e raciocínio lógico de forma divertida e educativa.',
      rating: 4.9,
      reviews: 8000
    },
    {
      id: 13,
      name: 'Brinquedo Jogo Educativo Pegagogico Formando Palavras Infantil 4 anos',
      price: 24.65,
      originalPrice: 24.65,
      image: '/produtos/Produto 13/1.webp',
      images: [
        '/produtos/Produto 13/1.webp',
        '/produtos/Produto 13/22ab6614570b760a075e9cc73de2a708.webp',
        '/produtos/Produto 13/608e0c415ddebff7781de51f15379cac.webp'
      ],
      shopeeUrl: 'https://s.shopee.com.br/3Vc9qbOIy9',
      description: 'Brinquedo jogo educativo pedagógico para formar palavras. Ideal para crianças a partir de 4 anos desenvolverem habilidades de alfabetização, leitura e escrita de forma divertida.',
      rating: 4.9,
      reviews: 1000
    },
    {
      id: 14,
      name: 'Jogo Da Memoria Infantil Brinquedo Pedagogico Mdf Fazendinha',
      price: 21.68,
      originalPrice: 21.68,
      image: '/produtos/Produto 14/1.webp',
      images: [
        '/produtos/Produto 14/1.webp',
        '/produtos/Produto 14/sg-11134201-824g4-mehjt3wf3qipa0.webp',
        '/produtos/Produto 14/sg-11134201-824iu-mehjt1z30kqp4b.webp'
      ],
      shopeeUrl: 'https://s.shopee.com.br/9pWDOIKudt',
      description: 'Jogo da memória infantil com tema fazendinha em MDF. Perfeito para desenvolver habilidades cognitivas, memória e concentração de forma lúdica e educativa.',
      rating: 4.9,
      reviews: 379
    },
    {
      id: 15,
      name: 'Brinquedo Bancadinha com Martelo e Pinos Geométricos Educativo, Criativo e Interativo para Crianças',
      price: 27.99,
      originalPrice: 27.99,
      image: '/produtos/Produto 15/1.webp',
      images: [
        '/produtos/Produto 15/1.webp',
        '/produtos/Produto 15/br-11134207-7r98o-m6mj6v80g3tz42.webp',
        '/produtos/Produto 15/br-11134207-7r98o-mcwgizjjy0ox33.webp'
      ],
      shopeeUrl: 'https://s.shopee.com.br/20nM3zdVhI',
      description: 'Brinquedo bancadinha com martelo e pinos geométricos. Ideal para desenvolver habilidades motoras, coordenação e reconhecimento de formas de forma criativa e interativa.',
      rating: 4.9,
      reviews: 6000
    },
    {
      id: 16,
      name: 'Quebra Cabeça Alfabeto 26Pç Madeira Alfabetizando Educativo',
      price: 25.95,
      originalPrice: 25.95,
      image: '/produtos/Produto 16/1.webp',
      images: [
        '/produtos/Produto 16/1.webp',
        '/produtos/Produto 16/sg-11134201-7qves-lkbdpfp6ib1i15.webp',
        '/produtos/Produto 16/sg-11134201-7qvfu-lkbdphhtvp3053.webp'
      ],
      shopeeUrl: 'https://s.shopee.com.br/AUluBg5XIQ',
      description: 'Quebra-cabeça do alfabeto com 26 peças em madeira. Perfeito para desenvolver habilidades de alfabetização, reconhecimento de letras e coordenação motora de forma educativa.',
      rating: 4.9,
      reviews: 1000
    },
    {
      id: 17,
      name: 'Blocos de Encaixes Vertical com 25 Peças Coloridos em Madeira Jogo Educativo Tetris Brinquedo',
      price: 38.99,
      originalPrice: 38.99,
      image: '/produtos/Produto 17/1.webp',
      images: [
        '/produtos/Produto 17/1.webp',
        '/produtos/Produto 17/br-11134207-7r98o-lpusdz04l63je3@resize_w900_nl.webp',
        '/produtos/Produto 17/br-11134211-7r98o-llb99443wdor94@resize_w900_nl.webp'
      ],
      shopeeUrl: 'https://s.shopee.com.br/BLhskyrD1',
      description: 'Blocos de encaixes vertical com 25 peças coloridas em madeira estilo Tetris. Ideal para desenvolver habilidades motoras, coordenação e raciocínio lógico de forma divertida e educativa.',
      rating: 4.9,
      reviews: 1000
    },
    {
      id: 18,
      name: 'Jogo Educativo Formando Palavras 112 Letras Madeira',
      price: 27.99,
      originalPrice: 27.99,
      image: '/produtos/Produto 18/1.webp',
      images: [
        '/produtos/Produto 18/1.webp',
        '/produtos/Produto 18/cd4344b0e0b4232032c71f87ddd1bc58@resize_w900_nl.webp'
      ],
      shopeeUrl: 'https://s.shopee.com.br/8pdgCvZ4Ys',
      description: 'Jogo educativo para formar palavras com 112 letras em madeira. Perfeito para desenvolver habilidades de alfabetização, leitura e escrita de forma divertida e interativa.',
      rating: 4.8,
      reviews: 7000
    },
    {
      id: 19,
      name: 'Brinquedo Pedagógico Montessori Encaixe Divertido Formas Mdf Tetris Encaixes Colunas Cores e Formas',
      price: 26.90,
      originalPrice: 26.90,
      image: '/produtos/Produto 19/1.webp',
      images: [
        '/produtos/Produto 19/1.webp',
        '/produtos/Produto 19/3a83d26b45c92546590854e3c61854d2.webp',
        '/produtos/Produto 19/br-11134207-7r98o-lktynf92382g7b.webp'
      ],
      shopeeUrl: 'https://s.shopee.com.br/7AVSDy3OL9',
      description: 'Brinquedo pedagógico Montessori com encaixe divertido de formas em MDF estilo Tetris. Ideal para desenvolver habilidades motoras, coordenação e reconhecimento de cores e formas de forma educativa.',
      rating: 4.8,
      reviews: 1000
    },
    {
      id: 20,
      name: 'Brinquedo Educativo Encaixe Divertido Formas Jogos Brinquedos Infantil Bebê',
      price: 12.95,
      originalPrice: 12.95,
      image: '/produtos/Produto 20/1.webp',
      images: [
        '/produtos/Produto 20/1.webp',
        '/produtos/Produto 20/br-11134207-7r98o-lnd9s3j1qqbz19.webp',
        '/produtos/Produto 20/br-11134207-7r98o-lnd9s3j1s4wcfe.webp'
      ],
      shopeeUrl: 'https://s.shopee.com.br/gHyU4Zeid',
      description: 'Brinquedo educativo com encaixe divertido de formas. Ideal para bebês e crianças desenvolverem habilidades motoras, coordenação e reconhecimento de formas de forma lúdica e educativa.',
      rating: 4.8,
      reviews: 916
    },
    {
      id: 21,
      name: 'Quebra Cabeça Infantil Criativo 60 Peças Encaixe Festa Educativo',
      price: 19.99,
      originalPrice: 19.99,
      image: '/produtos/Produto 21/1.webp',
      images: [
        '/produtos/Produto 21/1.webp',
        '/produtos/Produto 21/sg-11134201-7reng-m2cjlhkilv5k0b.webp',
        '/produtos/Produto 21/sg-11134201-7rent-m2cjlhkslgebf0.webp'
      ],
      shopeeUrl: 'https://s.shopee.com.br/804ZDdIuyK',
      description: 'Quebra-cabeça infantil criativo com 60 peças para encaixe temático de festa. Perfeito para desenvolver habilidades cognitivas, coordenação motora e raciocínio lógico de forma divertida.',
      rating: 4.6,
      reviews: 3000
    },
    {
      id: 22,
      name: 'Brinquedo Educativo Pedagogico Pescaria Divertida Com Imã Toymix',
      price: 52.90,
      originalPrice: 52.90,
      image: '/produtos/Produto 22/1.webp',
      images: [
        '/produtos/Produto 22/1.webp',
        '/produtos/Produto 22/br-11134207-7r98o-m4ad9a7kcrltd5.webp',
        '/produtos/Produto 22/db86d4d5f601e2a3ebed140bac574039.webp'
      ],
      shopeeUrl: 'https://s.shopee.com.br/3AzJSnrm0n',
      description: 'Brinquedo educativo pedagógico de pescaria divertida com imã. Ideal para desenvolver habilidades motoras, coordenação e concentração de forma lúdica e educativa.',
      rating: 4.9,
      reviews: 6000
    }
  ]

  const handleImageError = (imageUrl) => {
    setFailedImages(prev => new Set([...prev, imageUrl]))
  }

  const getValidImages = (images) => {
    if (!images || !Array.isArray(images)) return []
    return images.filter(img => !failedImages.has(img))
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setCurrentImageIndex(0)
    setFailedImages(new Set()) // Reset failed images when opening a new product
    // Bloquear scroll do body quando modal abrir
    document.documentElement.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setSelectedProduct(null)
    setCurrentImageIndex(0)
    setFailedImages(new Set())
    // Restaurar scroll do body quando modal fechar
    document.documentElement.style.overflow = ''
  }

  const nextImage = () => {
    if (selectedProduct?.images) {
      const validImages = getValidImages(selectedProduct.images)
      if (validImages.length > 0) {
        const currentValidIndex = validImages.findIndex(img => img === selectedProduct.images[currentImageIndex])
        const nextValidIndex = currentValidIndex === validImages.length - 1 ? 0 : currentValidIndex + 1
        const nextImageUrl = validImages[nextValidIndex]
        const nextIndex = selectedProduct.images.indexOf(nextImageUrl)
        setCurrentImageIndex(nextIndex >= 0 ? nextIndex : 0)
      }
    }
  }

  const prevImage = () => {
    if (selectedProduct?.images) {
      const validImages = getValidImages(selectedProduct.images)
      if (validImages.length > 0) {
        const currentValidIndex = validImages.findIndex(img => img === selectedProduct.images[currentImageIndex])
        const prevValidIndex = currentValidIndex === 0 ? validImages.length - 1 : currentValidIndex - 1
        const prevImageUrl = validImages[prevValidIndex]
        const prevIndex = selectedProduct.images.indexOf(prevImageUrl)
        setCurrentImageIndex(prevIndex >= 0 ? prevIndex : 0)
      }
    }
  }

  const handleBuyClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const calculateDiscount = (price, originalPrice) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  }

  // Formatar números para exibição (ex: 1000 -> 1mil+)
  const formatNumber = (num) => {
    if (num >= 1000) {
      const k = Math.floor(num / 1000)
      return `${k}mil+`
    }
    return num.toString()
  }

  // Filtrar produtos por busca
  const filteredProducts = products.filter(product => {
    if (!searchTerm) return true
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 pb-20">
      <div className="container-app py-4 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Lojinha 🛍️
          </h1>
          <p className="text-gray-600 text-sm">
            {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} disponível{filteredProducts.length !== 1 ? 'is' : ''}
          </p>
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-12 pr-4"
          />
        </div>

        {/* Grid de Produtos - Estilo Shopee Mobile */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-500">
              {searchTerm ? `Não encontramos produtos para "${searchTerm}"` : 'Em breve novos produtos!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => {
              const discount = calculateDiscount(product.price, product.originalPrice)
              
              return (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer border border-gray-100"
                >
                  {/* Imagem do Produto */}
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=Produto'
                      }}
                    />
                    
                    {/* Badge de Desconto */}
                    {discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                        -{discount}%
                      </div>
                    )}
                  </div>

                  {/* Informações do Produto */}
                  <div className="p-3 space-y-2">
                    {/* Nome */}
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>

                    {/* Avaliação e Vendidos */}
                    {product.rating && (
                      <div className="flex items-center gap-1">
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs font-semibold text-gray-700 ml-1">
                            {product.rating}
                          </span>
                        </div>
                        {product.reviews && (
                          <span className="text-xs text-gray-500">
                            ({formatNumber(product.reviews)} vendidos)
                          </span>
                        )}
                      </div>
                    )}

                    {/* Preço */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary-500">
                          R$ {product.price.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through">
                          R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Modal do Produto - Mesmo estilo do modal de desenhos */}
        {selectedProduct && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
            onClick={closeModal}
          >
            <div 
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              {/* Header com botão fechar */}
              <div className="flex justify-end items-center p-4 border-b">
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors z-10 relative"
                  type="button"
                  aria-label="Fechar modal"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>
              
              {/* Galeria de Imagens - Mesmo estilo do modal de desenhos */}
              <div className="relative">
                <div className="bg-gradient-to-br from-primary-100 to-primary-200 relative overflow-hidden min-h-[300px] flex items-center justify-center">
                  {(() => {
                    const validImages = getValidImages(selectedProduct.images)
                    const currentImage = selectedProduct.images[currentImageIndex]
                    const isValidImage = currentImage && !failedImages.has(currentImage)
                    
                    if (validImages.length === 0 || !isValidImage) {
                      return (
                        <img 
                          src={selectedProduct.image} 
                          alt={selectedProduct.name}
                          className="w-full h-auto max-h-[500px] object-contain"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/800x450/f3f4f6/9ca3af?text=Produto'
                          }}
                        />
                      )
                    }
                    
                    return (
                      <img 
                        src={currentImage} 
                        alt={selectedProduct.name}
                        className="w-full h-auto max-h-[500px] object-contain"
                        onError={(e) => {
                          handleImageError(currentImage)
                          const remainingValid = getValidImages(selectedProduct.images).filter(img => img !== currentImage)
                          if (remainingValid.length > 0) {
                            const nextValidIndex = selectedProduct.images.indexOf(remainingValid[0])
                            if (nextValidIndex >= 0) {
                              setCurrentImageIndex(nextValidIndex)
                            }
                          }
                          e.target.src = selectedProduct.image || 'https://via.placeholder.com/800x450/f3f4f6/9ca3af?text=Produto'
                        }}
                      />
                    )
                  })()}
                  
                  {/* Controles da galeria */}
                  {(() => {
                    const validImages = getValidImages(selectedProduct.images)
                    if (validImages.length > 1) {
                      return (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                          >
                            <ChevronLeft size={20} className="text-gray-700" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                          >
                            <ChevronRight size={20} className="text-gray-700" />
                          </button>
                          
                          {/* Indicadores */}
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {validImages.map((_, index) => {
                              const originalIndex = selectedProduct.images.indexOf(validImages[index])
                              return (
                                <button
                                  key={originalIndex}
                                  onClick={() => setCurrentImageIndex(originalIndex)}
                                  className={`w-2 h-2 rounded-full transition-colors ${
                                    originalIndex === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                  }`}
                                />
                              )
                            })}
                          </div>
                        </>
                      )
                    }
                    return null
                  })()}
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-6">
                {/* Nome do produto - Abaixo da imagem */}
                <h2 className="text-xl font-bold text-gray-800 mb-4">{selectedProduct.name}</h2>
                
                {/* Metadados principais */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 flex-wrap gap-2">
                    {selectedProduct.rating && (
                      <div className="flex items-center space-x-1">
                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                        <span className="font-medium text-sm">{selectedProduct.rating}</span>
                      </div>
                    )}
                    {selectedProduct.reviews && (
                      <span className="text-gray-600 text-sm">{formatNumber(selectedProduct.reviews)} vendidos</span>
                    )}
                  </div>
                </div>

                {/* Descrição */}
                {selectedProduct.description && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2 text-sm">Sobre o produto</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{selectedProduct.description}</p>
                  </div>
                )}

                {/* Preço */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-2xl font-bold text-primary-500">
                      R$ {selectedProduct.price.toFixed(2).replace('.', ',')}
                    </span>
                    {selectedProduct.originalPrice > selectedProduct.price && (
                      <span className="text-base text-gray-400 line-through">
                        R$ {selectedProduct.originalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                  
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <span className="inline-flex items-center bg-red-50 text-red-600 px-2.5 py-1 rounded-md text-xs font-semibold">
                      Economia de {calculateDiscount(selectedProduct.price, selectedProduct.originalPrice)}%
                    </span>
                  )}
                </div>

                {/* Botão de ação */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleBuyClick(selectedProduct.shopeeUrl)
                  }}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingBag size={20} />
                  <span>Comprar Agora</span>
                  <ExternalLink size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShopPage
