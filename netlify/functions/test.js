exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      message: "Teste funcionando!",
      timestamp: new Date().toISOString()
    })
  };
};
