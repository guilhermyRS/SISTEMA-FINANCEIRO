const FinanceModel = require('../models/financeModel');
const Papa = require('papaparse');

class FinanceController {
  static async index(req, res) {
    try {
      const financas = await FinanceModel.listar(req.user.id);
      res.render('index', {
        financas,
        erro: req.query.erro,
        sucesso: req.query.sucesso,
        user: req.user
      });
    } catch (error) {
      res.redirect('/?erro=' + encodeURIComponent('Erro ao listar lançamentos'));
    }
  }

  // Update other methods to use req.user.id
  // For example, in criar method:
  static async criar(req, res) {
    try {
      const { descricao, valor, categoria, tipo } = req.body;

      if (!descricao || !valor || !categoria || !tipo) {
        return res.redirect('/?erro=' + encodeURIComponent('Preencha todos os campos'));
      }

      const valorNumerico = parseFloat(valor.replace(',', '.'));
      if (isNaN(valorNumerico) || valorNumerico <= 0) {
        return res.redirect('/?erro=' + encodeURIComponent('Valor inválido'));
      }

      await FinanceModel.criar({
        descricao,
        valor: valorNumerico,
        categoria,
        tipo,
        data: new Date()
      }, req.user.id);

      res.redirect('/?sucesso=' + encodeURIComponent('Lançamento adicionado com sucesso'));
    } catch (error) {
      res.redirect('/?erro=' + encodeURIComponent('Erro ao adicionar lançamento'));
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { descricao, valor, categoria, tipo } = req.body;

      if (!descricao || !valor || !categoria || !tipo) {
        return res.redirect('/?erro=' + encodeURIComponent('Preencha todos os campos'));
      }

      const valorNumerico = parseFloat(valor.replace(',', '.'));
      if (isNaN(valorNumerico) || valorNumerico <= 0) {
        return res.redirect('/?erro=' + encodeURIComponent('Valor inválido'));
      }

      await FinanceModel.atualizar(id, {
        descricao,
        valor: valorNumerico,
        categoria,
        tipo
      });

      res.redirect('/?sucesso=' + encodeURIComponent('Lançamento atualizado com sucesso'));
    } catch (error) {
      res.redirect('/?erro=' + encodeURIComponent('Erro ao atualizar lançamento'));
    }
  }

  static async deletar(req, res) {
    try {
      const { id } = req.params;
      await FinanceModel.deletar(id);

      res.redirect('/?sucesso=' + encodeURIComponent('Lançamento removido com sucesso'));
    } catch (error) {
      res.redirect('/?erro=' + encodeURIComponent('Erro ao remover lançamento'));
    }
  }

  static async dashboard(req, res) {
    try {
      const financas = await FinanceModel.listar();

      const totalReceitas = financas
        .filter(f => f.tipo === 'receita')
        .reduce((sum, f) => sum + f.valor, 0);

      const totalDespesas = financas
        .filter(f => f.tipo === 'despesa')
        .reduce((sum, f) => sum + f.valor, 0);

      const saldoTotal = totalReceitas - totalDespesas;

      res.render('dashboard', {
        financas,
        totalReceitas,
        totalDespesas,
        saldoTotal,
        erro: req.query.erro,
        sucesso: req.query.sucesso
      });
    } catch (error) {
      console.error('Error in dashboard method:', error);
      res.redirect('/?erro=' + encodeURIComponent('Erro ao carregar dashboard'));
    }
  }

  static async filtrar(req, res) {
    try {
      const { dataInicio, dataFim, tipo, categoria } = req.body;
      const financasFiltradas = await FinanceModel.filtrar(dataInicio, dataFim, tipo, categoria);

      const totalReceitas = financasFiltradas
        .filter(f => f.tipo === 'receita')
        .reduce((sum, f) => sum + f.valor, 0);

      const totalDespesas = financasFiltradas
        .filter(f => f.tipo === 'despesa')
        .reduce((sum, f) => sum + f.valor, 0);

      const saldoTotal = totalReceitas - totalDespesas;

      res.render('dashboard', {
        financas: financasFiltradas,
        totalReceitas,
        totalDespesas,
        saldoTotal,
        filtros: { dataInicio, dataFim, tipo, categoria },
        erro: req.query.erro,
        sucesso: req.query.sucesso
      });
    } catch (error) {
      console.error('Error in filtrar method:', error);
      res.redirect('/dashboard?erro=' + encodeURIComponent('Erro ao filtrar lançamentos'));
    }
  }

  static async exportar(req, res) {
    try {
      const financas = await FinanceModel.listar();

      const csvData = financas.map(f => ({
        ID: f.id,
        Descrição: f.descricao,
        Valor: f.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        Categoria: f.categoria,
        Tipo: f.tipo,
        Data: new Date(f.data).toLocaleDateString('pt-BR')
      }));

      const csv = Papa.unparse(csvData);

      res.header('Content-Type', 'text/csv');
      res.attachment('relatorio_financeiro.csv');
      res.send(csv);
    } catch (error) {
      res.redirect('/relatorio?erro=' + encodeURIComponent('Erro ao exportar relatório'));
    }
  }
}

module.exports = FinanceController;

