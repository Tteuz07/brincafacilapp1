// Teste de conexão com Supabase
import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv';

dotenv.config();

console.log("🧪 Testando conexão com Supabase...");

const SUPABASE_URL = "https://zbrqgtxrtbsezlutxopz.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpicnFndHhydGJzZXpsdXR4b3B6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODExMTUwNCwiZXhwIjoyMDczNjg3NTA0fQ.2Pj0N-cLLnJXQNjKsPt1QOxm7BI8OHsuGjMnHH5pQ2g";

console.log("URL:", SUPABASE_URL);
console.log("Service Key:", SUPABASE_SERVICE_ROLE_KEY ? "✅ Presente" : "❌ Ausente");

try {
  const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
  );

  console.log("✅ Cliente Supabase criado com sucesso!");

  // Teste simples de criação de usuário
  console.log("🧪 Testando criação de usuário...");
  
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'teste-webhook@exemplo.com',
    email_confirm: true,
    user_metadata: {
      source: 'teste_webhook',
      created_at: new Date().toISOString()
    }
  });

  if (error) {
    console.error("❌ Erro ao criar usuário:", error);
  } else {
    console.log("✅ Usuário criado com sucesso:", data.user?.id);
  }

} catch (error) {
  console.error("❌ Erro na conexão:", error);
}
