// netlify/edge-functions/kirvano-webhook.js
export default async (request, context) => {
  console.log("=== NETLIFY EDGE FUNCTION WEBHOOK ===");
  console.log("Método:", request.method);
  console.log("Headers:", Object.fromEntries(request.headers));
  
  try {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Método não permitido" }), {
        status: 405,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Parse do body
    const body = await request.json();
    console.log("Body recebido:", body);

    // Token esperado
    const expectedToken = "brincafacil01";

    // Captura possíveis formas de envio
    const tokenHeader = request.headers.get("authorization")?.replace("Bearer ", "").trim();
    const tokenBody = body?.token;
    const tokenQuery = new URL(request.url).searchParams.get("token");

    console.log("Tokens encontrados:", {
      tokenHeader,
      tokenBody,
      tokenQuery,
      expectedToken,
    });

    // Valida token
    if (
      tokenHeader === expectedToken ||
      tokenBody === expectedToken ||
      tokenQuery === expectedToken
    ) {
      console.log("✅ Token válido, processando webhook...");

      // Dados recebidos
      const { email, status } = body;
      console.log("Dados da compra:", { email, status });

      if (status === "compra_aprovada" && email) {
        console.log(`🎉 Compra aprovada para: ${email}`);
        
        // Por enquanto, apenas retorna sucesso sem criar usuário
        // TODO: Implementar criação de usuário no Supabase
        console.log("✅ Webhook processado com sucesso (sem criação de usuário)");
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: "Webhook processado com sucesso",
        data: { email, status },
        note: "Usuário não foi criado no Supabase ainda"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    console.log("❌ Token inválido ou ausente");
    return new Response(JSON.stringify({ error: "Unauthorized - Token inválido" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("❌ Erro no webhook:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: "Erro interno do servidor",
      details: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
