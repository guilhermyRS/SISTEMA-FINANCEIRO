// models/financeModel.js
const supabase = require('../config/supabaseConfig');

class FinanceModel {
  static async criar(dados, userId) {
    console.log('Tentando criar lançamento:', dados, 'para usuário:', userId);
    const { data, error } = await supabase
      .from('financas')
      .insert({ ...dados, user_id: userId });
    if (error) {
      console.error('Erro ao criar lançamento:', error);
      throw error;
    }
    console.log('Lançamento criado com sucesso:', data);
    return data;
  }

  static async listar(userId) {
    console.log('Listando lançamentos para usuário:', userId);
    const { data, error } = await supabase
      .from('financas')
      .select('*')
      .eq('user_id', userId)
      .order('data', { ascending: false });
    if (error) {
      console.error('Erro ao listar lançamentos:', error);
      throw error;
    }
    return data;
  }

  static async filtrar(userId, dataInicio, dataFim, tipo, categoria) {
    let query = supabase.from('financas').select('*').eq('user_id', userId);

    if (dataInicio && dataFim) {
      query = query.gte('data', dataInicio).lte('data', dataFim);
    }
    if (tipo) {
      query = query.eq('tipo', tipo);
    }
    if (categoria) {
      query = query.eq('categoria', categoria);
    }

    query = query.order('data', { ascending: false });

    const { data, error } = await query;
    if (error) {
      console.error('Erro ao filtrar lançamentos:', error);
      throw error;
    }
    return data;
  }

  static async atualizar(id, dados, userId) {
    console.log('Atualizando lançamento:', id, 'com dados:', dados, 'para usuário:', userId);
    const { data, error } = await supabase
      .from('financas')
      .update(dados)
      .eq('id', id)
      .eq('user_id', userId);
    if (error) {
      console.error('Erro ao atualizar lançamento:', error);
      throw error;
    }
    console.log('Lançamento atualizado com sucesso:', data);
    return data;
  }

  static async deletar(id, userId) {
    console.log('Deletando lançamento:', id, 'para usuário:', userId);
    const { data, error } = await supabase
      .from('financas')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    if (error) {
      console.error('Erro ao deletar lançamento:', error);
      throw error;
    }
    console.log('Lançamento deletado com sucesso');
    return data;
  }
}

module.exports = FinanceModel;