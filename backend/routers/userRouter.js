const {registerUser, loginUser, getAllUsers, getUserProfile} = require("../controllers/user.js");
const express = require("express");
const router = express.Router();
const {Authenticated} = require("../middlewares/auth.js")



router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/getAll", getAllUsers);

router.get("/getProfile", Authenticated, getUserProfile);

module.exports = router;