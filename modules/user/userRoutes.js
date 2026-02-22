const express = require('express');
const router = express.Router();
const userController = require('./userController');
const { isAuthenticated } = require('../auth/authMiddleware');

// All user routes require authentication
router.use(isAuthenticated);

// Page routes
router.get('/', userController.list);
router.get('/:id/edit', userController.showEdit);

// API routes
router.get('/api', userController.list);
router.get('/api/:id', userController.showEdit);
router.put('/api/:id', userController.update);
router.post('/api/:id/change-password', userController.changePassword);
router.delete('/api/:id', userController.delete);

// Form submission routes
router.post('/:id', userController.update);
router.post('/:id/delete', userController.delete);

module.exports = router;