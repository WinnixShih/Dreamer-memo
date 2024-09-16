const { Pool } = require('pg');

let pool;
if (process.env.NODE_ENV === 'production') {
    // ? Pool configuration using DATABASE_URL from environment variables
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ...(process.env.NODE_ENV === 'production' && {
            ssl: {
                rejectUnauthorized: false
            }
        })
    });
} else {
    pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'dreamer',
        password: 'postgres',
        port: 5432
    });
}

module.exports = pool;
