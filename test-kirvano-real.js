// Teste do Sistema REAL da Kirvano
// Execute: node test-kirvano-real.js

import { checkKirvanoPurchase, checkKirvanoConfig, setKirvanoApiKey } from './src/lib/kirvano-real.js'

async function testKirvanoReal() {
  console.log('🧪 TESTANDO SISTEMA REAL DA KIRVANO\n')
  
  // 1. Verificar configuração
  console.log('🔧 Verificando configuração...')
  const config = checkKirvanoConfig()
  console.log('Configuração:', config)
  
  if (!config.configured) {
    console.log('\n❌ SISTEMA NÃO CONFIGURADO!')
    console.log('Configure a API Key em src/lib/kirvano-real.js')
    console.log('Veja o arquivo CONFIGURAR-KIRVANO.md para instruções')
    return
  }
  
  console.log('\n✅ Sistema configurado! Testando...')
  
  // 2. Testar com email da compra real
  const emailTeste = 'teuzinxn170@gmail.com' // Email da compra mostrada na imagem
  
  console.log(`\n📧 Testando email: ${emailTeste}`)
  
  try {
    const result = await checkKirvanoPurchase(emailTeste)
    
    if (result.hasAccess) {
      console.log('✅ SUCESSO! Compra encontrada:')
      console.log('📋 Dados da compra:', result.purchaseData)
    } else {
      console.log('❌ Nenhuma compra encontrada para este email')
      console.log('Resposta:', result)
    }
    
  } catch (error) {
    console.error('❌ ERRO ao consultar Kirvano:', error.message)
    
    if (error.message.includes('401')) {
      console.log('\n💡 Dica: Erro 401 = API Key inválida')
      console.log('Verifique se a API Key está correta no painel da Kirvano')
    }
    
    if (error.message.includes('404')) {
      console.log('\n💡 Dica: Erro 404 = Product ID inválido')
      console.log('Verifique se o Product ID está correto')
    }
  }
  
  console.log('\n🏁 Teste concluído!')
}

// Executar teste
testKirvanoReal().catch(console.error)




