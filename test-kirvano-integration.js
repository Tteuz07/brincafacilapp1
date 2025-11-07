// Teste da Integração com a Kirvano - Consulta Direta
// Execute este arquivo para verificar se tudo está funcionando

import { checkPurchaseAccess, getLocalPurchaseAccess, clearLocalPurchaseAccess, checkKirvanoConfig } from './src/lib/kirvano.js'

// Função para testar a integração
async function testKirvanoIntegration() {
  console.log('🧪 Testando Integração com a Kirvano - Consulta Direta...\n')
  
  // Verificar configuração
  console.log('🔧 Verificando configuração...')
  const config = checkKirvanoConfig()
  console.log('Configuração:', config)
  console.log(`Modo: ${config.mode}\n`)
  
  // Limpar cache antes dos testes
  clearLocalPurchaseAccess()
  console.log('✅ Cache limpo')
  
  // Teste 1: Email com acesso (demo)
  console.log('\n📧 Teste 1: Email com acesso (demo@brincafacil.com)')
  try {
    const result1 = await checkPurchaseAccess('demo@brincafacil.com')
    console.log('Resultado:', result1)
    if (result1.hasAccess) {
      console.log('✅ Email com acesso funcionando corretamente')
    } else {
      console.log('❌ Email com acesso não está funcionando')
    }
  } catch (error) {
    console.error('❌ Erro no teste 1:', error)
  }
  
  // Teste 2: Email sem acesso
  console.log('\n📧 Teste 2: Email sem acesso (semacesso@exemplo.com)')
  try {
    const result2 = await checkPurchaseAccess('semacesso@exemplo.com')
    console.log('Resultado:', result2)
    if (!result2.hasAccess) {
      console.log('✅ Email sem acesso sendo bloqueado corretamente')
    } else {
      console.log('❌ Email sem acesso não está sendo bloqueado')
    }
  } catch (error) {
    console.error('❌ Erro no teste 2:', error)
  }
  
  // Teste 3: Verificar cache local
  console.log('\n💾 Teste 3: Verificar cache local')
  try {
    const localAccess1 = getLocalPurchaseAccess('demo@brincafacil.com')
    const localAccess2 = getLocalPurchaseAccess('semacesso@exemplo.com')
    
    console.log('Cache para demo@brincafacil.com:', localAccess1)
    console.log('Cache para semacesso@exemplo.com:', localAccess2)
    
    if (localAccess1 && localAccess1.hasAccess) {
      console.log('✅ Cache para email com acesso funcionando')
    } else {
      console.log('❌ Cache para email com acesso não está funcionando')
    }
    
    if (!localAccess2 || !localAccess2.hasAccess) {
      console.log('✅ Cache para email sem acesso funcionando')
    } else {
      console.log('❌ Cache para email sem acesso não está funcionando')
    }
  } catch (error) {
    console.error('❌ Erro no teste 3:', error)
  }
  
  // Teste 4: Verificar acesso múltiplas vezes
  console.log('\n🔄 Teste 4: Verificar acesso múltiplas vezes (deve usar cache)')
  try {
    const startTime = Date.now()
    const result3 = await checkPurchaseAccess('demo@brincafacil.com')
    const endTime = Date.now()
    
    console.log('Resultado:', result3)
    console.log(`Tempo de execução: ${endTime - startTime}ms`)
    
    if (endTime - startTime < 100) {
      console.log('✅ Cache está sendo usado (execução rápida)')
    } else {
      console.log('❌ Cache não está sendo usado (execução lenta)')
    }
  } catch (error) {
    console.error('❌ Erro no teste 4:', error)
  }
  
  console.log('\n🏁 Testes concluídos!')
}

// Executar testes se o arquivo for executado diretamente
if (typeof window === 'undefined') {
  // Node.js
  testKirvanoIntegration().catch(console.error)
} else {
  // Browser
  window.testKirvanoIntegration = testKirvanoIntegration
  console.log('🧪 Para executar os testes, use: window.testKirvanoIntegration()')
}

export { testKirvanoIntegration }

