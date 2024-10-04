const User = require('../models/User.js');
const Order = require('../models/Order.js');
const Book = require('../models/bookModel.js');

exports.buyBook = async (req, res) => {
  const { bookId, address } = req.body;

  if (!address || address.trim() === '') {
    return res.status(400).json({ msg: 'Address is Required' });
  }
  if (!bookId) {
    return res.status(400).json({ msg: 'Book ID is required' });
  }

  try {
    const userId = Object.values(req.user)[0].id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }

    // Check if the book is in the user's cart
    const cartItem = user.cart.find(item => item.bookId.toString() === bookId);
    if (!cartItem) {
      return res.status(400).json({ msg: 'Book not found in your cart' });
    }

    // Get the quantity from the cart
    const quantity = cartItem.quantity;

    // Calculate total price
    const totalPrice = book.price * quantity;

    // Create the order for the purchased book
    const order = new Order({
      userId: user.id,
      genre: book.genre,
      authorName: book.authorName,
      bookName: book.bookName,
      ISBN: book.ISBN,
      rate: book.rate,
      image: book.image || undefined,
      price: book.price,
      quantity: quantity, // Include quantity in the order
      totalPrice: totalPrice, // Save total price
      address: address
    });

    // Save the order
    await order.save();

    // Add order ID to the user's orders array
    user.orders.push(order._id);

    // Remove the purchased book from the cart
    user.cart = user.cart.filter(item => item.bookId.toString() !== bookId); 
    await user.save();

    res.json({ msg: 'Book purchased successfully', order });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Function to CancelOrder
exports.cancelOrder = async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ msg: 'Order ID is required' });
  }

  try {
    const userId = Object.values(req.user)[0].id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    if (order.userId.toString() !== userId) {
      return res.status(403).json({ msg: 'You are not authorized to cancel this order' });
    }

    // Delete the order
    await Order.findByIdAndDelete(orderId);

    // Remove the order ID from the user's orders array
    user.orders = user.orders.filter(id => id.toString() !== orderId);
    await user.save();

    res.json({ msg: 'Order canceled successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// List orders
exports.listOrders = async (req, res) => {
  try {
    const userId = Object.values(req.user)[0].id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Fetching the orders directly without population
    const orders = await Order.find({ userId: user._id });

    res.json({ orders });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Update order
exports.updateOrder = async (req, res) => {
  const { orderId, address, quantity, _id, userId, genre, authorName, bookName, ISBN, rate, image, totalPrice, price } = req.body;

  if(_id || userId || genre || authorName || bookName || ISBN || rate || image || totalPrice || price){
    return res.status(400).json({msg:'Fields are not Allowed to change'})
  }

  if (!orderId) {
    return res.status(400).json({ msg: 'Order ID is required' });
  }

  try {
    const userId = Object.values(req.user)[0].id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    if (order.userId.toString() !== userId) {
      return res.status(403).json({ msg: 'You are not authorized to update this order' });
    }

    // Update the order details if provided
    if (address) {
      order.address = address; 
    }

    if(quantity){
      order.quantity = quantity;
      order.totalPrice = 0
      order.totalPrice = quantity * order.price;
    }
    
    // Save the updated order
    await order.save();
    res.json({ msg: 'Order updated successfully', order });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};