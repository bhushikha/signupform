// const express = require('express');
// const router = express.Router();
// const db = require('../util/database');
// const path = require('path');

// // Serve the login form
// router.get('/', (req, res) => {
//     // Render the login.html file
//     res.sendFile(path.join(__dirname, '../public/html/login.html'));
// });

// // Serve the signup form CSS
// router.get('/login.css', (req, res) => {
//     // Serve the static file
//     res.sendFile(path.join(__dirname, '../public/css/login.css'));
// });

// router.post('/login', (req, res) => {
//     const { email, password } = req.body;
//     console.log('Received form data:');
//     console.log('Email:', email);
//     console.log('Password:', password);
//     console.log('Before getConnection')

//     // Check if the user exists in the database
//     db.getConnection((err, connection) => {
//         if (err) {
//             console.error('Error connecting to the database:', err);
//             return res.status(500).send('Error connecting to the database');
//         }

//         connection.query(
//             'SELECT * FROM users WHERE email = ? AND password = ?',
//             [email, password],
//             (error, results) => {
//                 connection.release();

//                 if (error) {
//                     console.error('Error checking user:', error);
//                     return res.status(500).send('Error checking user');
//                 }

//                 console.log('Query results:', results);

//                 if (results.length === 0) {
//                     return res.status(401).send('Invalid email or password');
//                 }

//                 // Assuming you have a user session management middleware,
//                 // you can set the user's session here
//                 req.session.user = results[0];

//                 // Redirect the user to the dashboard
//                 res.redirect('/dashboard');
//             }
//         );
//     });
// });

// // Serve static files
// router.use('/public', express.static(path.join(__dirname, '../public')));

// module.exports = router;

// routes/login.js

const express = require('express');
const router = express.Router();
const db = require('../util/database');
const path = require('path');

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
    // Render the expense.html file
    res.sendFile(path.join(__dirname, '../public/html/expence.html'));
});

router.post('/', (req, res) => {
    const { email, password } = req.body;
    console.log('Received form data:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Before getConnection')

    // Check if the user exists in the database
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            return res.status(500).send('Error connecting to the database');
        }

        connection.query(
            'SELECT * FROM users WHERE email = ? AND password = ?',
            [email, password],
            (error, results) => {
                connection.release();

                if (error) {
                    console.error('Error checking user:', error);
                    return res.status(500).send('Error checking user');
                }

                console.log('Query results:', results);

                if (results.length === 0) {
                    return res.status(401).send('Invalid email or password');
                }

                // Assuming you have a user session management middleware,
                // you can set the user's session here
                req.session.user = results[0];

                // Redirect the user to the dashboard or expense page
                res.redirect('/expence'); // Modify this route as per your application's logic
            }
        );
    });
});




module.exports = router;
