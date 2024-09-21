const { Pool } = require('pg');
require('dotenv').config();

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
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DB,
        password: process.env.PG_PASSWORD,
        port: process.env.PG_PORT
    });
}

module.exports = pool;
