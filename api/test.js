// api/test.js - Teste simples
module.exports = async function handler(req, res) {
  console.log("=== TESTE VERCEL ===");
  console.log("Método:", req.method);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  return res.status(200).json({ 
    success: true, 
    message: "Teste funcionando!",
    method: req.method,
    timestamp: new Date().toISOString()
  });
}

