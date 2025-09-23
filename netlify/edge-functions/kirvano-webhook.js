// Webhook super simples para Kirvano
export default async (request) => {
  // Log básico
  console.log("WEBHOOK RECEBIDO:", new Date().toISOString());
  
  // Só aceita POST
  if (request.method !== "POST") {
    return new Response("Método não permitido", { status: 405 });
  }
  
  // Pega o body
  const body = await request.json();
  console.log("DADOS RECEBIDOS:", body);
  
  // Pega o token
  const token = request.headers.get("authorization")?.replace("Bearer ", "") || body?.token;
  
  // Token simples
  if (token === "brincafacil01") {
    console.log("✅ TOKEN VÁLIDO!");
    console.log("📧 EMAIL:", body.email);
    console.log("📊 STATUS:", body.status);
    
    return new Response(JSON.stringify({
      success: true,
      message: "Webhook funcionando!",
      email: body.email,
      status: body.status
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
  
  console.log("❌ TOKEN INVÁLIDO:", token);
  return new Response("Token inválido", { status: 401 });
};