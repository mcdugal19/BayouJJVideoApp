// Connect to DB
const { Client } = require("pg");

const DB_NAME = "Amiibay";

// variable DB_URL based on node environment
const DB_URL =
  process.env.DATABASE_URL || `postgres://localhost:5432/${DB_NAME}`;

let client;

// github actions client config
if (process.env.CI) {
  client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "postgres",
  });
} else {
  // local / heroku client config
  client = new Client(DB_URL);
}

module.exports = client;
