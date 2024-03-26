const BaseController = require('./baseController');
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const YOUR_DOMAIN = 'http://localhost:3000';

class ProductsController extends BaseController {
  constructor(model) {
    super(model);
  }

  // Retrieve specific product
  async getOne(req, res) {
    const { productId } = req.params;

    try {
      const product = await this.model.findByPk(productId, {
        include: {
          association: 'orders',
        },
      });

      return res.json(product);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Update the specific product to reduce stock by number of quantity
  async updateOne(req, res) {
    const { productId } = req.params;

    const { stock_purchased } = req.body;

    const productToBeBought = await this.model.findByPk(productId);

    const { title, price, description } = productToBeBought.dataValues;

    // purchasedProduct TO BE INSERTED INTO CART
    const purchasedProduct = {
      title: title,
      price: price,
      description: description,
      stock_purchased: stock_purchased,
    };

    const stock_left = productToBeBought.dataValues.stock_left;

    console.log(productToBeBought.dataValues.stock_left);

    await productToBeBought.update({
      stock_left: stock_left - stock_purchased,
    });

    res.send(purchasedProduct);
  }

  // Post a new product for sellers
  async postOne(req, res) {
    const {
      title,
      price,
      description,
      // shipping_details,
      stock_left,
      // model_url,
      img,
      categoryId,
    } = req.body;

    try {
      // Create new product
      const newProduct = await this.model.create({
        title: title,
        price: price,
        description: description,
        // shipping_details: shipping_details,
        stock_left: stock_left,
        // model_url: model_url,
        img: img,
        categoryId: categoryId,
      });

      res.send(newProduct);
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  async createStripeProduct(req, res) {
    try {
      const product = stripe.products
        .create({
          name: 'Starter Subscription',
          description: '$12/Month subscription',
        })
        .then((product) => {
          stripe.prices
            .create({
              unit_amount: 1200,
              currency: 'usd',
              recurring: {
                interval: 'month',
              },
              product: product.id,
            })
            .then((price) => {
              console.log(
                'Success! Here is your starter subscription product id: ' +
                  product.id,
              );
              console.log(
                'Success! Here is your starter subscription price id: ' +
                  price.id,
              );
            });
        });

      return res.send(product);
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  async seedRemainingStripeProducts(req, res) {
    try {
      const productIds = [15, 26, 30, 32];
      const products = await this.model.findAll({
        where: {
          id: productIds,
        },
      });

      const formattedOutput = products.map((product) => product.dataValues);
      console.log(formattedOutput);

      await Promise.all(
        formattedOutput.map(async (product) => {
          const productPrice = product.price;
          try {
            const createdProduct = await stripe.products
              .create({
                name: product.title,
                description: product.description,
              })
              .then((product) => {
                stripe.prices.create({
                  unit_amount: productPrice,
                  currency: 'sgd',
                  product: product.id,
                });
              })
              .then((response) => {
                console.log('Success! Here are the product details:', response);
              });

            console.log(createdProduct);
          } catch (err) {
            console.error(`Error creating product in Stripe`, err);
          }
        }),
      );

      return res.json(products);
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  async seedStripeProducts(req, res) {
    try {
      const output = await this.model.findAll();
      const formattedOutput = output.map((product) => product.dataValues);

      // Promise.all method for creating all the stripe products
      await Promise.all(
        formattedOutput.map(async (product) => {
          const productPrice = product.price;
          try {
            const createdProduct = await stripe.products
              .create({
                name: product.title,
                description: product.description,
              })
              .then((product) => {
                stripe.prices.create({
                  unit_amount: productPrice,
                  currency: 'sgd',
                  product: product.id,
                });
              })
              .then((response) => {
                console.log('Success! Here are the product details:', response);
              });

            console.log(createdProduct);
          } catch (err) {
            console.error(`Error creating product in Stripe`, err);
          }
        }),
      );

      // console.log(formattedOutput);
      return res.json(output);
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  async makePayment(req, res) {
    const { priceId } = req.body;

    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: `${priceId}`,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `http://localhost:5173/order/success`,
        cancel_url: `${YOUR_DOMAIN}?canceled=true`,
      });

      // res.redirect(303, session.url);

      // Had to return the session URL as JSON for the front end to redirect to instead of directly redirecting due to CORS issues
      res.json({ url: session.url });
    } catch (err) {
      res.status(500).json({ error: 'Error creaing checkout session' });
    }
  }

  async getAllPricesFromStripe(req, res) {
    try {
      const prices = await stripe.prices.list();
      const pricesData = prices.data;

      console.log(prices);

      // Update all the products in db with a new column stripe_price_id
      const allProducts = await this.model.findAll();
      const allProductsData = allProducts.map((product) => product.dataValues);
      // console.log(allProductsData);

      return res.send(pricesData);
    } catch (err) {
      console.error(`Error fetching prices: ${err}`);
      throw err;
    }
  }
}

module.exports = ProductsController;
