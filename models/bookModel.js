const mongoose = require("mongoose");

//book schema
const bookSchema = new mongoose.Schema({
  bookName: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  ISBN: {
    type: String,
    required: true,
    unique: true,
  },
  rate: {
    type: Number,
  },
  image: {
    type: String,
  },
  price: {
    type: Number,
  }
});

// Create and export the book model
const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
