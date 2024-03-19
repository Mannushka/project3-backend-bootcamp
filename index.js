const express = require('express');
require('dotenv').config();
const cors = require('cors');

// import Routers
const ProductsRouter = require('./db/routers/productsRouter');

// import Controllers
const ProductsController = require('./controllers/productsController');

// importing DB
const db = require('./db/models/index');

const { product, user, order } = db;

// Initializing Controllers
const productsController = new ProductsController(product);

// Initializing Routers
const productsRouter = new ProductsRouter(productsController).routes();

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());

// Enable and use router
app.use('/products', productsRouter);

// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
