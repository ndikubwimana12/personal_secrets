const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// File storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const upload = multer({ storage });

// ======================
// Upload Document
// ======================
router.post('/upload', upload.single('document'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded');
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(200).send({
        message: 'Upload successful',
        name: req.file.originalname,
        url: fileUrl
    });
});

// ======================
// Get All Documents
// ======================
router.get('/all', (req, res) => {
    const dirPath = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(dirPath)) return res.send([]);

    const files = fs.readdirSync(dirPath).map(file => ({
        name: file.split('_').slice(1).join('_'), // remove timestamp
        url: `/uploads/${file}`
    }));

    res.json(files); // return JSON array
});

// ======================
// Delete a Document by Filename
// ======================
router.delete('/:filename', (req, res) => {
    const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return res.status(200).send('Deleted');
    }
    res.status(404).send('File not found');
});

module.exports = router;
