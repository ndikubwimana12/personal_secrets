require('dotenv').config();
const { Pool } = require('pg');

// Neon PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for Neon
    }
});

// Test the connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ DB connection failed:', err.stack);
        process.exit(1);
    } else {
        console.log('✅ PostgreSQL Connected!');
        release();
    }
});

module.exports = pool;
