const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

router.post('/users/register', registerUser); // Register
router.post('/login', loginUser); // Login
router.put('/users/:id', updateUser);     // Full update
router.patch('/users/:id', patchUser);    // Partial update
router.delete('/users/:id', deleteUser);  // Delete

module.exports = router;
