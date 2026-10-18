const mongoose = require("mongoose");
const Cart = require("../models/Cart.js");
const Order = require("../models/Order.js");

// CREATE ORDER
 const createOrder = async (req, res) => {
  try {
    const userId = req.user;
    const { shippingAddress, paymentMethod } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please log in first.",
      });
    }

    if (
      !shippingAddress ||
      typeof shippingAddress !== "object" ||
      Array.isArray(shippingAddress) ||
      Object.keys(shippingAddress).length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "A shipping address is required.",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    // Convert cart entries into a permanent order snapshot.
    // Assumption: cart item price stores the total for that item's
    // current quantity, as in your existing cart logic.
    const orderItems = cart.items.map((item) => {
      const quantity = Number(item.qty);
      const lineTotal = Number(item.price);

      if (
        !item.productId ||
        !mongoose.isValidObjectId(item.productId) ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        !Number.isFinite(lineTotal) ||
        lineTotal < 0
      ) {
        throw new Error("Invalid product or price in cart.");
      }

      return {
        productId: item.productId,
        title: item.title,
        category: item.category || "",
        imgSrc: item.imgSrc || "",
        unitPrice: Number((lineTotal / quantity).toFixed(2)),
        quantity,
        lineTotal: Number(lineTotal.toFixed(2)),
      };
    });

    const totalAmount = Number(
      orderItems
        .reduce((sum, item) => sum + item.lineTotal, 0)
        .toFixed(2)
    );

    const order = await Order.create({
      userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || "not-integrated",
      paymentStatus: "pending",
      orderStatus: "pending-confirmation",
      deliveryStatus: "not-delivered",
    });

    // Clear the cart only after the order has been saved.
    cart.items = [];
    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to place your order.",
    });
  }
};

// GET ALL ORDERS FOR THE LOGGED-IN USER
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please log in first.",
      });
    }

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch your orders.",
    });
  }
};

// GET ONE ORDER BELONGING TO THE LOGGED-IN USER
const getMyOrderById = async (req, res) => {
  try {
    const userId = req.user;
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const order = await Order.findOne({
      _id: id,
      userId,
    }).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch order details.",
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getMyOrderById,
};
