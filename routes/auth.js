const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUser, patchUser, deleteUser, getAllUsers } = require('../controllers/authController');

router.post('/users/register', registerUser); // Register
router.post('/login', loginUser); // Login
router.put('/users/:id', updateUser);     // Full update
router.patch('/users/:id', patchUser);    // Partial update
router.delete('/users/:id', deleteUser);  // Delete
router.get('/users', getAllUsers); // Get all users

module.exports = router;
