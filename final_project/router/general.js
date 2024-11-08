const express = require('express');
const axios = require('axios');
const public_users = express.Router();
const books = require('./booksdb.js'); // Corrected path
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

// Get the book list available in the shop using Promise callbacks
public_users.get('/', function (req, res) {
    return new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject({ message: 'Error fetching books' });
        }
    })
    .then(response => {
        res.status(200).json(response);
    })
    .catch(error => {
        res.status(500).json({ message: 'Error fetching books', error: error.message });
    });
});

// Get the book list available in the shop using async-await
public_users.get('/async', async function (req, res) {
    try {
        const response = await new Promise((resolve, reject) => {
            if (books) {
                resolve(books);
            } else {
                reject({ message: 'Error fetching books' });
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error: error.message });
    }
});

// Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject({ message: 'Book not found' });
        }
    })
    .then(response => {
        res.status(200).json(response);
    })
    .catch(error => {
        res.status(404).json({ message: 'Book not found', error: error.message });
    });
});

// Get book details based on ISBN using async-await
public_users.get('/isbn/async/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const response = await new Promise((resolve, reject) => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject({ message: 'Book not found' });
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(404).json({ message: 'Book not found', error: error.message });
    }
});

// Get book details based on author using Promise callbacks
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    return new Promise((resolve, reject) => {
        const booksByAuthor = [];
        for (let key in books) {
            if (books[key].author === author) {
                booksByAuthor.push(books[key]);
            }
        }
        if (booksByAuthor.length > 0) {
            resolve(booksByAuthor);
        } else {
            reject({ message: 'Books by this author not found' });
        }
    })
    .then(response => {
        res.status(200).json(response);
    })
    .catch(error => {
        res.status(404).json({ message: 'Books by this author not found', error: error.message });
    });
});

// Get book details based on author using async-await
public_users.get('/author/async/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await new Promise((resolve, reject) => {
            const booksByAuthor = [];
            for (let key in books) {
                if (books[key].author === author) {
                    booksByAuthor.push(books[key]);
                }
            }
            if (booksByAuthor.length > 0) {
                resolve(booksByAuthor);
            } else {
                reject({ message: 'Books by this author not found' });
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(404).json({ message: 'Books by this author not found', error: error.message });
    }
});

// Get book details based on title using Promise callbacks
public_users.get('/title/:title', function (req, res) {
    const title = decodeURIComponent(req.params.title);
    return new Promise((resolve, reject) => {
        const booksByTitle = [];
        for (let key in books) {
            if (books[key].title === title) {
                booksByTitle.push(books[key]);
            }
        }
        if (booksByTitle.length > 0) {
            resolve(booksByTitle);
        } else {
            reject({ message: 'Books with this title not found' });
        }
    })
    .then(response => {
        res.status(200).json(response);
    })
    .catch(error => {
        res.status(404).json({ message: 'Books with this title not found', error: error.message });
    });
});

// Get book details based on title using async-await
public_users.get('/title/async/:title', async function (req, res) {
    const title = decodeURIComponent(req.params.title);
    try {
        const response = await new Promise((resolve, reject) => {
            const booksByTitle = [];
            for (let key in books) {
                if (books[key].title === title) {
                    booksByTitle.push(books[key]);
                }
            }
            if (booksByTitle.length > 0) {
                resolve(booksByTitle);
            } else {
                reject({ message: 'Books with this title not found' });
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(404).json({ message: 'Books with this title not found', error: error.message });
    }
});

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username already exists
    if (users[username]) {
        return res.status(400).json({ message: "Username already exists" });
    }

    // Add the new user
    users[username] = { password: password };
    return res.status(201).json({ message: "User registered successfully" });
});

// Add or modify a book review
public_users.put('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.username; // Assuming the username is stored in req.session.username after authentication

    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Add or modify the review
    book.reviews[username] = review;
    return res.status(200).json({ message: "Review added/modified successfully" });
});

module.exports = {
    general: public_users
};
