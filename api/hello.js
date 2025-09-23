// api/hello.js - Função sem validação para testar
module.exports = async function handler(req, res) {
  console.log("=== HELLO VERCEL ===");
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

  return res.status(200).json({ 
    success: true, 
    message: "Hello Vercel!",
    method: req.method,
    timestamp: new Date().toISOString(),
    body: req.body
  });
}

