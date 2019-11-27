const {resolve} = require('path');
require('dotenv').config({path: resolve(__dirname, '../../.env')});

module.exports = {
  dev: process.env.NODE_ENV !== 'production',
  port: process.env.PORT,
  stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY
};
