const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: false }));


app.use(bodyParser.json());

// Serve the signup form
app.get('/signup', (req, res) => {
  res.send(`
    <form method="POST" action="/signup">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" required><br><br>

      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required><br><br>

      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required><br><br>

      <button type="submit">Sign up</button>
    </form>
  `);
});


app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  
  console.log(`New user signup: ${name}, ${email}, ${password}`);

  
  res.send('Signup successful!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
