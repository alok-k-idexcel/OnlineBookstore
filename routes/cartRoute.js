const {
  addToCart,
  removeFromCart,
  listCart,
} = require("../controllers/cartController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const express = require("express");
const router = express.Router();

// Route to add books to cart
router.post("/add", authMiddleware, addToCart);

// Route to remove books from cart
router.post("/remove", authMiddleware, removeFromCart);

// Route to list all Books from cart
router.get("/list", authMiddleware, listCart);

module.exports = router;
