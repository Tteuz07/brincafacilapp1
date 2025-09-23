import React from 'react'

const TestImage = () => {
  const testImageUrl = 'http://localhost:5177/Brincadeiras/tesouro.png'
  const testImageUrlRelativa = '/Brincadeiras/tesouro.png'
  
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🧪 Teste de Imagem - Caça ao Tesouro Lógico</h1>
      
      <div style={{ margin: '20px 0' }}>
        <h2>Teste com URL absoluta:</h2>
        <img 
          src={testImageUrl}
          alt="Caça ao Tesouro Lógico"
          style={{ 
            width: '300px', 
            height: '200px', 
            objectFit: 'cover',
            border: '2px solid #ddd',
            borderRadius: '10px'
          }}
          onLoad={() => console.log('✅ IMAGEM TESOURO ABSOLUTA CARREGADA COM SUCESSO!')}
          onError={(e) => console.error('❌ ERRO AO CARREGAR IMAGEM TESOURO ABSOLUTA:', e)}
        />
      </div>
      
      <div style={{ margin: '20px 0' }}>
        <h2>Teste com URL relativa:</h2>
        <img 
          src={testImageUrlRelativa}
          alt="Caça ao Tesouro Lógico"
          style={{ 
            width: '300px', 
            height: '200px', 
            objectFit: 'cover',
            border: '2px solid #ddd',
            borderRadius: '10px'
          }}
          onLoad={() => console.log('✅ IMAGEM TESOURO RELATIVA CARREGADA COM SUCESSO!')}
          onError={(e) => console.error('❌ ERRO AO CARREGAR IMAGEM TESOURO RELATIVA:', e)}
        />
      </div>
      
      <div style={{ margin: '20px 0' }}>
        <p><strong>URL Absoluta:</strong> {testImageUrl}</p>
        <p><strong>URL Relativa:</strong> {testImageUrlRelativa}</p>
        <p><strong>Servidor:</strong> http://localhost:5177</p>
      </div>
      
      <div style={{ margin: '20px 0', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px' }}>
        <h3>🔍 Debug da Brincadeira:</h3>
        <p>Verifique no console do navegador os logs:</p>
        <ul style={{ textAlign: 'left', display: 'inline-block' }}>
          <li>🏴‍☠️ CAÇA AO TESOURO LÓGICO CRIADA</li>
          <li>🏴‍☠️ DEBUG CAÇA AO TESOURO LÓGICO</li>
          <li>✅ IMAGEM TESOURO CARREGADA COM SUCESSO!</li>
        </ul>
      </div>
    </div>
  )
}

export default TestImage
