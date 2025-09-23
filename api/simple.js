// api/simple.js - Função super simples para testar
module.exports = async function handler(req, res) {
  console.log("=== FUNÇÃO SIMPLES VERCEL ===");
  console.log("Método:", req.method);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Método não permitido" });
  }

  // Validação simples de token
  const token = req.body?.token || req.headers?.authorization?.replace('Bearer ', '');
  
  if (token !== 'brincafacil01') {
    console.log("❌ Token inválido:", token);
    return res.status(401).json({ error: "Token inválido" });
  }

  console.log("✅ Token válido!");

  const { email, status } = req.body;

  if (status === "compra_aprovada" && email) {
    console.log(`🎉 Compra aprovada para: ${email}`);
    
    // Por enquanto só retornamos sucesso, sem criar usuário
    return res.status(200).json({ 
      success: true, 
      message: "Webhook processado com sucesso (sem Supabase)",
      data: { email, status },
      timestamp: new Date().toISOString()
    });
  }

  return res.status(200).json({ 
    success: true, 
    message: "Webhook recebido",
    data: { email, status }
  });
}

