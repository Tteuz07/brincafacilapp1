// =====================================================
// EXEMPLOS DE USO DO STORAGE SERVICE
// =====================================================
// Este arquivo contém exemplos práticos de como usar o novo sistema
// de storage que substitui o LocalStorage por Supabase

import { supabase } from './lib/supabaseClient';
import { 
  migrarLocalStorage,
  buscarPerfil,
  buscarHistorico,
  buscarFavoritos,
  salvarAtividade,
  atualizarPontos,
  adicionarFavorito,
  removerFavorito,
  isFavorito,
  salvarPerfil
} from './lib/storageService';

// =====================================================
// EXEMPLO 1: NO LOGIN/AUTENTICAÇÃO
// =====================================================
// Use este código no Gate.jsx ou onde você verifica a licença

async function fazerLogin(email) {
  try {
    // 1. Verificar licença usando a função RPC segura
    const { data, error } = await supabase
      .rpc('verificar_licenca', { user_email: email });

    if (error) {
      console.error('Erro ao verificar licença:', error);
      alert('Erro ao verificar acesso. Tente novamente.');
      return false;
    }

    if (!data || data.length === 0 || !data[0]?.valido) {
      alert('Acesso pendente. Liberação em até 30 minutos após a confirmação do pagamento.');
      return false;
    }

    // 2. Salvar sessão
    const usuario = {
      email: email,
      nome: data[0].nome || '',
      data_compra: data[0].data_compra,
      validado_em: new Date().toISOString()
    };
    
    localStorage.setItem('brincafacil_session', JSON.stringify(usuario));

    // 3. MIGRAR DADOS DO LOCALSTORAGE (se necessário)
    // Isso já está implementado no Gate.jsx, mas aqui está o exemplo:
    const resultadoMigracao = await migrarLocalStorage(email);
    if (resultadoMigracao.success && resultadoMigracao.migrados) {
      console.log('✅ Dados migrados:', resultadoMigracao.migrados);
    }

    // 4. Redirecionar
    window.location.href = '/';
    return true;

  } catch (error) {
    console.error('Erro no login:', error);
    alert('Erro ao fazer login. Tente novamente.');
    return false;
  }
}

// =====================================================
// EXEMPLO 2: CARREGAR PERFIL DA CRIANÇA
// =====================================================
// Use este código em componentes que precisam exibir o perfil

async function carregarPerfilCrianca() {
  try {
    // Obter email da sessão
    const sessionStr = localStorage.getItem('brincafacil_session');
    if (!sessionStr) {
      console.warn('Sessão não encontrada');
      return null;
    }

    const session = JSON.parse(sessionStr);
    const email = session?.email;

    if (!email) {
      console.warn('Email não encontrado na sessão');
      return null;
    }

    // Buscar perfil do Supabase
    const { success, data: perfil } = await buscarPerfil(email);

    if (success && perfil) {
      console.log('✅ Perfil carregado:', perfil);
      
      // Exemplo de uso dos dados:
      // document.getElementById('nome-crianca').textContent = perfil.nome_crianca;
      // document.getElementById('idade-crianca').textContent = `${perfil.idade} anos`;
      // document.getElementById('nivel').textContent = perfil.nivel;
      // document.getElementById('pontos-cognitivo').textContent = perfil.pontos_cognitivo;
      // document.getElementById('pontos-motor').textContent = perfil.pontos_motor;
      
      return perfil;
    } else {
      console.log('ℹ️ Perfil não encontrado - usuário precisa criar');
      return null;
    }
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
    return null;
  }
}

// =====================================================
// EXEMPLO 3: CARREGAR HISTÓRICO DE ATIVIDADES
// =====================================================
// Use este código em páginas que mostram o histórico

