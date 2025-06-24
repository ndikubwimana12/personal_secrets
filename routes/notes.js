const express = require('express');
const router = express.Router();
const { createNote, getAllNotes, getNoteById, updateNote, patchNote, deleteNote } = require('../controllers/notesController');
// Create
router.post('/', createNote);

// Read
router.get('/', getAllNotes);
router.get('/:id', getNoteById);

// Update
router.put('/:id', updateNote);
router.patch('/:id', patchNote);
router.get('/user/:id', getNotesByUserId);


// Delete
router.delete('/:id', deleteNote);

module.exports = router;
