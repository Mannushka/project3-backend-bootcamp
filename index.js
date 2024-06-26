const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { auth } = require("express-oauth2-jwt-bearer");
require("dotenv").config();

const checkJwt = auth({
  audience: process.env.AUDIENCE,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  tokenSigningAlg: process.env.TOKEN_SIGNING_ALG,
});

// import Routers
const ProductsRouter = require("./routers/productsRouter");
const OrdersRouter = require("./routers/ordersRouter");
const CategoriesRouter = require("./routers/categoriesRouter");
const UsersRouter = require("./routers/usersRouter");
const AddressesRouter = require("./routers/addressesRouter");

// import Controllers
const ProductsController = require("./controllers/productsController");
const OrdersController = require("./controllers/ordersController");
const CategoriesController = require("./controllers/categoriesController");
const UsersController = require("./controllers/usersController");
const AddressesController = require("./controllers/addressesController");

// importing DB
const db = require("./db/models/index");

const { product, user, order, category, address, order_products } = db;

// Initializing Controllers
const productsController = new ProductsController(product, order, category);
const ordersController = new OrdersController(
  order,
  user,
  product,
  order_products,
  address
);
const categoriesController = new CategoriesController(category);
const usersController = new UsersController(user);
const addressesController = new AddressesController(address, user);

// Initializing Routers
const productsRouter = new ProductsRouter(
  productsController,
  checkJwt
).routes();
const ordersRouter = new OrdersRouter(ordersController).routes();
const categoriesRouter = new CategoriesRouter(categoriesController).routes();
const usersRouter = new UsersRouter(usersController).routes();
const addressesRouter = new AddressesRouter(addressesController).routes();

const PORT = 3000;
const app = express();

app.use(cors());

// Handle preflight OPTIONS requests
app.options(
  "*",
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// Enable and use router
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);
app.use("/categories", categoriesRouter);
app.use("/users", usersRouter);
app.use("/addresses", addressesRouter);

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
