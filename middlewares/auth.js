// middlewares/auth.js
const supabase = require('../config/supabaseConfig');

const isAuthenticated = async (req, res, next) => {
  const token = req.session.token || req.cookies['supabase-auth-token'];

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      throw error;
    }

    if (!user) {
      // Se não houver usuário, limpe o token e redirecione para o login
      res.clearCookie('supabase-auth-token');
      req.session.destroy();
      return res.redirect('/login');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Erro de autenticação:', error);
    res.clearCookie('supabase-auth-token');
    req.session.destroy();
    res.redirect('/login');
  }
};

module.exports = { isAuthenticated };