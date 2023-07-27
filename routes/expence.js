const express = require('express');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const secretKey = require('../config');

// ... Rest of the code remains the same


const { Sequelize, DataTypes } = require('sequelize');

// Create a Sequelize instance
const sequelize = new Sequelize('bookingapp', 'root', 'Mishra21@', {
    host: 'localhost',
    dialect: 'mysql',
});

// Define the Expense model
const Expense = sequelize.define('expenses', {
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});
router.use(express.json());


// Serve the signup form
router.get('/', (req, res) => {
    // Render the signup.html file
    res.sendFile(path.join(__dirname, '../public/html/expence.html'));
});

router.post('/addexpense', async (req, res) => {
    const { price, name, category } = req.body;

    try {
        // Insert the expense into the database
        const expense = await Expense.create({ price, name, category });
        console.log('Expense added:', expense.price, expense.name, expense.category);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error inserting expense into the database:', error);
        res.status(500).send('Error inserting expense into the database');
    }
});
// Handle GET request for fetching products
router.get('/products', async (req, res) => {
    try {
        // Fetch all expenses from the database
        const expenses = await Expense.findAll();
        res.json(expenses);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
});
// // Handle DELETE request to delete a product by ID
// router.delete('/products/:id', async (req, res) => {
//     const productId = req.params.id;
//     try {
//         // Find the product by ID and delete it
//         await Expense.destroy({ where: { id: productId } });
//         res.sendStatus(200);
//     } catch (error) {
//         console.error('Error deleting product:', error);
//         res.status(500).send('Error deleting product');
//     }
// });

// ...
router.delete('/products/:id', async (req, res) => {
    // Get the expense ID from the request parameters
    const expenseId = req.params.id;

    // Get the user's authentication token from the request headers
    const token = req.headers.authorization;

    try {
        // Verify the token using the secret key
        jwt.verify(token, secretKey, async (err, decodedToken) => {
            if (err) {
                // If the token is invalid or expired, send a 403 Forbidden response
                res.sendStatus(403);
            } else {
                // Token is valid, get the user ID from the decoded token
                const userId = decodedToken.id;

                // Check if the user is the owner of the expense before deleting it
                const expense = await Expense.findOne({ where: { id: expenseId } });
                if (!expense || expense.id !== userId) {
                    // If the expense does not exist or does not belong to the user, send a 403 Forbidden response
                    res.sendStatus(403);
                } else {
                    // User is the owner of the expense, delete it
                    await Expense.destroy({ where: { id: expenseId } });
                    res.sendStatus(200);
                }
            }
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Error deleting product');
    }
});


module.exports = router;