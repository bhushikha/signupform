const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Mishra21@',
  database: 'bookingapp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Serve the login form
app.get('/login', (req, res) => {
  res.send(`
    <html>
    <head>
    <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f1f1f1;
    }

    .container {
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .container label,
    .container input {
      display: block;
      width: 100%;
      margin-bottom: 10px;
    }

    .container input[type="email"],
    .container input[type="password"] {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .container button[type="submit"] {
      padding: 10px 20px;
      background-color: #4caf50;
      border: none;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
    }

    .container button[type="submit"]:hover {
      background-color: #45a049;
    }

    .container .signup-link {
      text-align: center;
      margin-top: 10px;
    }

    .container .message {
      margin-top: 10px;
      text-align: center;
      font-weight: bold;
    }
  </style>
    </head>
    <body>
      <div class="container">
        <form id="login-form" method="POST" action="/login">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required>

          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required>

          <button type="submit">Login</button>
        </form>
        <div id="message" class="message"></div>
        <div id="error" class="error"></div>

        <script>
          // Handle form submission
          document.getElementById('login-form').addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent the default form submission

            // Get form values
            var email = document.getElementById('email').value;
            var password = document.getElementById('password').value;

            // Create the request body object
            var requestBody = {
              email: email,
              password: password
            };

            // Send the login request to the backend API
            fetch('/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(requestBody)
            })
              .then(function (response) {
                if (response.ok) {
                  return response.text();
                } else {
                  throw new Error('Login failed');
                }
              })
              .then(function (data) {
                // Handle the response from the backend
                console.log(data);
                document.getElementById('message').textContent = data;
                document.getElementById('error').textContent = '';
              })
              .catch(function (error) {
                console.error('Error:', error);
                document.getElementById('message').textContent = '';
                document.getElementById('error').textContent = 'Invalid email or password';
              });
          });
        </script>
      </div>
    </body>
    </html>
  `);
});

// Handle login request
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists in the database
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return res.status(500).send('Error connecting to the database');
    }

    // Execute the SQL query to retrieve the hashed password for the email
    connection.query(
      'SELECT password FROM users WHERE email = ?',
      [email],
      (error, results) => {
        connection.release(); // Release the connection

        if (error) {
          console.error('Error checking user:', error);
          return res.status(500).send('Error checking user');
        }

        if (results.length === 0) {
          // User does not exist or invalid credentials
          return res.status(401).send('Invalid email or password');
        }

        const hashedPassword = results[0].password;

        // Compare the entered password with the stored hashed password
        bcrypt.compare(password, hashedPassword, (compareError, isMatch) => {
          if (compareError) {
            console.error('Error comparing passwords:', compareError);
            return res.status(500).send('Error comparing passwords');
          }

          if (!isMatch) {
            // Invalid password
            return res.status(401).send('Invalid email or password');
          }

          // User found, login successful
          console.log('Login successful:', email);
          res.send('Login successful!');
        });
      }
    );
  });
});
// Serve the signup form
app.get('/signup', (req, res) => {
  res.send(`
    <html>
    <head>
    <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f1f1f1;
    }

    .container {
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .container label,
    .container input {
      display: block;
      width: 100%;
      margin-bottom: 10px;
    }

    .container input[type="text"],
    .container input[type="email"],
    .container input[type="password"] {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .container button[type="submit"] {
      padding: 10px 20px;
      background-color: #4caf50;
      border: none;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
    }

    .container button[type="submit"]:hover {
      background-color: #45a049;
    }
  </style>
    </head>
    <body>
      <div class="container">
        <form method="POST" action="/signup">
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" required>

          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required>

          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required>

          <button type="submit">Sign up</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

// Handle signup request
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  // Check if the user already exists
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return res.status(500).send('Error connecting to the database');
    }

    // Execute the SQL query to check if the user already exists
    connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email],
      (error, results) => {
        if (error) {
          connection.release(); // Release the connection
          console.error('Error checking existing user:', error);
          return res.status(500).send('Error checking existing user');
        }

        if (results.length > 0) {
          // User already exists
          connection.release(); // Release the connection
          return res.send('User already exists');
        }

        // User does not exist, hash and salt the password
        bcrypt.hash(password, saltRounds, (hashError, hashedPassword) => {
          if (hashError) {
            connection.release(); // Release the connection
            console.error('Error hashing password:', hashError);
            return res.status(500).send('Error hashing password');
          }

          // Insert the user into the database with the hashed password
          connection.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword],
            (insertError) => {
              connection.release(); // Release the connection

              if (insertError) {
                console.error('Error inserting user into the database:', insertError);
                return res.status(500).send('Error inserting user into the database');
              }

              console.log(`New user signup: ${name}, ${email}, ${hashedPassword}`);

              res.send('Signup successful!');
            }
          );
        });
      }
    );
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
