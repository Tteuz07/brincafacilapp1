// Teste com token da Kirvano
const testComToken = async () => {
  try {
    console.log('Testando webhook com token...');
    
    const response = await fetch('https://zbrqgtxrtbsezlutxopz.supabase.co/functions/v1/kirvano-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 12345'
      },
      body: JSON.stringify({
        customer: {
          email: 'teste@exemplo.com'
        },
        sale_id: 'test-123',
        status: 'PAID'
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

testComToken();


