const express = require("express");
const {
  createOrder,
  getMyOrders,
  getMyOrderById,
} = require("../controllers/orders.js");
const {Authenticated} = require("../middlewares/auth.js")

const router = express.Router();

router.post("/create", Authenticated, createOrder);
router.get("/my-orders", Authenticated, getMyOrders);
router.get("/:id", Authenticated, getMyOrderById);

module.exports = router;
