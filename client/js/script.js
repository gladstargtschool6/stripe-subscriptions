function stripeElements(publickKey) {
  const stripe = Stripe(publickKey);
  const elements = stripe.elements();

  // Set up Stripe.js and Elements to use in checkout form
  const style = {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  };

  const card = elements.create('card', { style });
  card.mount('#card-element');

  document.getElementById('submit').addEventListener('click', e => {
    e.preventDefault();

    createPaymentMethod(stripe, card);
  });
}

async function createPaymentMethod(stripe, card) {
  const name = document.getElementById('name-input').value;
  const email = document.getElementById('email-input').value;
  const createPM = await stripe.createPaymentMethod('card', card, {
    billing_details: {
      name,
      email
    }
  });
  const { error, paymentMethod } = await createPM;

  if (error) {
    return console.log(error.message);
  }

  return createCustomer(paymentMethod.id, name, email);
}

async function createCustomer(paymentMethodId, name, email) {
  const result = await fetch('/create-customer', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      email,
      paymentMethodId
    })
  });
  const subscription = await result.json();

  console.log(subscription);
}

async function getStripePublicKey() {
  const result = await fetch('/public-key', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const { publicKey } = await result.json();

  stripeElements(publicKey);
}

getStripePublicKey();
