const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

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

        // User does not exist, insert the user into the database
        connection.query(
          'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
          [name, email, password],
          (insertError) => {
            connection.release(); // Release the connection

            if (insertError) {
              console.error('Error inserting user into the database:', insertError);
              return res.status(500).send('Error inserting user into the database');
            }

            console.log(`New user signup: ${name}, ${email}, ${password}`);

            res.send('Signup successful!');
          }
        );
      }
    );
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});