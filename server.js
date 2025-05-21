const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const documentRoutes = require('./routes/documents');
const imageRoutes = require('./routes/images');




const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/documents', documentRoutes);
app.use('/api/images', imageRoutes);




const PORT = process.env.PORT || 3000;
app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:3000');
});


// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));