const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const loginRoutes = require('./routes/login');
const signupRoutes = require('./routes/signup');
const expenseRoutes = require('./routes/expence');


const path = require('path');
const { Sequelize } = require('sequelize');

const app = express();

// Create a Sequelize instance
const sequelize = new Sequelize('bookingapp', 'root', 'Mishra21@', {
  host: 'localhost',
  dialect: 'mysql',
});

// Import your models
const User = require('./models/User');
const Expense = require('./models/Expense');

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Session middleware
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

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

// Define associations between User and Expense models
User.hasMany(Expense, { as: 'expenses' });
Expense.belongsTo(User);

// Sync the models with the database and start the server
sequelize
  .sync({ force: true })
  .then(() => {
    app.listen(4000, () => {
      console.log('Server listening on port 4000');
    });
  })
  .catch((err) => {
    console.error('Error syncing models:', err);
  });
