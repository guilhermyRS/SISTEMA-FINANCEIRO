// models/financeModel.js
const supabase = require('../config/supabaseConfig');

class FinanceModel {
  static async criar(dados) {
    const { data, error } = await supabase
      .from('financas')
      .insert(dados);
    
    if (error) throw error;
    return data;
  }

  static async listar() {
    const { data, error } = await supabase
      .from('financas')
      .select('*')
      .order('data', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // New method for filtering
  static async filtrar(dataInicio, dataFim, tipo, categoria) {
    let query = supabase.from('financas').select('*');

    // Add date range filter if provided
    if (dataInicio && dataFim) {
      query = query.gte('data', dataInicio).lte('data', dataFim);
    }

    // Add tipo filter if provided
    if (tipo) {
      query = query.eq('tipo', tipo);
    }

    // Add categoria filter if provided
    if (categoria) {
      query = query.eq('categoria', categoria);
    }

    // Order by date descending
    query = query.order('data', { ascending: false });

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }

  static async atualizar(id, dados) {
    const { data, error } = await supabase
      .from('financas')
      .update(dados)
      .eq('id', id);
    
    if (error) throw error;
    return data;
  }

  static async deletar(id) {
    const { data, error } = await supabase
      .from('financas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return data;
  }
}

module.exports = FinanceModel;