require('dotenv').config();
const { Pool } = require('pg');

// PostgreSQL connection using DATABASE_URL (e.g., from Neon)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test connection with a simple query
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ DB connection failed:', err.stack);
        process.exit(1);
    } else {
        console.log('✅ PostgreSQL Connected! Running test query...');

        client.query('SELECT NOW()', (err, result) => {
            release(); // release the connection back to the pool

            if (err) {
                console.error('❌ Test query failed:', err.stack);
            } else {
                console.log('✅ Test query successful. Server time is:', result.rows[0].now);
            }
        });
    }
});

module.exports = pool;
