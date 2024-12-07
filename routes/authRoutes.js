const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// Login routes
router.get('/login', AuthController.renderLogin);
router.post('/login', AuthController.login);

// Signup routes
router.get('/signup', AuthController.renderSignup);
router.post('/signup', AuthController.signup);

// Logout route
router.get('/logout', AuthController.logout);

module.exports = router;