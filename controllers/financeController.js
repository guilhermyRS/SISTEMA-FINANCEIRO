// controllers/financeController.js
const FinanceModel = require('../models/financeModel');
const Papa = require('papaparse');

class FinanceController {
  static async index(req, res) {
    try {
      const financas = await FinanceModel.listar();
      res.render('index', { 
        financas, 
        erro: req.query.erro,
        sucesso: req.query.sucesso 
      });
    } catch (error) {
      res.redirect('/?erro=' + encodeURIComponent('Erro ao listar lançamentos'));
    }
  }

  static async criar(req, res) {
    try {
      const { descricao, valor, categoria, tipo } = req.body;
      
      // Validações básicas
      if (!descricao || !valor || !categoria || !tipo) {
        return res.redirect('/?erro=' + encodeURIComponent('Preencha todos os campos'));
      }

      // Conversão e validação de valor (agora suporta decimais)
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
      });
      
      res.redirect('/?sucesso=' + encodeURIComponent('Lançamento adicionado com sucesso'));
    } catch (error) {
      res.redirect('/?erro=' + encodeURIComponent('Erro ao adicionar lançamento'));
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { descricao, valor, categoria, tipo } = req.body;
      
      // Validações básicas
      if (!descricao || !valor || !categoria || !tipo) {
        return res.redirect('/?erro=' + encodeURIComponent('Preencha todos os campos'));
      }

      // Conversão e validação de valor (agora suporta decimais)
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

  // New method for dashboard
  static async dashboard(req, res) {
    try {
      const financas = await FinanceModel.listar();
      
      // Calculate summary statistics
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
      res.redirect('/?erro=' + encodeURIComponent('Erro ao carregar dashboard'));
    }
  }

  // New method for filtering
  static async filtrar(req, res) {
    try {
      const { dataInicio, dataFim, tipo, categoria } = req.body;
      const financasFiltradas = await FinanceModel.filtrar(dataInicio, dataFim, tipo, categoria);
      
      res.render('dashboard', { 
        financas: financasFiltradas,
        filtros: { dataInicio, dataFim, tipo, categoria }
      });
    } catch (error) {
      res.redirect('/relatorio?erro=' + encodeURIComponent('Erro ao filtrar lançamentos'));
    }
  }

  // New method for exporting to CSV
  static async exportar(req, res) {
    try {
      const financas = await FinanceModel.listar();
      
      // Prepare CSV data
      const csvData = financas.map(f => ({
        ID: f.id,
        Descrição: f.descricao,
        Valor: f.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        Categoria: f.categoria,
        Tipo: f.tipo,
        Data: new Date(f.data).toLocaleDateString('pt-BR')
      }));

      // Convert to CSV
      const csv = Papa.unparse(csvData);

      // Set headers for file download
      res.header('Content-Type', 'text/csv');
      res.attachment('relatorio_financeiro.csv');
      res.send(csv);
    } catch (error) {
      res.redirect('/relatorio?erro=' + encodeURIComponent('Erro ao exportar relatório'));
    }
  }
}

module.exports = FinanceController;