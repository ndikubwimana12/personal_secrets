const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');

// Storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


// POST: Upload new document
router.post('/upload', upload.single('document'), (req, res) => {
    const userId = req.body.user_id;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const sql = 'INSERT INTO documents (user_id, filename, originalname) VALUES (?, ?, ?)';
    db.query(sql, [userId, file.filename, file.originalname], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.status(201).json({ message: 'Document uploaded successfully', file });
    });
});


// GET: Fetch all documents for a user
router.get('/user/:user_id', (req, res) => {
    const userId = req.params.user_id;
    const sql = 'SELECT * FROM documents WHERE user_id = ? ORDER BY uploaded_at DESC';
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        // Prepend URL to filename
        const docs = results.map(doc => ({
            ...doc,
            file_url: `http://localhost:3000/uploads/${doc.filename}`
        }));

        return res.status(200).json({ documents: docs });
    });
});

module.exports = router;
