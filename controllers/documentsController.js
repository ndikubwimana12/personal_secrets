const fs = require('fs');
const path = require('path');

const uploadDocument = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    res.status(200).json({
        message: 'Document uploaded successfully.',
        filename: req.file.filename,
        path: req.file.path
    });
};

const getAllDocuments = (req, res) => {
    const dir = path.join(__dirname, '../uploads');
    fs.readdir(dir, (err, files) => {
        if (err) return res.status(500).json({ error: 'Error reading directory.' });
        res.status(200).json({ documents: files });
    });
};

const getDocument = (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '../uploads', filename);
    if (!fs.existsSync(filepath)) {
        return res.status(404).json({ message: 'Document not found.' });
    }
    res.sendFile(filepath);
};

const deleteDocument = (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '../uploads', filename);
    fs.unlink(filepath, err => {
        if (err) return res.status(404).json({ message: 'File not found or already deleted.' });
        res.status(200).json({ message: 'Document deleted successfully.' });
    });
};

module.exports = {
    uploadDocument,
    getAllDocuments,
    getDocument,
    deleteDocument
};
