const { Pool } = require('pg');

// ? Pool configuration using DATABASE_URL from environment variables
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = pool;
