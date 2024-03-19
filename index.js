const express = require('express');
require('dotenv').config();
const cors = require('cors');

// import Routers
const ProductsRouter = require('./db/routers/productsRouter');

// import Controllers

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
