const db = require('../db');
const bcrypt = require('bcrypt');

// Register User
exports.registerUser = (req, res) => {
    const { names, email, phone, username, password } = req.body;

    if (!username || !password)
        return res.status(400).json({ message: "Username and password are required." });

    const checkQuery = "SELECT * FROM users WHERE username = $4";
    db.query(checkQuery, [username], async (err, result) => {
        if (err) return res.status(500).json({ error: err });

        if (result.length > 0)
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

// Login User
exports.loginUser = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password)
        return res.status(400).json({ message: "Username and password are required." });

    const loginQuery = "SELECT * FROM users WHERE username = ?";
    db.query(loginQuery, [username], async (err, result) => {
        if (err) return res.status(500).json({ error: err });

        if (result.length === 0)
            return res.status(401).json({ message: "Invalid username or password." });

        const isMatch = await bcrypt.compare(password, result[0].password);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid username or password." });

        res.status(200).json({ message: "Login successful!" });
    });
};
