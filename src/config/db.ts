import pgPromise from 'pg-promise';

// Initialize pgPromise instance
const pgp = pgPromise({
  capSQL: true
});

// Create a new dbConnection
const db_connection = pgp({
  host: process.env.DB_HOST,
  port: parseInt(<string>process.env.DB_PORT, 10),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

export default { db: db_connection, helpers: pgp.helpers };
