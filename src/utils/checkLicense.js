import { supabase } from '../lib/supabaseClient';

export async function checkLicense() {
  const { data: auth } = await supabase.auth.getUser();
  const email = auth?.user?.email?.toLowerCase();

  if (!email) return { allowed: false, reason: 'Faça login.' };

  // ✅ SEGURO - Usa função protegida do banco
  const { data, error } = await supabase
    .rpc('verificar_licenca', { 
      user_email: email 
    });

  if (error) {
    console.error('Erro ao verificar licença:', error);
    return { allowed: false, reason: 'Erro ao verificar acesso. Tente novamente.' };
  }

  if (!data || data.length === 0) {
    return { allowed: false, reason: 'Acesso pendente. Liberação em até 30 min.' };
  }

  const licenca = data[0];
  
  if (licenca.valido === true) {
    // Licença válida - libera acesso
    return { 
      allowed: true,
      nome: licenca.nome,
      data_compra: licenca.data_compra
    };
  } else {
    // Licença inválida ou não encontrada
    return { allowed: false, reason: 'Acesso pendente. Liberação em até 30 min.' };
  }
}










