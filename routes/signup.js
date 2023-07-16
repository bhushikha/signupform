const express = require('express');
const router = express.Router();
const db = require('../util/database');
const bcrypt = require('bcrypt');
const path = require('path');

router.get('/', (req, res) => {
    // Serve the signup form HTML
    res.sendFile(path.join(__dirname, '../public/html/signup.html'));
});

router.post('/', (req, res) => {
    const { name, email, password } = req.body;

    // Check if the user already exists
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            return res.status(500).send('Error connecting to the database');
        }

        connection.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
            if (error) {
                console.error('Error checking existing user:', error);
                connection.release();
                return res.status(500).send('Error checking existing user');
            }

            if (results.length > 0) {
                connection.release();
                return res.send('User already exists');
            }

            // User does not exist, hash the password
            bcrypt.hash(password, 10, (hashError, hashedPassword) => {
                if (hashError) {
                    console.error('Error hashing password:', hashError);
                    connection.release();
                    return res.status(500).send('Error hashing password');
                }

                // Insert the user into the database
                connection.query(
                    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                    [name, email, hashedPassword],
                    (insertError) => {
                        connection.release();

                        if (insertError) {
                            console.error('Error inserting user into the database:', insertError);
                            return res.status(500).send('Error inserting user into the database');
                        }

                        console.log(`New user signup: ${name}, ${email}, ${hashedPassword}`);
                        res.send('Signup successful!');
                    }
                );
            });
        });
    });
});

module.exports = router;
