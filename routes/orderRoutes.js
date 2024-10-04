const express = require("express")
const router = express.Router()
const { buyBook, cancelOrder, updateOrder, listOrders } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Route TO order a Book from cart 
router.post('/createOrder', authMiddleware, buyBook);

// Route to Cancel a order 
router.post('/cancelOrder',authMiddleware,cancelOrder)

// Route to Update order
router.put('/updateOrder',authMiddleware,updateOrder)

// Route to list Orders
router.get('/listOrders',authMiddleware,listOrders)

module.exports = router;