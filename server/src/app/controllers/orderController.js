jwt = require("jsonwebtoken");
const pool = require("../../config/database");
const { v4: uuidv4 } = require("uuid");

class OrderController {
  getAllOrder(req, res) {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query("SELECT * FROM orders", (err, rows) => {
        if (err) throw err;
        if (rows.length === 0) return res.status(401).json({ success: false });

        res.status(200).json({
          success: true,
          orders: rows,
        });
      });
      connection.release();
    });
  }

  getOrderById(req, res) {
    const id = req.params.id;

    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        "SELECT * FROM orders inner join displayorder on orders.orderId = displayorder.orderId WHERE orders.orderId = ?",
        [id],
        (err, rows, fields) => {
          if (err) throw err;
          if (rows.length === 0)
            return res.status(401).json({ success: false });
          res.status(200).json({ success: true, orders: rows });
        }
      );
      connection.release();
    });
  }

  createOrder(req, res) {
    const user = req.body.user;
    const carts = req.body.cart;
    const totalPrice = req.body.totalPrice;

    const randomOrderId = uuidv4();

    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `INSERT INTO orders (orderId, username, fullname, address, status, orderDate, totalPrice) VALUES (${JSON.stringify(
          randomOrderId
        )}, ${JSON.stringify(user.username)}, ${JSON.stringify(
          user.fullname
        )}, ${JSON.stringify(user.address)}, "pending" , ${connection.escape(
          new Date()
        )}, ${totalPrice})`,
        (err, rows) => {
          if (err) throw err;

          carts.map((cart) => {
            connection.query(
              `INSERT INTO displayorder (orderId, productId, productName, productImage, productColor, productSize, quality, price) VALUES (${JSON.stringify(
                randomOrderId
              )}, ${JSON.stringify(cart.productId)}, ${JSON.stringify(
                cart.title
              )}, ${JSON.stringify(cart.imagePath)}, ${JSON.stringify(
                cart.color
              )} , ${JSON.stringify(cart.size)}, ${cart.quality}, ${
                cart.price
              })`,
              (err, rows) => {
                if (err) throw err;

                connection.query(
                  `DELETE FROM cart WHERE id = ?`,
                  cart.cartId,
                  (err, rows) => {
                    if (err) throw err;
                  }
                );

                connection.query(
                  "SELECT * FROM variants WHERE productId = ? AND color = ? AND size = ?",
                  [cart.productId, cart.color, cart.size],
                  (err, rows, fields) => {
                    if (err) throw err;
                    if (rows.length === 0)
                      return res.status(401).json({ success: false });

                    if (rows[0].quality >= cart.quality) {
                      connection.query(
                        "UPDATE variants SET quality = ? WHERE id = ?",
                        [rows[0].quality - cart.quality, rows[0].id],
                        (err, rows) => {
                          if (err) throw err;
                        }
                      );
                    } else {
                      connection.query(
                        "UPDATE variants SET quality = ? WHERE id = ?",
                        [rows[0].quality, rows[0].id],
                        (err, rows) => {
                          if (err) throw err;
                        }
                      );
                    }
                  }
                );

                connection.query(
                  "SELECT * FROM product WHERE productId = ?",
                  [cart.productId],
                  (err, rows, fields) => {
                    if (err) throw err;
                    if (rows.length === 0)
                      return res.status(401).json({ success: false });

                    if (rows[0].quality >= cart.quality) {
                      connection.query(
                        "UPDATE product SET quality = ? WHERE productId = ?",
                        [rows[0].quality - cart.quality, cart.productId],
                        (err, rows) => {
                          if (err) throw err;
                        }
                      );
                    } else {
                      connection.query(
                        "UPDATE product SET quality = ? WHERE productId = ?",
                        [rows[0].quality, cart.productId],
                        (err, rows) => {
                          if (err) throw err;
                        }
                      );
                    }
                  }
                );
              }
            );
          });
          res.status(200).json({ success: true });
        }
      );
      connection.release();
    });
  }

  editOrder(req, res) {
    const orderId = req.params.orderId;
    const order = req.body;
    pool.getConnection(function (err, connection) {
      if (err) throw err;

      connection.query(
        "UPDATE orders SET status = ? WHERE orderId = ?",
        [order.status, orderId],
        (err, rows) => {
          if (err) {
            res.json({ success: false });
            throw err;
          }

          res.status(200).json({ success: true });
        }
      );
      connection.release();
    });
  }

  deleteOrderById(req, res) {
    const id = req.params.id;
    pool.getConnection(function (err, connection) {
      if (err) throw err;

      connection.query(
        `DELETE FROM orders WHERE orderId = ?`,
        id,
        (err, rows) => {
          if (err) throw err;

          res.status(200).json({ success: true });
        }
      );
      connection.release();
    });
  }
}

module.exports = new OrderController();
