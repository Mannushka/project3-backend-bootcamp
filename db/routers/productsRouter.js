const express = require("express");
const router = express.Router();

class ProductsRouter {
  constructor(controller, checkJwt) {
    this.controller = controller;
    this.checkJwt = checkJwt;
  }

  routes() {
    router.get("/", this.controller.getAll.bind(this.controller));
    router.get(
      "/:productId",
      this.checkJwt,
      this.controller.getOne.bind(this.controller)
    );
    router.put("/:productId", this.controller.updateOne.bind(this.controller));
    router.post("/", this.controller.postOne.bind(this.controller));
    router.post(
      "/stripe",
      this.controller.createStripeProduct.bind(this.controller)
    );
    router.post(
      "/stripeCreate",
      this.controller.seedStripeProducts.bind(this.controller)
    );

    router.post(
      "/remainingStripeProducts",
      this.controller.seedRemainingStripeProducts.bind(this.controller)
    );

    router.post(
      "/create-checkout-session-external",
      this.controller.makePaymentMultiple.bind(this.controller)
    );

    // router.post(
    //   '/create-checkout-session',
    //   this.controller.makePaymentEmbedded.bind(this.controller),
    // );

    router.post(
      "/get-stripe-prices",
      this.controller.getAllPricesFromStripe.bind(this.controller)
    );

    router.post(
      "/send-email-success",
      this.controller.sendMailToCustomer.bind(this.controller)
    );

    return router;
  }
}

module.exports = ProductsRouter;
