// =====================================================
// CÓDIGO PARA ADICIONAR NO Gate.jsx
// =====================================================
// Adicione este código após a linha ~68 (após salvar sessão)
// Localização: Dentro da função checkLicense, após verificar licença válida

// ✅ NOVO: Migrar dados do LocalStorage para Supabase (uma vez)
try {
  const { migrarLocalStorage } = await import('../lib/storageService')
  const resultado = await migrarLocalStorage(email)
  if (resultado.success) {
    if (resultado.migrados) {
      console.log('✅ Dados migrados para Supabase:', resultado.migrados)
    } else {
      console.log('ℹ️ Dados já foram migrados anteriormente')
    }
  }
} catch (error) {
  console.warn('⚠️ Erro na migração (não crítico, app continua funcionando):', error)
}

// Continuar com o código existente (verificação de onboarding, etc.)

