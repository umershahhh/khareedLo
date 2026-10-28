const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "",
    },
    imgSrc: {
      type: String,
      default: "",
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    lineTotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "An order must contain at least one item.",
      },
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    shippingAddress: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    paymentMethod: {
      type: String,
      default: "not-integrated",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "pending-confirmation",
        "confirmed",
        "cancelled",
      ],
      default: "pending-confirmation",
    },

    deliveryStatus: {
      type: String,
      enum: [
        "not-delivered",
        "shipped",
        "delivered",
      ],
      default: "not-delivered",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
