import dotenv from 'dotenv';
import knex from 'knex';

// Load environment variables from .env file
dotenv.config();

// Create the knex instance using the environment variables
const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

async function testConnection() {
  try {
    await db.raw('SELECT 1');
    console.log('✅ Database connection is working');
  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message);
  }
}

testConnection();

export default db;
