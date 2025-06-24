const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    uploadDocument,
    getAllDocuments,
    getDocument,
    deleteDocument
} = require('../controllers/documentsController');

// Storage config for multer
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error('Invalid file type'), false);
};

const upload = multer({ storage, fileFilter });

// Routes
router.post('/upload', upload.single('document'), uploadDocument);
router.get('/', getAllDocuments);
router.get('/:filename', getDocument);
router.delete('/:filename', deleteDocument);

module.exports = router;
