const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

router.post('/users/register', registerUser);

router.post('/login', userController.loginUser);

module.exports = router;
