const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "devih",
  password: "Devih.2001",
  database: "ecommerce",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
});

module.exports = pool;
