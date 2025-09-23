// Verificar usuários criados no Supabase
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://zbrqgtxrtbsezlutxopz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpicnFndHhydGJzZXpsdXR4b3B6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODExMTUwNCwiZXhwIjoyMDczNjg3NTA0fQ.2Pj0N-cLLnJXQNjKsPt1QOxm7BI8OHsuGjMnHH5pQ2g"
);

console.log("🔍 Verificando usuários criados...");

try {
  const { data, error } = await supabase.auth.admin.listUsers();
  
  if (error) {
    console.error("❌ Erro ao listar usuários:", error);
  } else {
    console.log(`✅ Encontrados ${data.users.length} usuários:`);
    data.users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Criado em: ${user.created_at}`);
      console.log(`   Fonte: ${user.user_metadata?.source || 'N/A'}`);
      console.log("---");
    });
  }
} catch (error) {
  console.error("❌ Erro:", error);
}

