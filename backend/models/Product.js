const mongoose = require("mongoose");

const {Schema, model} = mongoose;

const productSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  imgSrc:{
    type: String,
    required: true
  },
  category:{
    type: String,
    required: true
  },
  qty:{
    type: Number,
    required: true
  },
  price:{
    type: Number,
    required: true
  },
  createdAt:{
    type: Date,
    default: Date.now
  }
})

module.exports = model("Product", productSchema);

