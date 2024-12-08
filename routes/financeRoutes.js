// routes/index.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const FinanceController = require('../controllers/financeController');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Auth routes
router.get('/login', AuthController.renderLogin);
router.post('/login', AuthController.login);
router.get('/cadastro', AuthController.renderCadastro);
router.post('/cadastro', AuthController.cadastrar);
router.get('/logout', AuthController.logout);

// Finance routes (protected)
router.get('/', isAuthenticated, FinanceController.index);
router.post('/criar', isAuthenticated, FinanceController.criar);
router.post('/atualizar/:id', isAuthenticated, FinanceController.atualizar);
router.get('/deletar/:id', isAuthenticated, FinanceController.deletar);
router.get('/relatorio', isAuthenticated, FinanceController.dashboard);
router.post('/filtrar', isAuthenticated, FinanceController.filtrar);
router.get('/exportar', isAuthenticated, FinanceController.exportar);

module.exports = router;