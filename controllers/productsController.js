const BaseController = require('./baseController');
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const YOUR_DOMAIN = 'http://localhost:3000';

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

  async seedStripeIdsIntoAllProducts(req, res) {
    // Priceids are out of order. DO NOT SEED UNTIL IT IS ORGANISED! REMEMBER THAT ID: 1 is somewhere in the middle of output!
    const priceIds = [
      'price_1OyRMcCe2bVtqVUUOyhTG0l0',
      'price_1OyRM8Ce2bVtqVUUKsqiHOpR',
      'price_1OyRJQCe2bVtqVUUGVRG791B',
      'price_1OyRJ5Ce2bVtqVUUMk79xSnA',
      'price_1OyRIiCe2bVtqVUUcczlnGf5',
      'price_1OyRIRCe2bVtqVUU77Ido4Ac',
      'price_1OyRI5Ce2bVtqVUUPeZY68jl',
      'price_1OyRByCe2bVtqVUUcIgjucVt',
      'price_1OyRB8Ce2bVtqVUU3auJ56ve',
      'price_1OyRAVCe2bVtqVUUKQ4SE0OT',
      'price_1OyRA4Ce2bVtqVUUzzESOhSs',
      'price_1OyR9oCe2bVtqVUUdciEKd2x',
      'price_1OyR9XCe2bVtqVUUOqM8o1ND',
      'price_1OyR9HCe2bVtqVUU0PYKdaQi',
      'price_1OyR8vCe2bVtqVUUNVK1L4VQ',
      'price_1OyR8gCe2bVtqVUUKy5eNKog',
      'price_1OyR8QCe2bVtqVUUgPkkKJk8',
      'price_1OyR7yCe2bVtqVUUEE0W130j',
      'price_1OyR5cCe2bVtqVUU55qo1Lig',
      'price_1OyR5FCe2bVtqVUU6V2MTz9y',
      'price_1OyR2VCe2bVtqVUUjucQXMJV',
      'price_1OyR28Ce2bVtqVUUGj5M0upu',
      'price_1OyQnICe2bVtqVUURNgeoZPs',
      'price_1OyHThCe2bVtqVUUwO4b89vb',
      'price_1OyHThCe2bVtqVUUbi2eVzKJ',
      'price_1OyHThCe2bVtqVUUuUch4O2I',
      'price_1OyHThCe2bVtqVUUA9BDZblq',
      'price_1OyFtTCe2bVtqVUUWXCwBaBo',
      'price_1OyFtTCe2bVtqVUUvpaqx3UT',
      'price_1OyFtTCe2bVtqVUUs4HXpNpU',
      'price_1OyFtTCe2bVtqVUUm0qJ43ym',
      'price_1OyFtTCe2bVtqVUUkib369iz',
    ];
    console.log(priceIds.length);
    try {
      const output = await this.model.findAll();

      const allProducts = output.map((product) => product.dataValues);
      console.log(allProducts.length);
      return res.json(output);
    } catch (err) {
      return res.status(400).send(err);
    }
  }
}

function updatePriceIds(productsArray, priceIdsArray) {
  // Check if both arrays have the same length
  if (productsArray.length !== priceIdsArray.length) {
    throw new Error('Arrays must have the same length.');
  }

  // Loop through each product and update its priceId
  for (let i = 0; i < productsArray.length; i++) {
    productsArray[i].stripe_id = priceIdsArray[i];
  }

  // // Assuming productsArray is an array of sequelize model instances, you can update them in bulk
  // await Promise.all(productsArray.map((product) => product.save()));

  return productsArray;
}

