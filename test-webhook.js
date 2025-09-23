// Teste da Edge Function
const testWebhook = async () => {
  try {
    const response = await fetch('https://zbrqgtxrtbsezlutxopz.supabase.co/functions/v1/kirvano-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        test: 'webhook test',
        email: 'teste@exemplo.com',
        sale_id: 'test-123',
        status: 'PAID'
      })
    });

    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    
    const text = await response.text();
    console.log('Response:', text);
    
  } catch (error) {
    console.error('Erro:', error);
  }
};

testWebhook();



