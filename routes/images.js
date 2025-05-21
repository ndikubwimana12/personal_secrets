const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Upload image
router.post('/upload', upload.single('image'), (req, res) => {
    const { filename, path: filepath } = req.file;

    const sql = 'INSERT INTO images (filename, filepath) VALUES (?, ?)';
    db.query(sql, [filename, filepath], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error saving image' });

        res.status(200).json({ message: 'Image uploaded', id: result.insertId });
    });
});

// Get all images
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM images ORDER BY id DESC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching images' });

        res.status(200).json(results);
    });
});

module.exports = router;
