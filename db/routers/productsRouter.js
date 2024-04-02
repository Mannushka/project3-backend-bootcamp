const express = require('express');
const router = express.Router();

class ProductsRouter {
  constructor(controller) {
    this.controller = controller;
  }

  routes() {
    router.get('/', this.controller.getAll.bind(this.controller));
    router.get('/:productId', this.controller.getOne.bind(this.controller));
    router.put('/:productId', this.controller.updateOne.bind(this.controller));
    router.post('/', this.controller.postOne.bind(this.controller));
    router.post(
      '/stripe',
      this.controller.createStripeProduct.bind(this.controller),
    );
    router.post(
      '/stripeCreate',
      this.controller.seedStripeProducts.bind(this.controller),
    );

    router.post(
      '/remainingStripeProducts',
      this.controller.seedRemainingStripeProducts.bind(this.controller),
    );

    router.post(
      '/create-checkout-session',
      this.controller.makePayment.bind(this.controller),
    );

    router.post(
      '/get-stripe-prices',
      this.controller.getAllPricesFromStripe.bind(this.controller),
    );

    router.post(
      '/seed-all-stripe-ids',
      this.controller.seedStripeIdsIntoAllProducts.bind(this.controller),
    );

    return router;
  }
}

module.exports = ProductsRouter;