async function carregarHistorico(limite = 50) {
  try {
    const sessionStr = localStorage.getItem('brincafacil_session');
    if (!sessionStr) return [];

    const session = JSON.parse(sessionStr);
    const email = session?.email;

    if (!email) return [];

    // Buscar histórico do Supabase
    const { success, data: historico } = await buscarHistorico(email, limite);

    if (success && historico && historico.length > 0) {
      console.log(`✅ ${historico.length} atividades carregadas`);
      
      // Exemplo de renderização:
      // const container = document.getElementById('lista-historico');
      // container.innerHTML = '';
      // 
      // historico.forEach(atividade => {
      //   const card = `
      //     <div class="card-atividade">
      //       <h3>${atividade.atividade_nome}</h3>
      //       <p>⭐ Avaliação: ${atividade.avaliacao}/5</p>
      //       <p>🕐 Duração: ${atividade.duracao_minutos || '?'} minutos</p>
      //       <p>📅 ${new Date(atividade.data_realizacao).toLocaleDateString('pt-BR')}</p>
      //       ${atividade.comentario ? `<p>💬 ${atividade.comentario}</p>` : ''}
      //     </div>
      //   `;
      //   container.innerHTML += card;
      // });
      
      return historico;
    } else {
      console.log('ℹ️ Nenhuma atividade encontrada');
      return [];
    }
  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
    return [];
  }
}

// =====================================================
// EXEMPLO 4: REGISTRAR ATIVIDADE REALIZADA
// =====================================================
// Use este código quando o usuário completa uma atividade
// NOTA: Isso já está implementado em recordActivityFromCard do useAppStore.js

async function registrarAtividadeRealizada(dadosAtividade) {
  try {
    const sessionStr = localStorage.getItem('brincafacil_session');
    if (!sessionStr) {
      console.warn('Sessão não encontrada');
      return { success: false, error: 'Usuário não autenticado' };
    }

    const session = JSON.parse(sessionStr);
    const email = session?.email;

    if (!email) {
      return { success: false, error: 'Email não encontrado' };
    }

    // 1. Salvar no histórico
    const resultado = await salvarAtividade(email, {
      id: String(dadosAtividade.id),
      nome: dadosAtividade.nome,
      avaliacao: dadosAtividade.avaliacao, // 1-5
      comentario: dadosAtividade.comentario || null,
      foto: dadosAtividade.foto || null,
      duracao: dadosAtividade.duracao,
      dificuldade: dadosAtividade.dificuldade, // 'easy', 'medium', 'hard'
      diversao: dadosAtividade.diversao || dadosAtividade.funLevel, // 'boring', 'ok', 'fun'
      data: dadosAtividade.data || new Date().toISOString()
    });

    if (!resultado.success) {
      console.error('Erro ao salvar atividade:', resultado.error);
      return { success: false, error: resultado.error };
    }

    // 2. Atualizar pontos de desenvolvimento (opcional)
    // Isso já é feito automaticamente pelo recordActivityFromCard
    // Mas aqui está um exemplo se você quiser fazer manualmente:
    
    // const categoriasAtividade = dadosAtividade.categorias || [];
    // for (const categoria of categoriasAtividade) {
    //   if (['cognitivo', 'motor', 'social', 'emocional'].includes(categoria)) {
    //     await atualizarPontos(email, categoria, 10); // +10 pontos base
    //   }
    // }

    console.log('✅ Atividade registrada com sucesso');
    return { success: true, data: resultado.data };
  } catch (error) {
    console.error('Erro ao registrar atividade:', error);
    return { success: false, error: error.message };
  }
}

// =====================================================
// EXEMPLO 5: GERENCIAR FAVORITOS
// =====================================================
// Use este código em componentes que permitem favoritar itens
// NOTA: Isso já está implementado em addToFavorites/removeFromFavorites do useAppStore.js

