const User = require("../models/User.js");
const Order = require("../models/Order.js");
const Product = require("../models/Product.js");


const getAllUsers = async (req, res) => {
  try{
    const users = await User.find().sort({createdAt: -1});
    res.status(200).json({message: "All users fetched successfully", users, success: true})
  }
  catch(error){
    res.status(500).json({message: "Error occurred while fetching users", success: false})
  }
}

//get all confirmed orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res
      .status(200)
      .json({
        message: "All orders fetched successfully",
        orders,
        success: true,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error occurred while fetching orders",
        success: false,
      });
  }
};

  //add new product
const addNewProduct = async (req, res) => {
  console.log("product add called");
  const { title, description, imgSrc, category, qty, price } = req.body;
  try {
    if (!title || !description || !imgSrc || !category || !qty || !price) {
      return res
        .status(400)
        .json({ message: "Please fill all the fields", success: false });
    }
    let productExists = await Product.findOne({ title });
    if (productExists) {
      console.log("Product already exists");
      return res
        .status(400)
        .json({ message: "Product already exists", success: false });
    }
    const newProduct = await Product.create({
      title,
      description,
      imgSrc,
      category,
      qty,
      price,
    });
    res
      .status(201)
      .json({
        message: "Product registered successfully",
        product: newProduct,
        success: true,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error occurred while registering new product",
        success: false,
      });
  }
};

  //delete product
 const deleteProduct = async (req, res) => {
    const {id} = req.params;
    try{
      const deleteProduct = await Product.findByIdAndDelete(id);
      if(!deleteProduct){
        return res.status(404).json({message:"Product not found", success: false})
      }
      res.status(200).json({message: "Product deleted successfully", product: deleteProduct, success: true})    
    }
    catch(error){
      res.status(400).json({message:"Invalid product id", success: false})
    }
  }

  //get all products
  const getProductsList = async (req, res) =>{
    try{
  const products = await Product.find().sort({createdAt: -1});
    res.status(200).json({message: "all products fetched successfully", products, success: true})
    }
    catch(error){
      res.status(400).json({message:error.message, success: false})
    }
  
  }

  //update product
  const updateProduct = async (req, res) =>{
    const {id} = req.params;
    const {title,description, imgSrc, category, qty, price} = req.body;
    try{
      const updateProduct = await Product.findByIdAndUpdate(id, {title,description, imgSrc, category, qty, price}, {new: true});
      res.status(200).json({message: "Product updated successfully", product: updateProduct, success: true})  
    }
    catch(error){
      res.status(400).json({message:error.message, success: false})
    }
    }

  // mark order status
    const markOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, orderStatus, deliveryStatus } = req.body;

    // 1. Validate MongoDB order ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    // 2. Define allowed status values
    const allowedStatuses = {
      paymentStatus: ["pending", "paid", "failed", "refunded"],
      orderStatus: ["pending-confirmation", "confirmed", "cancelled"],
      deliveryStatus: ["not-delivered", "shipped", "delivered"],
    };

    // 3. Build update object using only provided fields
    const updateFields = {};

    if (paymentStatus !== undefined) {
      if (!allowedStatuses.paymentStatus.includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment status",
        });
      }

      updateFields.paymentStatus = paymentStatus;
    }

    if (orderStatus !== undefined) {
      if (!allowedStatuses.orderStatus.includes(orderStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order status",
        });
      }

      updateFields.orderStatus = orderStatus;
    }

    if (deliveryStatus !== undefined) {
      if (!allowedStatuses.deliveryStatus.includes(deliveryStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid delivery status",
        });
      }

      updateFields.deliveryStatus = deliveryStatus;
    }

    // 4. Ensure at least one status was provided
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one status to update",
      });
    }

    // 5. Find and update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updateFields },
      {
        new: true,
        runValidators: true,
      }
    );

    // 6. Check if order exists
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 7. Return updated order
    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};


module.exports = { getAllOrders, addNewProduct, deleteProduct, updateProduct, markOrderStatus, getAllUsers, getProductsList };