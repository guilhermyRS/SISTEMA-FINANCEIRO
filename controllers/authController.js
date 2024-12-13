// controllers/authController.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const supabase = require('../config/supabaseConfig');
const AuthModel = require('../models/authModel');


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://sistema-financeiro-five.vercel.app/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Verifique ou crie um usuário no seu banco de dados a partir do perfil do Google
    const { user, session, error } = await AuthModel.googleLogin(profile);

    if (error) {
      throw error;
    }

    done(null, user);
  } catch (error) {
    done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

class AuthController {
  static googleLogin(req, res) {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
  }

  static googleCallback(req, res) {
    passport.authenticate('google', {
      failureRedirect: '/login',
      successRedirect: '/',
    })(req, res);
  }

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
