// const express = require('express');
// const bodyParser = require('body-parser');
// const loginRoutes = require('./routes/login');
// const signupRoutes = require('./routes/signup');
// const expenceRoutes = require('./routes/expence'); 
// const path = require('path');

// const app = express();

// const db = require('./util/database');

// db.query('SELECT 1 + 1', (err, result) => {
//   if (err) {
//     console.error('Error connecting to database:', err);
//     return;
//   }
//   console.log('Connected to the database');
// });

// // Middleware
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// // Serve static files
// app.use(express.static(path.join(__dirname, 'public')));




// // Routes
// app.use('/login', loginRoutes);
// app.use('/signup', signupRoutes);
// app.use('/expence', expenceRoutes); 

// // Create a middleware function that checks if the user is logged in
// const isLoggedIn = (req, res, next) => {
//   // Check if the user is authenticated or logged in
//   if (!req.isAuthenticated()) {
//     return res.status(401).send('You are not logged in');
//   }

//   // If the user is authenticated, proceed to the next middleware function
//   next();
// };

// // Add a global error handler middleware
// app.use((err, req, res, next) => {
//   console.error('Error:', err);
//   res.status(500).send('Internal Server Error');
// });

// // Start the server
// app.listen(4000, () => {
//   console.log('Server listening on port 4000');
// });

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const loginRoutes = require('./routes/login');
const signupRoutes = require('./routes/signup');
const expenseRoutes = require('./routes/expence');
const path = require('path');

const app = express();

const db = require('./util/database');

db.query('SELECT 1 + 1', (err, result) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/login', loginRoutes);
app.use('/signup', signupRoutes);
app.use('/expence', expenseRoutes);

// Create a middleware function that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
  // Check if the user is authenticated or logged in
  if (!req.session.user) {
    return res.status(401).send('You are not logged in');
  }

  // If the user is authenticated, proceed to the next middleware function
  next();
};

// Add a global error handler middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Internal Server Error');
});

// Start the server
app.listen(4000, () => {
  console.log('Server listening on port 4000');
});
