const sharp = require('sharp');
const Book = require('../models/bookModel.js'); 
const User = require("../models/User.js");

// Add a new book (admin only)
exports.addBook = async (req, res) => {
  // console.log("Request Body:", req.body); // Debugging
  const { genre, authorName, bookName, ISBN, rate, price} = req.body;

  // Validate required fields
  if (!genre || !authorName || !bookName || !ISBN || !price) {
    return res.status(400).json({ msg: 'All fields are required.' });
  }

  const userDetails = await User.findById(Object.values(req.user)[0].id);
  // console.log(userDetails); // DBug
  if (!userDetails || !userDetails.admin) {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }

  try {
    let resizedImagePath = null;

    // Check if an image was uploaded and process it
    if (req.file) {
      const image = req.file;
      resizedImagePath = `uploads/resized-${image.filename}`;
      await sharp(image.path).resize(200, 300).toFile(resizedImagePath);
    }

    // Create and save the new book
    const newBook = new Book({
      genre,
      authorName,
      bookName,
      ISBN,
      rate,
      price,
      image: resizedImagePath || undefined,
    });

    await newBook.save();
    userDetails.myBooks.push(newBook._id);
    await userDetails.save(); 
    res.status(201).json({ msg: 'Book added', book: newBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
}

// List all books (accessible to all users)
exports.listBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Update a book (admin only)
exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { genre, authorName, bookName, ISBN, rate, price } = req.body;

  const userDetails = await User.findById(Object.values(req.user)[0].id);
  if (!userDetails || !userDetails.admin) {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }

  try {
    const updatedData = {
      genre,
      authorName,
      bookName,
      ISBN,
      rate,
      price
    };

    // Check if an image was uploaded
    if (req.file) {
      const image = req.file;
      updatedData.image = `uploads/${image.filename}`;
    }

    const updatedBook = await Book.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedBook) {
      return res.status(404).json({ msg: 'Book not found' });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Delete a book (admin only)
exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  const userDetails = await User.findById(Object.values(req.user)[0].id);
  if (!userDetails || !userDetails.admin) {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }

  try {
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ msg: 'Book not found' });
    }

    res.status(200).json({ msg: 'Book deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Search a book
exports.searchBooks = async (req, res) => {
  const { search } = req.body;

  // Validate input
  if (!search) {
    return res.status(400).json({ msg: 'Search term is required' });
  }

  try {
    const lowerCaseSearch = search.toLowerCase();

    // Fetch all books from the database
    const books = await Book.find();

    // Filter books based on the search criteria
    const filteredBooks = books.filter(book => {
      return (
        book.authorName.toLowerCase().includes(lowerCaseSearch) ||
        book.bookName.toLowerCase().includes(lowerCaseSearch) ||
        book.genre.toLowerCase().includes(lowerCaseSearch) ||
        book.ISBN.toLowerCase().includes(lowerCaseSearch)
      );
    });

    // Check if any books were found
    if (filteredBooks.length === 0) {
      return res.status(404).json({ msg: 'No books found matching the search criteria.' });
    }

    // Return the found books
    res.json(filteredBooks);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};