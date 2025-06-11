const db = require('../db');

// Create Note (already working)
exports.createNote = (req, res) => {
    const { user_id, title, content } = req.body;
    const query = 'INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *';
    db.query(query, [user_id, title, content], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Note created', note: result.rows[0] });
    });
};

// Get all notes
exports.getAllNotes = (req, res) => {
    const query = 'SELECT * FROM notes';
    db.query(query, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(result.rows);
    });
};

// Get single note
exports.getNoteById = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM notes WHERE id = $1';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.rows.length === 0) return res.status(404).json({ message: 'Note not found' });
        res.status(200).json(result.rows[0]);
    });
};

// Get all notes for a specific user
exports.getNotesByUserId = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM notes WHERE user_id = $1';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(result.rows);
    });
};


// Update note (PUT)
exports.updateNote = (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const query = 'UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING *';
    db.query(query, [title, content, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.rows.length === 0) return res.status(404).json({ message: 'Note not found' });
        res.status(200).json({ message: 'Note updated', note: result.rows[0] });
    });
};

// Partial update (PATCH)
exports.patchNote = (req, res) => {
    const { id } = req.params;
    const fields = [];
    const values = [];
    let i = 1;

    for (let key in req.body) {
        fields.push(`${key} = $${i++}`);
        values.push(req.body[key]);
    }
    values.push(id);

    const query = `UPDATE notes SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`;
    db.query(query, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.rows.length === 0) return res.status(404).json({ message: 'Note not found' });
        res.status(200).json({ message: 'Note patched', note: result.rows[0] });
    });
};

// Delete note
exports.deleteNote = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM notes WHERE id = $1 RETURNING *';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.rows.length === 0) return res.status(404).json({ message: 'Note not found' });
        res.status(200).json({ message: 'Note deleted successfully' });
    });
};
