const router = require('express').Router();
const { stripePublicKey, stripeSecretKey } = require('../config');
const path = require('path');

const stripe = require('stripe')(stripeSecretKey);

module.exports = () => {
  router.get('/', (req, res) => {
    res.json({ Site: 'Stripe Subscriptions' });
  });

  router.get('/public-key', (req, res) => {
    res.json({ publicKey: stripePublicKey });
  });

  router.get('/checkout', (req, res) => {
    const file = path.resolve(__dirname, '../../client/checkout.html');
    res.sendFile(file);
  });

  router.post('/create-customer', async (req, res) => {
    const { name, email, paymentMethodId } = req.body;

    try {
      const customer = await stripe.customers.create({
        payment_method: paymentMethodId,
        name,
        email,
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });
      await res.json({ customer });
    } catch (e) {
      console.log(e.message);
    }
  });

  router.get('/get-customers', async (req, res) => {
    try {
      const customers = await stripe.customers.list();

      res.json(customers);
    } catch (e) {
      console.log(e);
    }
  });

  return router;
};
