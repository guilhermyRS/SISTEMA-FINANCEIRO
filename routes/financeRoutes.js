// routes/index.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const FinanceController = require('../controllers/financeController');
const { isAuthenticated } = require('../middlewares/auth');

// Auth routes
router.get('/login', AuthController.renderLogin);
router.post('/login', AuthController.login);
router.get('/cadastro', AuthController.renderCadastro);
router.post('/cadastro', AuthController.cadastrar);
router.get('/logout', AuthController.logout);

// Adicionando rotas para login com o Google
router.get('/auth/google', AuthController.googleLogin); // Rota para redirecionar para Google
router.get('/auth/google/callback', AuthController.googleCallback); // Rota para tratar o callback do Google

// Finance routes (protected)
router.get('/', isAuthenticated, FinanceController.index);
router.post('/criar', isAuthenticated, FinanceController.criar);
router.post('/atualizar/:id', isAuthenticated, FinanceController.atualizar);
router.get('/deletar/:id', isAuthenticated, FinanceController.deletar);
router.get('/relatorio', isAuthenticated, FinanceController.dashboard);
router.post('/filtrar', isAuthenticated, FinanceController.filtrar);
router.get('/exportar', isAuthenticated, FinanceController.exportar);

module.exports = router;
