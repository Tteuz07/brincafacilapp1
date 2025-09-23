import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Carrega variáveis de ambiente
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Importa o handler do webhook
import webhookHandler from './api/kirvano-webhook-test.js';

// Rota do webhook da Kirvano
app.post('/api/kirvano-webhook', webhookHandler);

// Rota de teste
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Servidor funcionando!', 
    timestamp: new Date().toISOString(),
    env: {
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasKirvanoToken: !!process.env.KIRVANO_TOKEN
    }
  });
});

// Rota para testar o webhook localmente
app.post('/test-webhook', (req, res) => {
  console.log('=== TESTE WEBHOOK ===');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  
  // Simula o comportamento do webhook
  const { email, status, token } = req.body;
  
  if (token !== process.env.KIRVANO_TOKEN) {
    return res.status(401).json({ error: 'Token inválido' });
  }
  
  if (status === 'compra_aprovada' && email) {
    console.log(`✅ Compra aprovada para: ${email}`);
    return res.json({ 
      success: true, 
      message: `Usuário ${email} seria criado no Supabase` 
    });
  }
  
  res.json({ success: true, message: 'Webhook recebido' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📡 Webhook: http://localhost:${PORT}/api/kirvano-webhook`);
  console.log(`🧪 Teste: http://localhost:${PORT}/test-webhook`);
});
