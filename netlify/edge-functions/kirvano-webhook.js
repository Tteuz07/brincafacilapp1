// netlify/edge-functions/kirvano-webhook.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
        
        try {
          // Conexão com o Supabase
          const supabase = createClient(
            "https://zbrqgtxrtbsezlutxopz.supabase.co",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpicnFndHhydGJzZXpsdXR4b3B6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODExMTUwNCwiZXhwIjoyMDczNjg3NTA0fQ.2Pj0N-cLLnJXQNjKsPt1QOxm7BI8OHsuGjMnHH5pQ2g"
          );

          console.log("🔗 Conectando ao Supabase...");

          // Cria o usuário no Supabase
          const { data, error } = await supabase.auth.admin.createUser({
            email: email,
            email_confirm: true,
            user_metadata: {
              source: 'kirvano_webhook',
              created_at: new Date().toISOString()
            }
          });

          if (error) {
            console.error("❌ Erro ao criar usuário:", error);
            return new Response(JSON.stringify({ 
              success: false, 
              error: "Erro ao criar usuário no Supabase",
              details: error.message 
            }), {
              status: 500,
              headers: { "Content-Type": "application/json" }
            });
          }

          console.log("✅ Usuário criado com sucesso:", data.user?.id);
          
        } catch (error) {
          console.error("❌ Erro inesperado:", error);
          return new Response(JSON.stringify({ 
            success: false, 
            error: "Erro interno do servidor",
            details: error.message 
          }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: "Webhook processado com sucesso",
        data: { email, status }
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
