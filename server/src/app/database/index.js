const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "namnp",
  password: "12345678",
  database: "ecommerce",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
});

module.exports = pool;