const priceIds = [
  'price_1OyRByCe2bVtqVUUcIgjucVt',
  'price_1OyRM8Ce2bVtqVUUKsqiHOpR',
  'price_1OyRJQCe2bVtqVUUGVRG791B',
  'price_1OyRJ5Ce2bVtqVUUMk79xSnA',
  'price_1OyRIiCe2bVtqVUUcczlnGf5',
  'price_1OyRIRCe2bVtqVUU77Ido4Ac',
  'price_1OyRI5Ce2bVtqVUUPeZY68jl',
  'price_1OyRByCe2bVtqVUUcIgjucVt',
  'price_1OyRB8Ce2bVtqVUU3auJ56ve',
  'price_1OyRAVCe2bVtqVUUKQ4SE0OT',
  'price_1OyRA4Ce2bVtqVUUzzESOhSs',
  'price_1OyR9oCe2bVtqVUUdciEKd2x',
  'price_1OyR9XCe2bVtqVUUOqM8o1ND',
  'price_1OyR9HCe2bVtqVUU0PYKdaQi',
  'price_1OyR8vCe2bVtqVUUNVK1L4VQ',
  'price_1OyR8gCe2bVtqVUUKy5eNKog',
  'price_1OyR8QCe2bVtqVUUgPkkKJk8',
  'price_1OyR7yCe2bVtqVUUEE0W130j',
  'price_1OyR5cCe2bVtqVUU55qo1Lig',
  'price_1OyR5FCe2bVtqVUU6V2MTz9y',
  'price_1OyR2VCe2bVtqVUUjucQXMJV',
  'price_1OyR28Ce2bVtqVUUGj5M0upu',
  'price_1OyQnICe2bVtqVUURNgeoZPs',
  'price_1OyHThCe2bVtqVUUwO4b89vb',
  'price_1OyHThCe2bVtqVUUbi2eVzKJ',
  'price_1OyHThCe2bVtqVUUuUch4O2I',
  'price_1OyHThCe2bVtqVUUA9BDZblq',
  'price_1OyFtTCe2bVtqVUUWXCwBaBo',
  'price_1OyFtTCe2bVtqVUUvpaqx3UT',
  'price_1OyFtTCe2bVtqVUUs4HXpNpU',
  'price_1OyFtTCe2bVtqVUUm0qJ43ym',
  'price_1OyFtTCe2bVtqVUUkib369iz',
];

