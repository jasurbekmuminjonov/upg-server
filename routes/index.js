const express = require('express');
const { createProduct, getProductsByUser, getFile } = require('../controllers/productController');
const upload = require('../middlewares/multer');
const { createUser, loginUser, sendOtp, verifyUser, forgotPassword, getUserData } = require('../controllers/userController');
const adminAuth = require('../middlewares/adminAuth');
const auth = require('../middlewares/auth');
const { getOrders, getUsers, getProducts, setStatusToOrder, blockUser, unblockUser, updateBalance } = require('../controllers/adminController');
const { getOrdersByUser, createOrder } = require('../controllers/orderController');
const rt = express.Router();

rt.get("/product", getProductsByUser)
rt.get("/file/:id", getFile)
//
rt.get("/order", auth, getOrdersByUser)
rt.post("/order/create", auth, createOrder)
//
rt.get("/user", auth, getUserData)
rt.post("/user/signup", createUser)
rt.post("/user/signin", loginUser)
rt.post("/otp/send", sendOtp)
rt.post("/otp/verify", verifyUser)
rt.post("/otp/reset", forgotPassword)
//
rt.get("/product/admin", adminAuth, getProducts)
rt.post("/product/create", adminAuth, upload.single("image"), createProduct)
rt.get("/order/admin", adminAuth, getOrders)
rt.post("/order/status/:id", adminAuth, setStatusToOrder)
rt.get("/user/admin", adminAuth, getUsers)
rt.get("/user/:id/block", adminAuth, blockUser)
rt.get("/user/:id/unblock", adminAuth, unblockUser)
rt.post("/user/:id/balance", adminAuth, updateBalance)

module.exports = rt;