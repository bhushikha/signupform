const express = require('express');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Sequelize, DataTypes } = require('sequelize');

// Create a Sequelize instance
const sequelize = new Sequelize('bookingapp', 'root', 'Mishra21@', {
    host: 'localhost',
    dialect: 'mysql',
});

// Define the User model
const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Serve the login form
router.get('/', (req, res) => {
    // Render the login.html file
    res.sendFile(path.join(__dirname, '../public/html/login.html'));
});

// Serve the signup form CSS
router.get('/login.css', (req, res) => {
    // Serve the static file
    res.sendFile(path.join(__dirname, '../public/css/login.css'));
});

// Serve the expense form
router.get('/expence', (req, res) => {
    // Verify if the user is authenticated (i.e., has a valid token)
    const token = req.headers.authorization; // Assuming the token is sent in the 'Authorization' header

    // Verify the token using the secret key
    jwt.verify(token, secretKey, (err, decodedToken) => {
        if (err) {
            // If the token is invalid or expired, redirect the user to the login page
            res.redirect('/');
        } else {
            // If the token is valid, render the expense.html file
            res.sendFile(path.join(__dirname, '../public/html/expence.html'));
        }
    });
});

const generateRandomKey = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Store the generated secret key in a variable
const secretKey = generateRandomKey();

// router.post('/', async (req, res) => {
//     const { email, password } = req.body;
//     console.log('Received form data:');
//     console.log('Email:', email);
//     console.log('Password:', password);

//     try {
//         // Check if the user exists in the database
//         const user = await User.findOne({ where: { email, password } });

//         if (!user) {
//             return res.status(401).send('Invalid email or password');
//         }

//         // Generate the JWT token using the secret key
//         const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });

//         // Send the token back in the response
//         res.status(200).json({ message: 'Login successful', token: token });

//     } catch (error) {
//         console.error('Error checking user:', error);
//         res.status(500).send('Error checking user');
//     )};

router.post('/', async (req, res) => {
    const { email, password } = req.body;
    console.log('Received form data:');
    console.log('Email:', email);
    console.log('Password:', password);

    try {
        // Check if the user exists in the database
        const user = await User.findOne({ where: { email, password } });

        if (!user) {
            return res.status(401).send('Invalid email or password');
        }

        // Generate the JWT token using the secret key and include user ID in the payload
        const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });

        // Send the token back in the response
        res.status(200).json({ message: 'Login successful', token: token });

    } catch (error) {
        console.error('Error checking user:', error);
        res.status(500).send('Error checking user');
    }
});

module.exports = router

