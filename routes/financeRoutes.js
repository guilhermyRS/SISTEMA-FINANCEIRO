const express = require('express');
const router = express.Router();
const FinanceController = require('../controllers/financeController');
const AuthController = require('../controllers/authController');

// Apply authentication middleware to all routes
router.use(AuthController.requireAuth);

router.get('/', FinanceController.index);
router.post('/criar', FinanceController.criar);
router.post('/atualizar/:id', FinanceController.atualizar);
router.get('/deletar/:id', FinanceController.deletar);
router.get('/relatorio', FinanceController.dashboard);
router.post('/filtrar', FinanceController.filtrar);
router.get('/exportar', FinanceController.exportar);

module.exports = router;