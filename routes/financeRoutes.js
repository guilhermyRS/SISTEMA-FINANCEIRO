// routes/financeRoutes.js
const express = require('express');
const router = express.Router();
const FinanceController = require('../controllers/financeController');

router.get('/', FinanceController.index);
router.post('/criar', FinanceController.criar);
router.post('/atualizar/:id', FinanceController.atualizar);
router.get('/deletar/:id', FinanceController.deletar);

// New route for dashboard
router.get('/relatorio', FinanceController.dashboard);
router.post('/filtrar', FinanceController.filtrar);
router.get('/exportar', FinanceController.exportar);

module.exports = router;