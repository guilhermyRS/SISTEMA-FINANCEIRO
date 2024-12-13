// controllers/financeController.js
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
        email: res.locals.email // Adicionando o e-mail do usuário
      });
    } catch (error) {
      console.error('Erro ao listar lançamentos:', error);
      res.render('index', { 
        financas: [], 
        erro: 'Erro ao listar lançamentos. Por favor, tente novamente.',
        email: res.locals.email // Garante que o e-mail ainda seja passado no caso de erro
      });
    }
  }
  

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
      console.error('Erro ao adicionar lançamento:', error);
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
      }, req.user.id);
      
      res.redirect('/?sucesso=' + encodeURIComponent('Lançamento atualizado com sucesso'));
    } catch (error) {
      console.error('Erro ao atualizar lançamento:', error);
      res.redirect('/?erro=' + encodeURIComponent('Erro ao atualizar lançamento'));
    }
  }

  static async deletar(req, res) {
    try {
      const { id } = req.params;
      await FinanceModel.deletar(id, req.user.id);
      
      res.redirect('/?sucesso=' + encodeURIComponent('Lançamento removido com sucesso'));
    } catch (error) {
      console.error('Erro ao remover lançamento:', error);
      res.redirect('/?erro=' + encodeURIComponent('Erro ao remover lançamento'));
    }
  }

  static async dashboard(req, res) {
    try {
      const financas = await FinanceModel.listar(req.user.id);

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
      console.error('Erro ao carregar dashboard:', error.message);
      res.redirect('/?erro=' + encodeURIComponent('Erro ao carregar dashboard'));
    }
    
  }

  static async filtrar(req, res) {
    try {
      const { dataInicio, dataFim, tipo, categoria } = req.body;
      const financasFiltradas = await FinanceModel.filtrar(req.session.user.id, dataInicio, dataFim, tipo, categoria);

      res.render('dashboard', {
        financas: financasFiltradas,
        filtros: { dataInicio, dataFim, tipo, categoria }
      });
    } catch (error) {
      res.redirect('/relatorio?erro=' + encodeURIComponent('Erro ao filtrar lançamentos'));
    }
  }

  static async exportar(req, res) {
    try {
      const financas = await FinanceModel.listar(req.session.user.id);

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