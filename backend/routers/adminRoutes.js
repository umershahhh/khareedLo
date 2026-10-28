
const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  addNewProduct,
  deleteProduct,
  updateProduct,
  markOrderStatus,
  getAllUsers,
  getProductsList,
} = require("../controllers/admin.js");

const { Authenticated } = require("../middlewares/auth.js");
const { adminAuth } = require("../middlewares/adminAuth.js");

// Authenticate the user first, then check their admin role.
router.use(Authenticated, adminAuth);

router.get("/getAllUsers", getAllUsers);
router.get("/getProductsList", getProductsList);
router.get("/getAllOrders", getAllOrders);
router.post("/addProduct", addNewProduct);
router.delete("/delete/:id", deleteProduct);
router.put("/update/:id", updateProduct);
router.patch("/status/:id", markOrderStatus);

module.exports = router;
