// Supabase Edge Function para processar webhooks da Kirvano
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  try {
    console.log("=== WEBHOOK RECEBIDO ===");
    console.log("Método:", req.method);
    console.log("Headers:", Object.fromEntries(req.headers.entries()));
    
    const payload = await req.json();
    console.log("Payload completo:", JSON.stringify(payload, null, 2));
    
    // Pega os campos comuns
    const email = payload?.customer?.email || payload?.buyer?.email || payload?.email;
    const saleId = payload?.sale_id || payload?.checkout_id || payload?.id;
    const status = (payload?.status || payload?.event || "").toString().toUpperCase();

    if (!email || !saleId) {
      return new Response(JSON.stringify({ error: "missing email or sale id" }), { status: 400 });
    }

    console.log("Dados extraídos:");
    console.log("- Email:", email);
    console.log("- Sale ID:", saleId);
    console.log("- Status:", status);

    // Grava o evento para histórico
    console.log("Inserindo no banco de dados...");
    const { error } = await supabase.from("payments").insert([{
      sale_id: saleId,
      email,
      status,
      raw_payload: payload,
      created_at: new Date().toISOString()
    }]);

    if (error) {
      console.error("❌ Erro ao inserir:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    console.log("✅ Dados inseridos com sucesso!");
    console.log("=== FIM DO WEBHOOK ===");

    return new Response(JSON.stringify({ 
      ok: true, 
      message: "Webhook processado com sucesso",
      email: email,
      sale_id: saleId,
      status: status
    }), { status: 200 });
  } catch (err) {
    console.error("webhook error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
