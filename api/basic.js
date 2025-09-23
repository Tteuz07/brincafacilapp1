// api/basic.js - Função super básica
module.exports = (req, res) => {
  res.status(200).json({ 
    message: "Funcionando!",
    method: req.method,
    timestamp: new Date().toISOString()
  });
}

