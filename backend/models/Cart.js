const mongoose = require("mongoose");

const {Schema, model} = mongoose;

const cartItemsSchema = new Schema({
  productId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  title:{
    type: String,
    required: true
  },
  price:{
    type: Number,
    required: true
  },
  qty:{
    type: Number,
    required: true
  },
  imgSrc:{
    type: String,
    required: true
  },
  category:{
    type: String,
    required: true
  }
})

const cartSchema = new Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items:[cartItemsSchema]
})

module.exports = model("Cart", cartSchema);