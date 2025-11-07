// =====================================================
// STORAGE SERVICE - Substitui LocalStorage por Supabase
// =====================================================

import { supabase } from './supabaseClient';

// =====================================================
// HISTÓRICO DE ATIVIDADES
// =====================================================

/**
 * Salvar atividade realizada no histórico
 */
export async function salvarAtividade(emailUsuario, dadosAtividade) {
  try {
    // Converter e validar tipos antes de inserir
    let avaliacao = dadosAtividade.avaliacao 
      ? parseInt(dadosAtividade.avaliacao) 
      : null;
    
    // Garantir que avaliacao está entre 1 e 5
    if (avaliacao !== null && (isNaN(avaliacao) || avaliacao < 1 || avaliacao > 5)) {
      console.warn('Avaliação inválida:', avaliacao, 'usando null');
      avaliacao = null;
    }
    
    const duracaoMinutos = dadosAtividade.duracao 
      ? parseInt(dadosAtividade.duracao) 
      : null;
    
    // Converter dificuldade para string válida
    let dificuldade = dadosAtividade.dificuldade || null;
    if (dificuldade && !['easy', 'medium', 'hard'].includes(dificuldade)) {
      // Mapear valores alternativos
      const dificuldadeMap = {
        'fácil': 'easy',
        'facil': 'easy',
        'médio': 'medium',
        'medio': 'medium',
        'difícil': 'hard',
        'dificil': 'hard'
      };
      dificuldade = dificuldadeMap[dificuldade.toLowerCase()] || null;
    }
    
    // Converter diversão para string válida
    let nivelDiversao = dadosAtividade.diversao || dadosAtividade.funLevel || null;
    if (nivelDiversao && typeof nivelDiversao === 'string') {
      // Garantir que está nos valores válidos
      if (!['boring', 'ok', 'fun'].includes(nivelDiversao.toLowerCase())) {
        // Mapear valores alternativos
        const diversaoMap = {
          'chato': 'boring',
          'entediante': 'boring',
          'ok': 'ok',
          'legal': 'fun',
          'divertido': 'fun',
          'muito divertido': 'fun'
        };
        nivelDiversao = diversaoMap[nivelDiversao.toLowerCase()] || null;
      } else {
        nivelDiversao = nivelDiversao.toLowerCase();
      }
    } else if (nivelDiversao && typeof nivelDiversao === 'number') {
      // Se for número, converter para string
      console.warn('nivel_diversao recebeu número, convertendo para null');
      nivelDiversao = null;
    }
    
    const { data, error } = await supabase
      .from('atividades_historico')
      .insert({
        email_usuario: emailUsuario,
        atividade_id: String(dadosAtividade.id || ''),
        atividade_nome: String(dadosAtividade.nome || 'Atividade'),
        avaliacao: avaliacao,
        comentario: dadosAtividade.comentario || null,
        foto_base64: dadosAtividade.foto || null, // ⚠️ Cuidado com tamanho
        duracao_minutos: duracaoMinutos,
        dificuldade_sentida: dificuldade,
        nivel_diversao: nivelDiversao,
        data_realizacao: dadosAtividade.data || new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao salvar atividade:', error);
    console.error('Dados recebidos:', dadosAtividade);
    return { success: false, error: error.message };
  }
}

/**
 * Buscar histórico de atividades do usuário
 */
export async function buscarHistorico(emailUsuario, limite = 50) {
  try {
    const { data, error } = await supabase
      .rpc('buscar_historico', { 
        user_email: emailUsuario,
        limite: limite 
      });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return { success: false, error: error.message, data: [] };
  }
}

/**
 * Buscar última atividade realizada
 */
export async function buscarUltimaAtividade(emailUsuario) {
  try {
    const { data, error } = await supabase
      .from('atividades_historico')
      .select('*')
      .eq('email_usuario', emailUsuario)
      .order('data_realizacao', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // Ignora "not found"
    return { success: true, data: data || null };
  } catch (error) {
    console.error('Erro ao buscar última atividade:', error);
    return { success: false, error: error.message, data: null };
  }
}

// =====================================================
// PERFIL DA CRIANÇA
// =====================================================

/**
 * Salvar ou atualizar perfil da criança
 */
export async function salvarPerfil(emailUsuario, dadosPerfil) {
  try {
    const { data, error } = await supabase
      .from('perfis_criancas')
      .upsert({
        email_usuario: emailUsuario,
        nome_crianca: dadosPerfil.nome,
        idade: dadosPerfil.idade,
        avatar: dadosPerfil.avatar || '👶',
        interesses: dadosPerfil.interesses || [],
        espaco_disponivel: dadosPerfil.espaco || [],
        companhia: dadosPerfil.companhia || [],
        pontos_cognitivo: dadosPerfil.pontos_cognitivo || 0,
        pontos_motor: dadosPerfil.pontos_motor || 0,
        pontos_social: dadosPerfil.pontos_social || 0,
        pontos_emocional: dadosPerfil.pontos_emocional || 0,
        nivel: dadosPerfil.nivel || 1,
        meta_semanal: dadosPerfil.meta_semanal || 5,
        dias_consecutivos: dadosPerfil.dias_consecutivos || 0,
        ultima_atividade_data: dadosPerfil.ultima_atividade_data || null,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'email_usuario'
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao salvar perfil:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Buscar perfil da criança
 */
export async function buscarPerfil(emailUsuario) {
  try {
    const { data, error } = await supabase
      .rpc('buscar_perfil', { user_email: emailUsuario });

    if (error) throw error;
    return { success: true, data: data?.[0] || null };
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return { success: false, error: error.message, data: null };
  }
}

/**
 * Atualizar pontos de desenvolvimento
 */
export async function atualizarPontos(emailUsuario, categoria, pontos) {
  try {
    const campo = `pontos_${categoria}`; // pontos_cognitivo, pontos_motor, etc
    
    // Buscar pontos atuais
    const { data: perfil } = await buscarPerfil(emailUsuario);
    if (!perfil) throw new Error('Perfil não encontrado');

    const pontosAtuais = perfil[campo] || 0;
    const novosPontos = pontosAtuais + pontos;
    const novoNivel = Math.floor(novosPontos / 100) + 1;

    const { data, error } = await supabase
      .from('perfis_criancas')
      .update({
        [campo]: novosPontos,
        nivel: novoNivel,
        updated_at: new Date().toISOString()
      })
      .eq('email_usuario', emailUsuario)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao atualizar pontos:', error);
    return { success: false, error: error.message };
  }
}

// =====================================================
// FAVORITOS
// =====================================================

/**
 * Adicionar aos favoritos
 */
export async function adicionarFavorito(emailUsuario, tipo, itemId, itemNome) {
  try {
    const { data, error } = await supabase
      .from('favoritos')
      .insert({
        email_usuario: emailUsuario,
        tipo: tipo, // 'brincadeira' ou 'desenho'
        item_id: itemId,
        item_nome: itemNome
      })
      .select()
      .single();

    if (error) {
      // Se já existe (erro 23505), não é erro fatal
      if (error.code === '23505') {
        return { success: true, data: null, message: 'Já está nos favoritos' };
      }
      throw error;
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao adicionar favorito:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Remover dos favoritos
 */
export async function removerFavorito(emailUsuario, tipo, itemId) {
  try {
    const { error } = await supabase
      .from('favoritos')
      .delete()
      .eq('email_usuario', emailUsuario)
      .eq('tipo', tipo)
      .eq('item_id', itemId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Erro ao remover favorito:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Buscar todos os favoritos do usuário
 */
export async function buscarFavoritos(emailUsuario, tipo = null) {
  try {
    let query = supabase
      .from('favoritos')
      .select('*')
      .eq('email_usuario', emailUsuario)
      .order('created_at', { ascending: false });

    if (tipo) {
      query = query.eq('tipo', tipo);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error);
    return { success: false, error: error.message, data: [] };
  }
}

/**
 * Verificar se item está nos favoritos
 */
export async function isFavorito(emailUsuario, tipo, itemId) {
  try {
    const { data, error } = await supabase
      .from('favoritos')
      .select('id')
      .eq('email_usuario', emailUsuario)
      .eq('tipo', tipo)
      .eq('item_id', itemId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // Ignora "not found"
    return { success: true, isFavorito: !!data };
  } catch (error) {
    console.error('Erro ao verificar favorito:', error);
    return { success: false, isFavorito: false };
  }
}

// =====================================================
// MIGRAÇÃO DO LOCALSTORAGE (EXECUTAR UMA VEZ)
// =====================================================

/**
 * Migrar dados do LocalStorage para Supabase
 * Execute isso no primeiro login após o update
 */
export async function migrarLocalStorage(emailUsuario) {
  console.log('🔄 Iniciando migração do LocalStorage...');
  
  try {
    // Verificar se já migrou
    const jaMigrou = localStorage.getItem('brincafacil_migrado');
    if (jaMigrou === 'true') {
      console.log('✅ Dados já foram migrados anteriormente');
      return { success: true, message: 'Já migrado' };
    }

    let migrados = { historico: 0, perfil: false, favoritos: 0 };

    // 1. MIGRAR HISTÓRICO
    const historicoLocal = localStorage.getItem('brincafacil_historico');
    if (historicoLocal) {
      try {
        const historico = JSON.parse(historicoLocal);
        for (const atividade of historico) {
          await salvarAtividade(emailUsuario, atividade);
          migrados.historico++;
        }
      } catch (e) {
        console.error('Erro ao migrar histórico:', e);
      }
    }

    // 2. MIGRAR PERFIL
    const perfilLocal = localStorage.getItem('brincafacil_perfil');
    if (perfilLocal) {
      try {
        const perfil = JSON.parse(perfilLocal);
        await salvarPerfil(emailUsuario, perfil);
        migrados.perfil = true;
      } catch (e) {
        console.error('Erro ao migrar perfil:', e);
      }
    }

    // 3. MIGRAR FAVORITOS
    const favoritosLocal = localStorage.getItem('brincafacil_favoritos');
    if (favoritosLocal) {
      try {
        const favoritos = JSON.parse(favoritosLocal);
        for (const fav of favoritos) {
          await adicionarFavorito(emailUsuario, fav.tipo, fav.id, fav.nome);
          migrados.favoritos++;
        }
      } catch (e) {
        console.error('Erro ao migrar favoritos:', e);
      }
    }

    // Marcar como migrado
    localStorage.setItem('brincafacil_migrado', 'true');
    
    console.log('✅ Migração concluída:', migrados);
    return { success: true, migrados };

  } catch (error) {
    console.error('❌ Erro na migração:', error);
    return { success: false, error: error.message };
  }
}

// =====================================================
// EXPORTS
// =====================================================

export default {
  // Histórico
  salvarAtividade,
  buscarHistorico,
  buscarUltimaAtividade,
  
  // Perfil
  salvarPerfil,
  buscarPerfil,
  atualizarPontos,
  
  // Favoritos
  adicionarFavorito,
  removerFavorito,
  buscarFavoritos,
  isFavorito,
  
  // Migração
  migrarLocalStorage
};

