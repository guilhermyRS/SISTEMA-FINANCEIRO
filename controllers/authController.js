// controllers/authController.js
const AuthModel = require('../models/authModel');
const supabase = require('../config/supabaseConfig');

class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, session } = await AuthModel.login(email, password);

      if (user && session) {
        req.session.token = session.access_token;
        req.session.user = user;

        res.cookie('supabase-auth-token', session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
        });

        return res.redirect('/');
      } else {
        throw new Error('Falha na autenticação');
      }
    } catch (error) {
      console.error('Erro de login:', error);
      res.render('login', { error: error.message || 'Credenciais inválidas' });
    }
  }

  static async cadastrar(req, res) {
    try {
      const { email, password } = req.body;
      const { user, session, error } = await AuthModel.cadastrar(email, password);

      if (error) {
        throw error;
      }

      res.render('login', { success: 'Cadastro realizado com sucesso. Por favor, verifique seu email para autenticação.' });
    } catch (error) {
      console.error('Erro de cadastro:', error);
      res.render('cadastro', { error: error.message || 'Erro ao cadastrar. Tente novamente.' });
    }
  }

  static async logout(req, res) {
    try {
      await AuthModel.logout();
      req.session.destroy((err) => {
        if (err) {
          console.error('Erro ao destruir sessão:', err);
        }
        res.clearCookie('supabase-auth-token');
        res.redirect('/login');
      });
    } catch (error) {
      console.error('Erro de logout:', error);
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