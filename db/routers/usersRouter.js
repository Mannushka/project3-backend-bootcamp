const express = require('express');
const router = express.Router();

class UsersRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.get('/', this.controller.getAll.bind(this.controller));
    router.put('/', this.controller.getUserBasedOnEmail.bind(this.controller));

    router.post('/', this.controller.postNewUser.bind(this.controller));
    router.put('/:userId', this.controller.updateUser.bind(this.controller));
    router.get(
      '/stripe-customer',
      this.controller.getStripeCustomerDetails.bind(this.controller),
    );
    return router;
  }
}

module.exports = UsersRouter;
