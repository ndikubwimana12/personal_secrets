const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');


dotenv.config();

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const imageRoutes = require('./routes/images');


const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/images', imageRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Mount the documents routes
const documentRoutes = require('./routes/documents');
app.use('/documents', documentRoutes);



const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));