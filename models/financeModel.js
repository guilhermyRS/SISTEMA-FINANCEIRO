const supabase = require('../config/supabaseConfig');

class FinanceModel {
  static async criar(dados, userId) {
    const { data, error } = await supabase
      .from('financas')
      .insert({
        ...dados,
        user_id: userId
      });

    if (error) throw error;
    return data;
  }

  static async listar(userId) {
    const { data, error } = await supabase
      .from('financas')
      .select('*')
      .eq('user_id', userId)
      .order('data', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Update other methods similarly to include user_id filtering
  static async filtrar(dataInicio, dataFim, tipo, categoria, userId) {
    let query = supabase.from('financas')
      .select('*')
      .eq('user_id', userId);

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

    if (error) throw error;
    return data;
  }

  // Other methods (atualizar, deletar) should be updated similarly
  static async atualizar(id, dados, userId) {
    const { data, error } = await supabase
      .from('financas')
      .update(dados)
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }

  static async deletar(id, userId) {
    const { data, error } = await supabase
      .from('financas')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }
}

module.exports = FinanceModel;