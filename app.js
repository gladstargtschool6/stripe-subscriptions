const express = require('express');
const { port } = require('./config');

const app = express();

app.get('/', (req, res) => {
  res.json({ site: 'website api' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
