// api/kirvano-webhook.js

import { createClient } from "@supabase/supabase-js";

// Token configurado no painel da Kirvano
const WEBHOOK_TOKEN = process.env.KIRVANO_TOKEN || "brincafacil01";

export default async function handler(req, res) {
  // Conexão com o Supabase (inicializada dentro da função)
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // use a chave de serviço, nunca a pública
  );
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  // Logs para debug
  console.log("Headers recebidos:", req.headers);
  console.log("Body recebido:", req.body);

  // Busca o token em diferentes lugares
  const tokenHeader = req.headers["authorization"];
  const tokenBody = req.body?.token;
  const tokenQuery = req.query?.token;

  let cleanHeaderToken = null;
  if (tokenHeader) {
    cleanHeaderToken = tokenHeader.replace("Bearer ", "").trim();
  }

  // Valida token
  if (
    cleanHeaderToken !== WEBHOOK_TOKEN &&
    tokenBody !== WEBHOOK_TOKEN &&
    tokenQuery !== WEBHOOK_TOKEN
  ) {
    console.log("Token inválido:", {
      tokenHeader,
      tokenBody,
      tokenQuery,
    });
    return res.status(401).json({ error: "Token inválido" });
  }

  // Dados recebidos
  const { email, status } = req.body;

  if (status === "compra_aprovada" && email) {
    const { error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
    });

    if (error) {
      console.error("Erro Supabase:", error);
      return res.status(500).json({ error: "Erro ao criar usuário" });
    }
  }

  return res.status(200).json({ ok: true });
}
