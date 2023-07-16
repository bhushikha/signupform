const express = require('express');
const router = express.Router();
const db = require('../util/database');
const path = require('path');

// Serve the signup form
router.get('/', (req, res) => {
    // Render the signup.html file
    res.sendFile(path.join(__dirname, '../public/html/expence.html'));
});

// Handle expense submission
router.post('/addexpense', (req, res) => {
    const { price, name, category } = req.body;

    // Insert the expense into the database
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            return res.status(500).send('Error connecting to the database');
        }

        connection.query(
            'INSERT INTO expenses (price, name, category) VALUES (?, ?, ?)',
            [price, name, category],
            (insertError) => {
                connection.release(); // Release the connection

                if (insertError) {
                    console.error('Error inserting expense into the database:', insertError);
                    return res.status(500).send('Error inserting expense into the database');
                }

                console.log('Expense added:', price, name, category);
                res.sendStatus(200);
            }
        );
    });
});

module.exports = router;




