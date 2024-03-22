const express = require('express');
require('dotenv').config();
const cors = require('cors');

// import Routers
const ProductsRouter = require('./db/routers/productsRouter');
const OrdersRouter = require('./db/routers/ordersRouter');
const CategoriesRouter = require('./db/routers/categoriesRouter');

// import Controllers
const ProductsController = require('./controllers/productsController');
const OrdersController = require('./controllers/ordersController');
const CategoriesController = require('./controllers/categoriesController');

// importing DB
const db = require('./db/models/index');

const { product, user, order, category } = db;

// Initializing Controllers
const productsController = new ProductsController(product);
const ordersController = new OrdersController(order, user, product);
const categoriesController = new CategoriesController(category);

// Initializing Routers
const productsRouter = new ProductsRouter(productsController).routes();
const ordersRouter = new OrdersRouter(ordersController).routes();
const categoriesRouter = new CategoriesRouter(categoriesController).routes();

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());

// Enable and use router
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/categories', categoriesRouter);

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
