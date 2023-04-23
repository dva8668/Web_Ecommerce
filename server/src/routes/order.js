const express = require("express");
const router = express.Router();
const OrderController = require("../app/controllers/orderController");
const verifyToken = require("../middleware/auth");

router.get("/getAllOrder", verifyToken, OrderController.getAllOrder);
router.get("/getOrderById/:id", verifyToken, OrderController.getOrderById);
router.post("/createOrder", verifyToken, OrderController.createOrder);
router.put("/editOrder/:orderId", verifyToken, OrderController.editOrder);

router.delete("/delete/:id", verifyToken, OrderController.deleteOrderById);

module.exports = router;
