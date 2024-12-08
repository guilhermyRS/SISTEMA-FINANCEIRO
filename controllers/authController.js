// controllers/authController.js
const AuthModel = require('../models/authModel');

class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, session } = await AuthModel.login(email, password);
      req.session.user = user;
      res.redirect('/');
    } catch (error) {
      res.render('login', { error: 'Credenciais inválidas' });
    }
  }

  static async cadastrar(req, res) {
    try {
      const { email, password } = req.body;
      await AuthModel.cadastrar(email, password);
      res.render('login', { success: 'Cadastro realizado com sucesso. Por favor, verifique seu email e faça o ligin.' });
    } catch (error) {
      res.render('cadastro', { error: 'Erro ao cadastrar. Tente novamente.' });
    }
  }

  static async logout(req, res) {
    try {
      await AuthModel.logout();
      req.session.destroy();
      res.redirect('/login');
    } catch (error) {
      res.redirect('/?erro=' + encodeURIComponent('Erro ao fazer logout'));
    }
  }

  static renderLogin(req, res) {
    res.render('login');
  }

  static renderCadastro(req, res) {
    res.render('cadastro');
  }
}

module.exports = AuthController;