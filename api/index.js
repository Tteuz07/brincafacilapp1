// api/index.js - Vercel Serverless Function
const { createClient } = require("@supabase/supabase-js");

const WEBHOOK_TOKEN = "brincafacil01";

module.exports = async function handler(req, res) {
  console.log("=== WEBHOOK VERCEL ===");
  console.log("Método:", req.method);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    // Busca o token em diferentes lugares
    const tokenHeader = req.headers["authorization"];
    const tokenBody = req.body?.token;
    const tokenQuery = req.query?.token;

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
      return res.status(401).json({ error: "Token inválido" });
    }

    console.log("✅ Token válido!");

    // Dados recebidos
    const { email, status } = req.body;

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
            source: 'kirvano_webhook_vercel',
            created_at: new Date().toISOString()
          }
        });

        if (error) {
          console.error("❌ Erro ao criar usuário:", error);
          return res.status(500).json({ 
            success: false, 
            error: "Erro ao criar usuário no Supabase",
            details: error.message 
          });
        }

        console.log("✅ Usuário criado com sucesso:", data.user?.id);
        
      } catch (error) {
        console.error("❌ Erro inesperado:", error);
        return res.status(500).json({ 
          success: false, 
          error: "Erro interno do servidor",
          details: error.message 
        });
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: "Webhook processado com sucesso",
      data: { email, status }
    });

  } catch (error) {
    console.error("❌ Erro no webhook:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Erro interno do servidor",
      details: error.message 
    });
  }
}
