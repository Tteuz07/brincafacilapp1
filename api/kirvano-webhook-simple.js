// api/kirvano-webhook-simple.js

import { createClient } from "@supabase/supabase-js";

// Token configurado no painel da Kirvano
const WEBHOOK_TOKEN = process.env.KIRVANO_TOKEN || "brincafacil01";

export default async function handler(req, res) {
  console.log("=== WEBHOOK RECEBIDO ===");
  console.log("Método:", req.method);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

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
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

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
}
