const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const loginRoutes = require('./routes/login');
const signupRoutes = require('./routes/signup');
const expenseRoutes = require('./routes/expence');
const cors = require('cors');
// const Order = require('./models/Order');
const razorpayRoutes = require('./razorpay');



const path = require('path');
const { Sequelize } = require('sequelize');

const app = express();
app.use(cors());

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
    secret: 'U9ydcf4uWJ88Vy84T0xD3Wk9',
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
app.use('/razorpay', razorpayRoutes);

// Create a middleware function that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
  // Check if the user is authenticated or logged in
  if (!req.session.user) {
    return res.status(401).send('You are not logged in');
  }

  // If the user is authenticated, proceed to the next middleware function
  next();
};

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message
    }
  });
});

app.get('/razorpay/:orderId', async (req, res) => {
  const orderId = req.params.orderId;
  // Fetch the order from the "database" using the 'Order' model
  const order = await Order.findOne({ where: { orderId } });

  if (order) {
    // Assuming you have the order details, create the necessary Razorpay options
    const razorpayOptions = {
      key: 'rzp_test_SZyAdHVjCdR8OC',
      amount: 2500, // Amount in paise (e.g., for ₹100, amount should be 10000)
      currency: 'INR',
      name: 'Premium Membership',
      description: 'Get access to premium features',
      order_id: orderId,
      handler: function (response) {
        // Handle the successful transaction here
        console.log('Razorpay payment response:', response);
        if (response.razorpay_payment_id) {
          // Transaction was successful
          // You can implement logic here to update order status and make the user premium
          order.status = 'SUCCESSFUL';
          order.save();
          // Implement the function to make the user premium here
          makeUserPremium(order.userId);
        } else {
          // Transaction failed or was cancelled
          order.status = 'FAILED';
          order.save();
        }
        // Redirect the user to a thank-you page or back to the main page
        res.redirect('/thank-you');
      },
      // Add any other required options here
    };

    // Return the Razorpay options to the client-side JavaScript
    res.json(razorpayOptions);
  } else {
    res.status(404).send('Order not found');
  }
});

// Create the 'createOrder' route handler
app.post('/expence/createOrder', async (req, res) => {
  try {
    // Generate unique order ID
    const orderId = 'order_' + Date.now();

    // Save order in "database" using the 'Order' model
    const order = await Order.create({
      orderId: orderId,
      status: 'PENDING',
    });

    // Return order ID to the client
    res.redirect(`/razorpay/${orderId}`);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
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
