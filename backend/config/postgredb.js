import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

let pool;

if (process.env.DB_HOST) {
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  // Test the connection
  pool.connect((err, client, release) => {
    if (err) {
      console.error('Error acquiring client', err.stack);
    } else {
      console.log('PostgreSQL connected successfully');
      release();
    }
  });
} else {
  console.log('PostgreSQL credentials missing in .env. SQL features will be disabled.');
  pool = {
    query: async () => { throw new Error("PostgreSQL database is not configured."); },
    connect: () => { console.log("Mock pool connect called"); }
  };
}

export default pool;
