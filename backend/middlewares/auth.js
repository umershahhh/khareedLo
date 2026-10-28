const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/User.js");

const Authenticated = async (req, res, next) => {
  const token = req.header("Auth");
//   console.log("Authenticated middleware reached");
// console.log("Auth header received:", !!req.header("Auth"));

  if (!token) {
    return res.status(401).json({
      message: "Please login first",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.userId;

    if (!id) {
      return res.status(401).json({
        message: "Invalid token payload",
        success: false,
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(401).json({
        message: "User does not exist",
        success: false,
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};

module.exports = { Authenticated };
