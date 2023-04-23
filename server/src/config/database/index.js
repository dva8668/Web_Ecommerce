const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "ecommerce",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
});

// const getConnection = function (callback) {
//   pool.getConnection(function (err, connection) {
//     if (err) throw err;

//     callback(connection);
//   });
// };

// module.exports = getConnection;

module.exports = pool;
