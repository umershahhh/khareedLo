const express = require('express');
const router = express.Router()
const {addAddress, getAddress} = require('../controllers/address.js')
const {Authenticated} = require("../middlewares/auth.js")

router.post('/add',Authenticated, addAddress)
router.get('/get',Authenticated, getAddress)

module.exports = router;