// const updatedProducts = updatePriceIds(
//   [
//     {
//       id: 2,
//       title: 'Gaming Beast X2000',
//       price: '2499',
//       description: 'Unleash your gaming potential with the Gaming Beast X2000.',
//       stock_left: '30',
//       img: 'https://m.media-amazon.com/images/I/71s1LRpaprL._AC_UF894,1000_QL80_.jpg',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 2,
//     },
//     {
//       id: 3,
//       title: 'ZenBook Infinity Pro',
//       price: '1799',
//       description: 'Unlock your creativity with the ZenBook Infinity Pro.',
//       stock_left: '35',
//       img: 'https://m.media-amazon.com/images/I/71qKfFqgEiL._AC_UF894,1000_QL80_.jpg',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 2,
//     },
//     {
//       id: 4,
//       title: 'EliteBook Fusion 500',
//       price: '1599',
//       description: 'Stay ahead in business with the EliteBook Fusion 500.',
//       stock_left: '25',
//       img: 'https://static-ecpa.acer.com/media/catalog/product/n/i/nitro5_an515-57_bl_bk_modelmain_5.png?optimize=high&bg-color=255,255,255&fit=bounds&height=500&width=500&canvas=500:500&format=jpeg',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 2,
//     },
//     {
//       id: 5,
//       title: 'ThinkPad Flex 9X',
//       price: '1899',
//       description: 'Adapt to any situation with the ThinkPad Flex 9X.',
//       stock_left: '20',
//       img: 'https://p4-ofp.static.pub/ShareResource/na/subseries/gallery/lenovo-ideapad-5i-gaming-chromebook-gen7-16inch-02.png',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 2,
//     },
//     {
//       id: 6,
//       title: 'Surface Pro X',
//       price: '2099',
//       description:
//         'Experience versatility like never before with the Surface Pro X.',
//       stock_left: '15',
//       img: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/g-series/g16-7630/media-gallery/black/notebook-g16-7630-nt-black-gallery-1.psd?fmt=pjpg&pscan=auto&scl=1&wid=3500&hei=2625&qlt=100,1&resMode=sharp2&size=3500,2625&chrss=full&imwidth=5000',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 2,
//     },
//     {
//       id: 7,
//       title: 'SwiftBook Pro 2025',
//       price: '1699',
//       description: 'Speed up your productivity with the SwiftBook Pro 2025.',
//       stock_left: '18',
//       img: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/latitude-notebooks/latitude-15-5540-laptop/media-gallery/notebook-latitude-15-5540-nt-rgb-silver-gallery-1.psd?fmt=pjpg&pscan=auto&scl=1&wid=4565&hei=2814&qlt=100,1&resMode=sharp2&size=4565,2814&chrss=full&imwidth=5000',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 2,
//     },
//     {
//       id: 8,
//       title: 'ChromeBook Plus X3',
//       price: '1199',
//       description: 'Simplify your life with the ChromeBook Plus X3.',
//       stock_left: '22',
//       img: 'https://www.apple.com/newsroom/images/tile-images/Apple_16-inch-MacBook-Pro_111319.jpg.og.jpg?202402240715',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 2,
//     },
//     {
//       id: 9,
//       title: 'Galaxy S22 Ultra',
//       price: '1299',
//       description:
//         'Experience the ultimate smartphone with the Galaxy S22 Ultra.',
//       stock_left: '50',
//       img: 'https://image-us.samsung.com/SamsungUS/home/mobile/phones/pdp/galazy-a/galaxy-a03s/gallery/blue/Galaxy-A03s-blue-1.jpg?$product-details-jpg$',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 3,
//     },
//     {
//       id: 10,
//       title: 'iPhone 14 Pro',
//       price: '1399',
//       description: 'Discover the power of innovation with the iPhone 14 Pro.',
//       stock_left: '45',
//       img: 'https://cdn.alloallo.media/catalog/product/apple/iphone/iphone-13/iphone-13-pink.jpg',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 3,
//     },
//     {
//       id: 11,
//       title: 'Pixel 7',
//       price: '999',
//       description: 'Get ready for the future with the Pixel 7.',
//       stock_left: '60',
//       img: 'https://m.media-amazon.com/images/I/713N4SwTtKL._AC_UF894,1000_QL80_.jpg',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 3,
//     },
//     {
//       id: 12,
//       title: 'OnePlus 10 Pro',
//       price: '1099',
//       description: 'Experience speed and elegance with the OnePlus 10 Pro.',
//       stock_left: '55',
//       img: 'https://m.media-amazon.com/images/I/51qnMfIlsCL.jpg',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 3,
//     },
//     {
//       id: 13,
//       title: 'Xperia 1 IV',
//       price: '1199',
//       description: 'Unleash your creativity with the Xperia 1 IV.',
//       stock_left: '40',
//       img: 'https://sony.scene7.com/is/image/sonyglobalsolutions/PDX-223_black_v01-1?$categorypdpnav$&fmt=png-alpha',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 3,
//     },
//     {
//       id: 14,
//       title: 'Redmi Note 11 Pro',
//       price: '799',
//       description: 'Elevate your mobile experience with the Redmi Note 11 Pro.',
//       stock_left: '65',
//       img: 'https://m.media-amazon.com/images/I/61dcWgQnk3L.jpg',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 3,
//     },
//     {
//       id: 15,
//       title: 'Galaxy A53 5G',
//       price: '599',
//       description:
//         'Enjoy fast connectivity and great features with the Galaxy A53 5G.',
//       stock_left: '70',
//       img: 'https://www.zdnet.com/a/img/resize/37520f97f54a8559c3ccb8616db7dae30ea3807f/2023/01/04/6b12b43b-3cb9-4579-840a-a68cc85c643b/samsung-galaxy-a15-ag.jpg?auto=webp&width=1280',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 3,
//     },
//     {
//       id: 16,
//       title: 'Mi 12',
//       price: '999',
//       description: 'Discover the future of smartphones with the Mi 12.',
//       stock_left: '50',
//       img: 'https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1598463305.19882560!400x400!85.png',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 3,
//     },
//     {
//       id: 17,
//       title: 'Wireless Earbuds Pro',
//       price: '199',
//       description:
//         'Experience premium sound quality with the Wireless Earbuds Pro.',
//       stock_left: '100',
//       img: 'https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/MQLH3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1682361480584',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 4,
//     },
//     {
//       id: 18,
//       title: 'Smartwatch X3',
//       price: '299',
//       description: 'Stay connected and organized with the Smartwatch X3.',
//       stock_left: '80',
//       img: 'https://m.media-amazon.com/images/I/71VSFdowcuL.jpg',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 4,
//     },
//     {
//       id: 19,
//       title: 'Wireless Charging Pad',
//       price: '49',
//       description:
//         'Simplify your charging experience with the Wireless Charging Pad.',
//       stock_left: '120',
//       img: 'https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/HR302?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1695069091086',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 4,
//     },
//     {
//       id: 20,
//       title: 'Laptop Stand',
//       price: '39',
//       description: 'Improve your workspace ergonomics with the Laptop Stand.',
//       stock_left: '150',
//       img: 'https://m.media-amazon.com/images/I/51KPdFrp4WL.jpg',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 4,
//     },
//     {
//       id: 21,
//       title: 'Bluetooth Keyboard',
//       price: '79',
//       description: 'Enhance your productivity with the Bluetooth Keyboard.',
//       stock_left: '90',
//       img: 'https://resource.logitech.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/keyboards/multi-keyboard-k380/gallery/k380-lavender-gallery-1-us.png?v=1',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 4,
//     },
//     {
//       id: 22,
//       title: 'Portable Power Bank',
//       price: '29',
//       description: 'Stay charged wherever you go with the Portable Power Bank.',
//       stock_left: '200',
//       img: 'https://luckystore.com.sg/wp-content/uploads/2022/04/ORABEL-ORP-10-6.jpg',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 4,
//     },
//     {
//       id: 23,
//       title: 'Camera Lens Kit',
//       price: '149',
//       description: 'Capture stunning photos with the Camera Lens Kit.',
//       stock_left: '70',
//       img: 'https://improvephotography.com/wp-content/uploads/2011/10/AF-S_NIKKOR_28-300mm_f3.5-5.6G_ED_VR.jpg',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 4,
//     },
//     {
//       id: 24,
//       title: 'Wireless Mouse',
//       price: '49',
//       description: 'Upgrade your computing experience with the Wireless Mouse.',
//       stock_left: '110',
//       img: 'https://img.ws.mms.shopee.sg/ff053fb4aba3183a584a6dd8ca23552f',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 4,
//     },
//     {
//       id: 25,
//       title: 'iPad Pro 2023',
//       price: '799',
//       description: 'Experience the power of the iPad Pro 2023.',
//       stock_left: '80',
//       img: 'https://changiairport.scene7.com/is/image/changiairport/mp00176080-1-apple-1666691387743-apple-ipad-pro-12-9--6th-gen--wi-fi---cellular-128gb-silver?$2x$',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 5,
//     },
//     {
//       id: 26,
//       title: 'Galaxy Tab S8 Ultra',
//       price: '999',
//       description:
//         'Immerse yourself in entertainment with the Galaxy Tab S8 Ultra.',
//       stock_left: '70',
//       img: 'https://images.samsung.com/is/image/samsung/p6pim/sg/sm-x906bzajxsp/gallery/sg-galaxy-tab-s8-ultra-5g-x906-sm-x906bzajxsp-534194325?$650_519_PNG$',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 5,
//     },
//     {
//       id: 1,
//       title: 'UltraBook Pro X1',
//       price: '1999',
//       description:
//         'Experience unparalleled performance with the UltraBook Pro X1.',
//       stock_left: '40',
//       img: 'https://m.media-amazon.com/images/I/71sgAr9atBS._AC_UF894,1000_QL80_.jpg',
//       stripe_id: 'price_1OyRM8Ce2bVtqVUUKsqiHOpR',
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 2,
//     },
//     {
//       id: 27,
//       title: 'Surface Pro 10',
//       price: '1299',
//       description: 'Unleash your creativity with the Surface Pro 10.',
//       stock_left: '60',
//       img: 'https://m.media-amazon.com/images/I/71zBExi4RTL._AC_UF894,1000_QL80_.jpg',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 5,
//     },
//     {
//       id: 28,
//       title: 'Fire HD 12',
//       price: '299',
//       description: 'Enjoy entertainment on the go with the Fire HD 12.',
//       stock_left: '100',
//       img: 'https://wmart.com.sg//image/cache/catalog/Wmart%20Live/Product/Amazon/Fire%20HD%2010%202021/website-black-512x299.jpg',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 5,
//     },
//     {
//       id: 29,
//       title: 'Xperia Tab 5',
//       price: '499',
//       description:
//         'Experience entertainment like never before with the Xperia Tab 5.',
//       stock_left: '90',
//       img: 'https://akm-img-a-in.tosshub.com/businesstoday/images/story/201307/sony-xperia-z-tablet_505_071613125233.jpg?size=948:533',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 5,
//     },
//     {
//       id: 30,
//       title: 'Lenovo Tab P12 Pro',
//       price: '699',
//       description:
//         'Stay productive and entertained with the Lenovo Tab P12 Pro.',
//       stock_left: '50',
//       img: 'https://m.media-amazon.com/images/I/61Yj0rzrpeL._AC_UF894,1000_QL80_.jpg',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 5,
//     },
//     {
//       id: 31,
//       title: 'Huawei MatePad Pro 2022',
//       price: '899',
//       description: 'Unlock your creativity with the Huawei MatePad Pro 2022.',
//       stock_left: '45',
//       img: 'https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/tablets/matepad-pro-13-2/img/hero/en-kv/huawei-matepad-pro-13-2-kv.jpg',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 5,
//     },
//     {
//       id: 32,
//       title: 'Google Pixel Slate 2',
//       price: '799',
//       description: 'Experience the best of Google with the Pixel Slate 2.',
//       stock_left: '55',
//       img: 'https://m.media-amazon.com/images/I/71k+KbTBn5L._AC_UF894,1000_QL80_.jpg',
//       stripe_id: null,
//       createdAt: '2024-03-25T13:38:45.456Z',
//       updatedAt: '2024-03-25T13:38:45.456Z',
//       categoryId: 5,
//     },
//   ],
//   priceIds,
// );

// console.log(updatedProducts);

module.exports = ProductsController;
