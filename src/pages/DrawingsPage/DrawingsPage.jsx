import React, { useState, useEffect } from 'react'
import { ArrowLeft, Download, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf'

const DrawingsPage = () => {
  const navigate = useNavigate()
  const [selectedPdf, setSelectedPdf] = useState(null)
  const [pdfs, setPdfs] = useState([])
  const [convertingPdfs, setConvertingPdfs] = useState(new Set())

  // Lista de arquivos na pasta "Nova pasta"
  const filesInFolder = [
    { filename: '133668440_10270564.jpg' },
    { filename: '134186625_10303738.jpg' },
    { filename: '134336088_10322023.jpg' },
    { filename: '135876688_10316132.jpg' },
    { filename: '135876852_10316114.jpg' },
    { filename: '138123872_10270567.jpg' },
    { filename: '177667260_10312235.jpg' },
    { filename: '177667920_10312228.jpg' },
    { filename: '19598587_v1050-19.jpg' },
    { filename: '23179331_6759850.jpg' },
    { filename: '31711794_7861213.jpg' },
    { filename: '32352958_7935105.jpg' },
    { filename: '32475775_7954227.jpg' },
    { filename: '32987118_8003413.jpg' },
    { filename: '32987122_8002718.jpg' },
    { filename: '36488092_8437067.jpg' },
    { filename: '36488097_8433358.jpg' },
    { filename: '36488120_8437073.jpg' },
    { filename: '36488122_8433548.jpg' },
    { filename: '37004908_8456995.jpg' },
    { filename: '37451882_8520279.jpg' },
    { filename: '37576541_8431335.jpg' },
    { filename: '53024246_x8wt_t5bx_230707.jpg' },
    { filename: '5e8b4e06ff3efa7f3526c30b1ef1f167.jpg' },
    { filename: 'desenho-de-ilustracoes-de-livros-de-colorir (1).jpg' },
    { filename: 'desenho-de-ilustracoes-de-livros-de-colorir (2).jpg' },
    { filename: 'desenho-de-ilustracoes-de-livros-de-colorir.jpg' },
    { filename: 'gato-astronauta-no-espaco-com-bandeira.jpg' },
    { filename: 'um-encantador-unicornio-num-mundo-de-contos-de-fadas.jpg' },
    { filename: 'um-lindo-rapaz-feiticeiro-com-uma-varinha-magica-e-um-chapeu.jpg' }
  ]

  // Função para detectar tipo de arquivo automaticamente
  const detectFileType = (filename) => {
    const ext = filename.toLowerCase().split('.').pop()
    if (ext === 'pdf') return 'pdf'
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) return 'image'
    return 'unknown'
  }

  // Função para extrair nome bonito do filename
  const getNiceName = (filename) => {
    let name = filename
      .replace(/\.[^/.]+$/, '') // Remove extensão
      .replace(/[-_]/g, ' ') // Substitui hífens e underscores por espaços
    
    // Traduzir nomes específicos
    if (name.includes('gato-astronauta')) return 'Gato Astronauta'
    if (name.includes('unicornio')) return 'Unicórnio Encantado'
    if (name.includes('feiticeiro')) return 'Feiticeiro Mágico'
    
    // Se for apenas números, usar nome genérico
    if (/^\d+$/.test(name.replace(/\s/g, ''))) {
      return `Desenho ${name.substring(0, 8)}`
    }
    
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Função para sugerir emoji baseado no nome
  const suggestEmoji = (name) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes('gato') || lowerName.includes('cat')) return '🐱'
    if (lowerName.includes('unicornio') || lowerName.includes('unicorn')) return '🦄'
    if (lowerName.includes('feiticeiro') || lowerName.includes('wizard')) return '🧙'
    if (lowerName.includes('astronauta') || lowerName.includes('astronaut')) return '🚀'
    if (lowerName.includes('bandeira') || lowerName.includes('flag')) return '🚩'
    return '🎨' // Emoji padrão
  }

  // Função para converter imagem para PDF - OTIMIZADA com cache e compressão
  const convertImageToPDF = async (imageUrl, filename) => {
    // Verificar cache primeiro
    const cacheKey = `pdf_cache_${filename}`
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      try {
        const cachedData = JSON.parse(cached)
        // Verificar se o cache não expirou (24 horas)
        const cacheAge = Date.now() - cachedData.timestamp
        if (cacheAge < 24 * 60 * 60 * 1000) {
          // Converter base64 de volta para blob
          const byteCharacters = atob(cachedData.base64)
          const byteNumbers = new Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          const blob = new Blob([byteArray], { type: 'application/pdf' })
          return blob
        }
      } catch (e) {
        console.warn('Erro ao ler cache:', e)
      }
    }

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      img.onload = () => {
        try {
          // Criar PDF com tamanho A4 otimizado (mais leve)
          const pdf = new jsPDF({
            orientation: img.width > img.height ? 'landscape' : 'portrait',
            unit: 'mm',
            compress: true // Ativar compressão
          })
          
          const pdfWidth = pdf.internal.pageSize.getWidth()
          const pdfHeight = pdf.internal.pageSize.getHeight()
          const imgWidth = img.width
          const imgHeight = img.height
          
          // Calcular proporção para caber no A4
          const ratio = Math.min(pdfWidth / (imgWidth * 0.264583), pdfHeight / (imgHeight * 0.264583))
          const width = imgWidth * 0.264583 * ratio
          const height = imgHeight * 0.264583 * ratio
          const x = (pdfWidth - width) / 2
          const y = (pdfHeight - height) / 2
          
          // Usar compressão 'FAST' para melhor performance (ainda mantém boa qualidade)
          pdf.addImage(imageUrl, 'JPEG', x, y, width, height, undefined, 'FAST')
          const pdfBlob = pdf.output('blob', { type: 'application/pdf' })
          
          // Salvar no cache
          const reader = new FileReader()
          reader.onload = () => {
            const base64 = reader.result.split(',')[1]
            localStorage.setItem(cacheKey, JSON.stringify({
              base64,
              timestamp: Date.now()
            }))
          }
          reader.readAsDataURL(pdfBlob)
          
          resolve(pdfBlob)
        } catch (error) {
          reject(error)
        }
      }
      
      img.onerror = () => reject(new Error('Erro ao carregar imagem'))
      img.src = imageUrl
    })
  }

  // Processar arquivos - OTIMIZADO: não converte para PDF imediatamente
  useEffect(() => {
    const processFiles = () => {
      const processedPdfs = []
      
      for (const file of filesInFolder) {
        try {
          const fileType = file.type || detectFileType(file.filename)
          const niceName = file.name || getNiceName(file.filename)
          const emoji = file.emoji || suggestEmoji(niceName)
          
          if (fileType === 'pdf') {
            // Já é PDF, apenas adicionar à lista
            processedPdfs.push({
              filename: file.filename,
              name: 'img',
              emoji,
              pdfUrl: `/Nova%20pasta/${encodeURIComponent(file.filename)}`,
              isConverted: false
            })
          } else if (fileType === 'image') {
            // É imagem - apenas adicionar à lista sem converter ainda
            // A conversão será feita sob demanda quando o usuário clicar para baixar
            const imageUrl = `/Nova%20pasta/${encodeURIComponent(file.filename)}`
            
            processedPdfs.push({
              filename: file.filename,
              name: 'img',
              emoji,
              imageUrl, // URL da imagem original para exibir no card
              isConverted: false, // Será convertido sob demanda
              originalFilename: file.filename
            })
          }
        } catch (error) {
          console.error(`Erro ao processar ${file.filename}:`, error)
        }
      }
      
      setPdfs(processedPdfs)
    }
    
    if (filesInFolder.length > 0) {
      processFiles()
    }
  }, [])

  const handleBack = () => {
    if (selectedPdf) {
      setSelectedPdf(null)
    } else {
      navigate(-1)
    }
  }

  // Visualização do PDF
  if (selectedPdf) {
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
              img
            </h1>
            <p className="text-gray-600 text-sm">
              Sua arte em papel!
            </p>
          </div>
        </div>

        {/* Visualizador de PDF/Imagem */}
        <div className="card p-4 overflow-auto">
          {selectedPdf.imageUrl ? (
            // Mostrar imagem original se disponível
            <div className="w-full min-h-[500px] flex items-center justify-center bg-gray-50 rounded-lg">
              <img
                src={selectedPdf.imageUrl}
                alt="img"
                className="max-w-full max-h-[600px] object-contain"
                onError={(e) => {
                  console.error('Erro ao carregar imagem:', selectedPdf.imageUrl)
                  e.target.style.display = 'none'
                }}
              />
            </div>
          ) : (
            // Mostrar PDF em iframe ou embed
            <div className="w-full h-[600px]">
              <embed
                src={selectedPdf.pdfUrl}
                type="application/pdf"
                className="w-full h-full"
              />
            </div>
          )}
        </div>

        {/* Botão de download - converte sob demanda */}
        <button
          onClick={async () => {
            if (selectedPdf.imageUrl && !selectedPdf.pdfUrl) {
              // Precisa converter para PDF primeiro
              setConvertingPdfs(prev => new Set([...prev, selectedPdf.filename]))
              try {
                const pdfBlob = await convertImageToPDF(selectedPdf.imageUrl, selectedPdf.filename)
                const pdfUrl = URL.createObjectURL(pdfBlob)
                
                // Atualizar o PDF selecionado com a URL do PDF
                setSelectedPdf(prev => ({ ...prev, pdfUrl }))
                
                // Criar link de download
                const link = document.createElement('a')
                link.href = pdfUrl
                link.download = `${selectedPdf.name}.pdf`
                link.click()
              } catch (error) {
                console.error('Erro ao converter para PDF:', error)
                alert('Erro ao converter imagem para PDF. Tente novamente.')
              } finally {
                setConvertingPdfs(prev => {
                  const newSet = new Set(prev)
                  newSet.delete(selectedPdf.filename)
                  return newSet
                })
              }
            } else if (selectedPdf.pdfUrl) {
              // Já tem PDF, apenas baixar
              const link = document.createElement('a')
              link.href = selectedPdf.pdfUrl
              link.download = `${selectedPdf.name}.pdf`
              link.click()
            }
          }}
          disabled={convertingPdfs.has(selectedPdf.filename)}
          className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {convertingPdfs.has(selectedPdf.filename) ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Preparando PDF...</span>
            </>
          ) : (
            <>
              <Download size={20} />
              <span>Baixar Minha Arte!</span>
            </>
          )}
        </button>

        {/* Instruções */}
        <div className="card">
          <h3 className="font-bold text-gray-800 mb-2">Dica Fofa</h3>
          <p className="text-gray-600 text-sm">
            Você pode ver sua arte aqui ou baixar para imprimir e colorir com muito amor!
          </p>
        </div>
      </div>
    )
  }

  // Lista de PDFs
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
              Desenhos para Imprimir ✏️
            </h1>
            <p className="text-gray-600 text-sm">
              Prontos para a diversão!
            </p>
          </div>
      </div>

      {/* Seção de PDFs */}
      {pdfs.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
            <FileText size={20} className="text-primary-500" />
            <span>Minhas Artes Favoritas</span>
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {pdfs.map((pdf, index) => (
              <button
                key={index}
                onClick={() => setSelectedPdf(pdf)}
                className="card hover:shadow-lg transition-shadow text-center relative"
              >
                {pdf.imageUrl ? (
                  <div className="w-full h-48 mb-2 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img 
                      src={pdf.imageUrl} 
                      alt="img"
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 mb-2 rounded-lg bg-gray-100 flex items-center justify-center">
                    <FileText size={48} className="text-gray-400" />
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">img</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DrawingsPage