async function toggleFavorito(tipo, itemId, itemNome) {
  try {
    const sessionStr = localStorage.getItem('brincafacil_session');
    if (!sessionStr) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    const session = JSON.parse(sessionStr);
    const email = session?.email;

    if (!email) {
      return { success: false, error: 'Email não encontrado' };
    }

    // Normalizar tipo: 'activity' -> 'brincadeira', 'cartoon' -> 'desenho'
    const tipoNormalizado = tipo === 'activity' ? 'brincadeira' : 'desenho';

    // Verificar se já está nos favoritos
    const { success: checkSuccess, isFavorito: jaEstaFavorito } = await isFavorito(
      email, 
      tipoNormalizado, 
      String(itemId)
    );

    if (!checkSuccess) {
      return { success: false, error: 'Erro ao verificar favorito' };
    }

    if (jaEstaFavorito) {
      // Remover
      const resultado = await removerFavorito(email, tipoNormalizado, String(itemId));
      if (resultado.success) {
        console.log('❤️ Removido dos favoritos');
        return { success: true, action: 'removed' };
      } else {
        return { success: false, error: resultado.error };
      }
    } else {
      // Adicionar
      const resultado = await adicionarFavorito(email, tipoNormalizado, String(itemId), itemNome);
      if (resultado.success) {
        console.log('💛 Adicionado aos favoritos');
        return { success: true, action: 'added' };
      } else {
        return { success: false, error: resultado.error };
      }
    }
  } catch (error) {
    console.error('Erro ao alternar favorito:', error);
    return { success: false, error: error.message };
  }
}

// =====================================================
// EXEMPLO 6: CARREGAR FAVORITOS
// =====================================================

async function carregarFavoritos(tipo = null) {
  try {
    const sessionStr = localStorage.getItem('brincafacil_session');
    if (!sessionStr) return [];

    const session = JSON.parse(sessionStr);
    const email = session?.email;

    if (!email) return [];

    // Normalizar tipo se fornecido
    const tipoNormalizado = tipo === 'activity' ? 'brincadeira' : tipo === 'cartoon' ? 'desenho' : null;

    // Buscar favoritos do Supabase
    const { success, data: favoritos } = await buscarFavoritos(email, tipoNormalizado);

    if (success && favoritos) {
      console.log(`✅ ${favoritos.length} favoritos carregados`);
      return favoritos;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Erro ao carregar favoritos:', error);
    return [];
  }
}

// =====================================================
// EXEMPLO 7: SALVAR/ATUALIZAR PERFIL DA CRIANÇA
// =====================================================
// Use este código quando o usuário cria ou atualiza o perfil
// NOTA: Isso já está implementado em updateChild do useAppStore.js

async function salvarPerfilCrianca(dadosPerfil) {
  try {
    const sessionStr = localStorage.getItem('brincafacil_session');
    if (!sessionStr) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    const session = JSON.parse(sessionStr);
    const email = session?.email;

    if (!email) {
      return { success: false, error: 'Email não encontrado' };
    }

    // Salvar perfil no Supabase
    const resultado = await salvarPerfil(email, {
      nome: dadosPerfil.name || dadosPerfil.nome,
      idade: dadosPerfil.age || dadosPerfil.idade,
      avatar: dadosPerfil.avatar || '👶',
      interesses: dadosPerfil.interests || dadosPerfil.interesses || [],
      espaco: dadosPerfil.space ? [dadosPerfil.space] : dadosPerfil.espaco || [],
      companhia: dadosPerfil.companionship ? [dadosPerfil.companionship] : dadosPerfil.companhia || [],
      pontos_cognitivo: dadosPerfil.pontos_cognitivo || 0,
      pontos_motor: dadosPerfil.pontos_motor || 0,
      pontos_social: dadosPerfil.pontos_social || 0,
      pontos_emocional: dadosPerfil.pontos_emocional || 0,
      nivel: dadosPerfil.nivel || 1,
      meta_semanal: dadosPerfil.meta_semanal || 5,
      dias_consecutivos: dadosPerfil.dias_consecutivos || 0,
      ultima_atividade_data: dadosPerfil.ultima_atividade_data || null
    });

    if (resultado.success) {
      console.log('✅ Perfil salvo com sucesso');
      return { success: true, data: resultado.data };
    } else {
      return { success: false, error: resultado.error };
    }
  } catch (error) {
    console.error('Erro ao salvar perfil:', error);
    return { success: false, error: error.message };
  }
}

// =====================================================
// EXPORTS
// =====================================================

export {
  fazerLogin,
  carregarPerfilCrianca,
  carregarHistorico,
  registrarAtividadeRealizada,
  toggleFavorito,
  carregarFavoritos,
  salvarPerfilCrianca
};

