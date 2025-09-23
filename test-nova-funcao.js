// Teste da nova função
const testNovaFuncao = async () => {
  try {
    console.log('Testando nova função...');
    
    const response = await fetch('https://zbrqgtxrtbsezlutxopz.supabase.co/functions/v1/webhook-teste', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        test: 'nova função',
        message: 'teste sem validação'
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

testNovaFuncao();



