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
      // This creates a new Customer and attaches
      // the PaymentMethod to be default for invoice in one API call.
      const customer = await stripe.customers.create({
        payment_method: paymentMethodId,
        name,
        email,
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });

      // At this point, associate the ID of the Customer object with your
      // own internal representation of a customer, if you have one.
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ plan: 'plan_GEe0R58ofquJqj' }],
        expand: ['latest_invoice.payment_intent']
      });

      res.json(subscription);
    } catch (e) {
      res.status(500).send('Server Error');
      console.log(e.message);
    }
  });

  router.get('/get-customers', async (req, res) => {
    try {
      const customers = await stripe.customers.list();

      res.json(customers);
    } catch (e) {
      res.status(500).send('Server Error');
      console.log(e);
    }
  });

  router.get('/get-plans', async (req, res) => {
    try {
      const plans = await stripe.plans.list();

      res.json(plans);
    } catch (e) {
      res.status(500).send('Server Error');
      console.log(e.message);
    }
  });

  return router;
};
