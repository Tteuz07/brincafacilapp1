// netlify/functions/kirvano-webhook.js
const { createClient } = require("@supabase/supabase-js");

// Token configurado no painel da Kirvano
const WEBHOOK_TOKEN = process.env.KIRVANO_TOKEN || "brincafacil01";

exports.handler = async (event, context) => {
  console.log("=== NETLIFY WEBHOOK ===");
  console.log("Método:", event.httpMethod);
  console.log("Headers:", event.headers);
  console.log("Body:", event.body);

  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Método não permitido" })
      };
    }

    // Parse do body
    const body = JSON.parse(event.body || "{}");

    // Busca o token em diferentes lugares
    const tokenHeader = event.headers["authorization"];
    const tokenBody = body?.token;
    const tokenQuery = event.queryStringParameters?.token;

    let cleanHeaderToken = null;
    if (tokenHeader) {
      cleanHeaderToken = tokenHeader.replace("Bearer ", "").trim();
    }

    console.log("Tokens encontrados:", {
      tokenHeader: cleanHeaderToken,
      tokenBody,
      tokenQuery,
      expectedToken: WEBHOOK_TOKEN
    });

    // Valida token
    if (
      cleanHeaderToken !== WEBHOOK_TOKEN &&
      tokenBody !== WEBHOOK_TOKEN &&
      tokenQuery !== WEBHOOK_TOKEN
    ) {
      console.log("❌ Token inválido");
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Token inválido" })
      };
    }

    console.log("✅ Token válido!");

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
          return {
            statusCode: 500,
            body: JSON.stringify({ 
              success: false, 
              error: "Erro ao criar usuário no Supabase",
              details: error.message 
            })
          };
        }

        console.log("✅ Usuário criado com sucesso:", data.user?.id);
        
      } catch (error) {
        console.error("❌ Erro inesperado:", error);
        return {
          statusCode: 500,
          body: JSON.stringify({ 
            success: false, 
            error: "Erro interno do servidor",
            details: error.message 
          })
        };
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: "Webhook processado com sucesso",
        data: { email, status }
      })
    };

  } catch (error) {
    console.error("❌ Erro no webhook:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        error: "Erro interno do servidor",
        details: error.message 
      })
    };
  }
};

