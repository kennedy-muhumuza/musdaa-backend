const Pool = require("pg").Pool;
const dotenv = require("dotenv");
dotenv.config();

// const pool = new Pool({
//     user: "postgres",
//     host: "localhost",
//     database: "yourdatabasename",
//     password: "yourpassword",
//     port: 5432,
//   });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true, // You may need to set this to true depending on your PostgreSQL server's SSL configuration.
  },
});

pool.connect((err) => {
  if (err) {
    console.log("Error:Failed to connect to the database");
  } else {
    console.log("Database successfully connected!");
  }
});

const db = pool;
module.exports = db;
