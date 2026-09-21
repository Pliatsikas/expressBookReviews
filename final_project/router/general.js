const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// Task 6: Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(409).json({message: "User already exists!"});
  }

  users.push({ username: username, password: password });
  return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Task 1: Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 4));
  }
  return res.status(404).json({message: "Book not found"});
 });
  
// Task 3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const matches = [];

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].author === author) {
      matches.push({ isbn: isbn, ...books[isbn] });
    }
  });

  if (matches.length > 0) {
    return res.status(200).send(JSON.stringify({ booksbyauthor: matches }, null, 4));
  }
  return res.status(404).json({message: "No books found by this author"});
});

// Task 4: Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const matches = [];

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].title === title) {
      matches.push({ isbn: isbn, ...books[isbn] });
    }
  });

  if (matches.length > 0) {
    return res.status(200).send(JSON.stringify({ booksbytitle: matches }, null, 4));
  }
  return res.status(404).json({message: "No books found with this title"});
});

// Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  }
  return res.status(404).json({message: "Book not found"});
});

// ---------------------------------------------------------------
// Tasks 10-13: Same lookups using async-await with Axios
// ---------------------------------------------------------------

// Task 10: Get the list of all books using async-await with Axios
const getAllBooks = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching book list: ${error.message}`);
  }
};

// Task 11: Get book details based on ISBN using async-await with Axios
const getBookByISBN = async (isbn) => {
  try {
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching book with ISBN ${isbn}: ${error.message}`);
  }
};

// Task 12: Get book details based on author using async-await with Axios
const getBooksByAuthor = async (author) => {
  try {
    const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching books by author ${author}: ${error.message}`);
  }
};

// Task 13: Get book details based on title using async-await with Axios
const getBooksByTitle = async (title) => {
  try {
    const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching books with title ${title}: ${error.message}`);
  }
};

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;