const express = require('express');
const path = require('path');
const { port } = require('./config');

// Routes
const stripeRoutes = require('./routes/stripe');

const app = express();

app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../client')));

app.use('/', stripeRoutes());

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
