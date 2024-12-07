const supabase = require('../config/supabaseConfig');
const bcrypt = require('bcrypt');

class AuthController {
  // Render login page
  static async renderLogin(req, res) {
    res.render('login', { 
      erro: req.query.erro,
      acao: req.query.acao // para distinguir entre login e cadastro
    });
  }

  // Render signup page
  static async renderSignup(req, res) {
    res.render('login', { 
      acao: 'cadastro',
      erro: req.query.erro 
    });
  }

  // Signup method
  static async signup(req, res) {
    try {
      const { nome, email, senha } = req.body;

      // Validate input
      if (!nome || !email || !senha) {
        return res.redirect('/signup?erro=' + encodeURIComponent('Preencha todos os campos'));
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(senha, saltRounds);

      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha, // Supabase will hash this again
        options: {
          data: {
            nome: nome
          }
        }
      });

      if (error) throw error;

      // Create user session
      const { session } = data;
      
      // Redirect to login with success message
      res.redirect('/login?acao=cadastro_sucesso');
    } catch (error) {
      console.error('Signup error:', error);
      res.redirect('/signup?erro=' + encodeURIComponent(error.message || 'Erro ao cadastrar'));
    }
  }

  // Login method
  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      // Validate input
      if (!email || !senha) {
        return res.redirect('/login?erro=' + encodeURIComponent('Preencha todos os campos'));
      }

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha
      });

      if (error) throw error;

      // Redirect to home/dashboard
      res.redirect('/');
    } catch (error) {
      console.error('Login error:', error);
      res.redirect('/login?erro=' + encodeURIComponent('Credenciais inválidas'));
    }
  }

  // Logout method
  static async logout(req, res) {
    try {
      await supabase.auth.signOut();
      res.redirect('/login');
    } catch (error) {
      res.redirect('/?erro=' + encodeURIComponent('Erro ao fazer logout'));
    }
  }

  // Middleware to check authentication
  static async requireAuth(req, res, next) {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        return res.redirect('/login');
      }

      // Attach user to request for later use
      req.user = session.user;
      next();
    } catch (error) {
      res.redirect('/login');
    }
  }
}

module.exports = AuthController;