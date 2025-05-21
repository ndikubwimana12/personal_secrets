const express = require('express');
const router = express.Router();
const db = require('../db');

// Create a new note
router.post('/create', (req, res) => {
    const { user_id, title, content } = req.body;

    if (!user_id || !title || !content) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    const sql = 'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)';
    db.query(sql, [user_id, title, content], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(201).json({ message: 'Note created successfully', noteId: result.insertId });
    });
});


// Get all notes for a user
router.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    const query = "SELECT * FROM notes WHERE user_id = ?";

    db.query(query, [userId], (err, result) => {
        if (err) return res.status(500).json({ error: err });

        return res.status(200).json(result); // ✅ Return the actual result
    });
});



// Delete a note by ID
router.delete('/:note_id', (req, res) => {
    const noteId = req.params.note_id;

    const sql = 'DELETE FROM notes WHERE id = ?';
    db.query(sql, [noteId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Note not found' });
        }

        return res.status(200).json({ message: 'Note deleted successfully' });
    });
});


module.exports = router;
