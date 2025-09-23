// Teste do webhook local
import fetch from 'node-fetch';

const WEBHOOK_URL = 'http://localhost:3001/api/kirvano-webhook';
const TEST_URL = 'http://localhost:3001/test-webhook';

async function testWebhook() {
  console.log('🧪 Testando webhook local...\n');

  // Teste 1: Sem token (deve falhar)
  console.log('1️⃣ Teste sem token:');
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'teste@exemplo.com',
        status: 'compra_aprovada'
      })
    });
    console.log(`Status: ${response.status}`);
    console.log(`Response: ${await response.text()}\n`);
  } catch (error) {
    console.log(`Erro: ${error.message}\n`);
  }

  // Teste 2: Com token no body (deve funcionar)
  console.log('2️⃣ Teste com token no body:');
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'teste@exemplo.com',
        status: 'compra_aprovada',
        token: 'brincafacil01'
      })
    });
    console.log(`Status: ${response.status}`);
    console.log(`Response: ${await response.text()}\n`);
  } catch (error) {
    console.log(`Erro: ${error.message}\n`);
  }

  // Teste 3: Com token no header (deve funcionar)
  console.log('3️⃣ Teste com token no header:');
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer brincafacil01'
      },
      body: JSON.stringify({
        email: 'teste@exemplo.com',
        status: 'compra_aprovada'
      })
    });
    console.log(`Status: ${response.status}`);
    console.log(`Response: ${await response.text()}\n`);
  } catch (error) {
    console.log(`Erro: ${error.message}\n`);
  }

  // Teste 4: Rota de teste simples
  console.log('4️⃣ Teste da rota de teste:');
  try {
    const response = await fetch(TEST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'teste@exemplo.com',
        status: 'compra_aprovada',
        token: 'brincafacil01'
      })
    });
    console.log(`Status: ${response.status}`);
    console.log(`Response: ${await response.text()}\n`);
  } catch (error) {
    console.log(`Erro: ${error.message}\n`);
  }
}

testWebhook();


