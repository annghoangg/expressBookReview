const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 10: Get all books using Async/Await & Axios
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get("http://localhost:5000/books"); // Simulated internal endpoint
        res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        res.status(200).send(JSON.stringify(books, null, 4)); // Fallback to local data
    }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => {
            res.status(200).send(JSON.stringify(response.data, null, 4));
        })
        .catch(err => {
            res.status(200).send(JSON.stringify(books[isbn], null, 4)); // Fallback
        });
});

// Task 12: Get book details based on author using Async/Await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        const filtered = Object.values(books).filter(b => b.author === author);
        res.status(200).send(JSON.stringify(filtered, null, 4));
    }
});

// Task 13: Get book details based on title using Promises
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    axios.get(`http://localhost:5000/title/${title}`)
        .then(response => {
            res.status(200).send(JSON.stringify(response.data, null, 4));
        })
        .catch(err => {
            const book = Object.values(books).find(b => b.title === title);
            res.status(200).send(JSON.stringify(book, null, 4));
        });
});

module.exports.general = public_users;
