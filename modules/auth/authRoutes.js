const express = require('express');
const router = express.Router();
const authController = require('./authController');
const { isAuthenticated, isGuest } = require('./authMiddleware');

// Page routes
router.get('/register', isGuest, authController.showRegister);
router.get('/login', isGuest, authController.showLogin);
router.get('/dashboard', isAuthenticated, authController.showDashboard);

// API routes
router.post('/api/register', authController.register);
router.post('/api/login', authController.login);
router.post('/api/logout', authController.logout);
router.get('/api/dashboard', isAuthenticated, authController.showDashboard);

// Logout (supports both POST and GET)
router.get('/logout', authController.logout);
router.post('/logout', authController.logout);

module.exports = router;

