const express = require('express');
const jwt = require('jsonwebtoken');
const regd_users = express.Router();
const public_users = express.Router();
const books = require('./booksdb.js'); // Corrected path
let users = {};

const isValid = (username) => {
    // Check if the username is valid
    return !!users[username];
};

const authenticatedUser = (username, password) => {
    // Check if username and password match the one we have in records
    return users[username] && users[username].password === password;
};

regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Validate the user credentials
    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ id: username }, '12345', {
            expiresIn: 86400 // expires in 24 hours
        });

        return res.status(200).send({ auth: true, token: token });
    }

    res.status(401).send('Invalid credentials');
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.userId; // Assuming the username is stored in req.userId after authentication

    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!book.reviews[username]) {
        return res.status(404).json({ message: "Review not found" });
    }

    // Delete the review
    delete book.reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports = {
    authenticated: regd_users,
    users: users,
    isValid: isValid,
    authenticatedUser: authenticatedUser
};
