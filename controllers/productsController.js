const BaseController = require('./baseController');
const Mailjet = require('node-mailjet');
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const YOUR_DOMAIN = 'http://localhost:3000';

// Mailjet Configuration
const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE,
  {
    config: {},
    options: {},
  },
);

class ProductsController extends BaseController {
  constructor(model, ordersModel) {
    super(model);
    this.ordersModel = ordersModel;
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

  async makePaymentMultiple(req, res) {
    const { priceIds, userFirstName, userLastName, userEmail, itemNames } =
      req.body;

    console.log(userFirstName, itemNames);

    if (itemNames) {
      console.log(itemNames);
      var itemList = itemNames.map((item) => `<li>${item}</li>`).join('');
      console.log(`List of items are: ${itemList}`);
    }

    try {
      const session = await stripe.checkout.sessions.create({
        line_items: priceIds.map((priceId) => ({
          price: `${priceId.priceId}`,
          quantity: priceId.quantity,
        })),
        mode: 'payment',
        success_url: `http://localhost:5173/order/success`,
        cancel_url: `${YOUR_DOMAIN}?canceled=true`,
      });

      res.json({ url: session.url });
      console.log('This means we can code after res.json()', session);
    } catch (err) {
      res.status(500).json({ error: 'Error creaing checkout session' });
    }

    console.log('We can still code after checkout!');
    // Sending email to customer
    try {
      const request = mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: {
              Email: 'ianchow9898@gmail.com',
              Name: 'Techie E-Store',
            },
            To: [
              {
                Email: userEmail,
                Name: userFirstName,
              },
            ],
            Subject: 'Thank you for purchasing from Techie E-Store',
            TextPart:
              'Dear Ian, welcome to Techie E-store! May the technological force be with you!',
            HTMLPart: `<h3>Dear ${userFirstName} ${userLastName}, Thank you for purchasing from <a href="https://www.mailjet.com/">Techie E-store</a>!</h3> <p>Here are the items you purchased:</p>
                      <ul>
                       ${itemList}
                      </ul>
                      <p>If you have any questions, concerns, or want to share your thoughts, email support at ianchow9898@gmail.com.</p>
                      <p>May the technological force be with you!</p>`,
          },
        ],
      });

      request
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err.statusCode);
        });
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  async makePayment(req, res) {
    const { priceId, delivery_address } = req.body;

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
      console.log('This means we can code after res.json()', session);

      // Post orders after payment success
      // if (session.success_url === 'http://localhost:5173/order/success') {
      //   console.log('Post order request here!');

      //   // Create order row and order_products row here!
      //   const newOrder = await this.ordersModel.create({
      //     delivery_address: delivery_address,

      //   });
      // }
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

  async sendMailToCustomer(req, res) {
    try {
      const request = mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: {
              Email: 'ianchow9898@gmail.com',
              Name: 'Mailjet Pilot',
            },
            To: [
              {
                Email: 'ianchow989898@gmail.com',
                Name: 'passenger 1',
              },
            ],
            Subject: 'Your email flight plan!',
            TextPart:
              'Dear Ian, welcome to Mailjet! May the delivery force be with you!',
            HTMLPart:
              '<h3>Dear Ian, welcome to <a href="https://www.mailjet.com/">Mailjet</a>!</h3><br />May the delivery force be with you!',
          },
        ],
      });

      request
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err.statusCode);
        });

      return res.json(request);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}

module.exports = ProductsController;
