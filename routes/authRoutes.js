const express = require("express");
const { signup, verifyOTP, login } = require("../controllers/authController");
const router = express.Router();

// User Register Route
router.post("/signup", signup);

// Route For OTP Verification
router.post("/verify-otp", verifyOTP);

// Route for Login
router.post("/login", login);

module.exports = router;
