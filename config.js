const crypto = require('crypto');

// Function to generate a random key
const generateRandomKey = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Generate the secret key
const secretKey = generateRandomKey();

module.exports = secretKey;
