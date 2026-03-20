const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 10: Get the book list available in the shop using Async/Await
public_users.get('/', async function (req, res) {
  try {
    // Simulating an asynchronous call to the books database
    const getBooks = () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(books), 500);
      });
    };
    const allBooks = await getBooks();
    res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: "ISBN not found" });
    }
  });

  getBookByISBN
    .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(err.status).json({ message: err.message }));
});

// Task 12: Get book details based on author using Async/Await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getByAuthor = () => {
      return new Promise((resolve) => {
        const keys = Object.keys(books);
        const filtered = keys.filter(k => books[k].author === author).map(k => books[k]);
        resolve(filtered);
      });
    };
    const results = await getByAuthor();
    if (results.length > 0) {
      res.status(200).send(JSON.stringify(results, null, 4));
    } else {
      res.status(404).json({ message: "Author not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Request failed" });
  }
});

// Task 13: Get book details based on title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const getByTitle = new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    const bookKey = keys.find(k => books[k].title === title);
    if (bookKey) {
      resolve(books[bookKey]);
    } else {
      reject("Title not found");
    }
  });

  getByTitle
    .then((data) => res.status(200).send(JSON.stringify(data, null, 4)))
    .catch((err) => res.status(404).json({ message: err }));
});

// Get book review (Standard implementation)
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({ message: "No reviews found" });
  }
});

module.exports.general = public_users;
