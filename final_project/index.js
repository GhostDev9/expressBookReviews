const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const public_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        console.log('No token provided');
        return res.status(403).send({ message: 'No token provided.' });
    }

    jwt.verify(token, '12345', function(err, decoded) {
        if (err) {
            console.log('Failed to authenticate token', err);
            return res.status(500).send({ message: 'Failed to authenticate token.' });
        }

        // If everything is good, save the decoded token to request for use in other routes
        req.userId = decoded.id;
        req.session.username = decoded.id; // Store the username in the session
        next();
    });
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", public_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
