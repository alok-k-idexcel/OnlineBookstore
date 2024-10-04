const express = require('express');
const router = express.Router();
const { addBook, listBooks, updateBook, deleteBook, searchBooks } = require('../controllers/bookController.js');
const authMiddleware = require('../middleware/authMiddleware.js');
const uploadMiddleware = require('../middleware/uploadMiddleware.js');

// Route to add a book
router.post('/book', authMiddleware, uploadMiddleware.single('image'), addBook);

// Route to list all books (for all users)
router.get('/books', authMiddleware, listBooks);

// Route to update a book
router.put('/book/:id', authMiddleware, uploadMiddleware.single('image'), updateBook);

// Route to delete a book
router.delete('/book/:id', authMiddleware, deleteBook);

// Route To Search Book
router.post('/search', authMiddleware, searchBooks);

module.exports = router;