// Teste da função de logs
const testLogs = async () => {
  try {
    console.log('Testando função de logs...');
    
    const response = await fetch('https://zbrqgtxrtbsezlutxopz.supabase.co/functions/v1/test-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        test: 'logs',
        message: 'teste de logs'
      })
    });

    console.log('Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Sucesso:', data);
    } else {
      const error = await response.text();
      console.log('❌ Erro:', error);
    }
    
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
};

testLogs();


