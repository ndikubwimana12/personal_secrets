const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Register User
exports.registerUser = (req, res) => {
    const { names, email, phone, username, password } = req.body;

    if (!username || !password)
        return res.status(400).json({ message: "Username and password are required." });

    const checkQuery = "SELECT * FROM users WHERE username = $1";
    db.query(checkQuery, [username], async (err, result) => {
        if (err) return res.status(500).json({ error: err });

        if (result.rows.length > 0)
            return res.status(409).json({ message: "Username already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
            INSERT INTO users (names, email, phone, username, password)
            VALUES ($1, $2, $3, $4, $5)
        `;

        const values = [names, email, phone, username, hashedPassword];

        db.query(query, values, (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.status(201).json({ message: "User registered successfully!" });
        });
    });
};

// Login Userconst jwt = require('jsonwebtoken');

exports.loginUser = (req, res) => {
    const { username, password } = req.body;

    console.log("➡️ Login request received:", username);

    if (!username || !password)
        return res.status(400).json({ message: "Username and password are required." });

    const loginQuery = "SELECT * FROM users WHERE username = $1";
    db.query(loginQuery, [username], async (err, result) => {
        if (err) {
            console.error("❌ Database query error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (result.rows.length === 0) {
            console.warn("⚠️ User not found");
            return res.status(401).json({ message: "Invalid username or password." });
        }

        const user = result.rows[0];
        console.log("✅ User found:", user);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.warn("⚠️ Incorrect password");
            return res.status(401).json({ message: "Invalid username or password." });
        }

        console.log("🔐 Generating token with secret:", process.env.JWT_SECRET);

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "Login successful!",
            token
        });
    });
};


// Update user - Full update (PUT)
exports.updateUser = (req, res) => {
    const userId = req.params.id;
    const { names, email, phone, username } = req.body;

    const updateQuery = `
        UPDATE users 
        SET names = $1, email = $2, phone = $3, username = $4 
        WHERE id = $5
    `;

    db.query(updateQuery, [names, email, phone, username, userId], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ message: "User updated successfully" });
    });
};

// Partially update user - PATCH (e.g., email only)
exports.patchUser = (req, res) => {
    const userId = req.params.id;
    const updates = [];
    const values = [];
    let idx = 1;

    for (let field in req.body) {
        updates.push(`${field} = $${idx}`);
        values.push(req.body[field]);
        idx++;
    }

    if (updates.length === 0)
        return res.status(400).json({ message: "No fields provided for update" });

    values.push(userId); // Add id as last param

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${idx}`;

    db.query(query, values, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ message: "User patched successfully" });
    });
};

// Delete user
exports.deleteUser = (req, res) => {
    const userId = req.params.id;

    const deleteQuery = `DELETE FROM users WHERE id = $1`;

    db.query(deleteQuery, [userId], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ message: "User deleted successfully" });
    });
};

