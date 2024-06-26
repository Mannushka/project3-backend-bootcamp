const express = require('express');
const router = express.Router();

class OrdersRouter {
  constructor(controller) {
    this.controller = controller;
  }

  routes() {
    router.get('/:orderId', this.controller.getOne.bind(this.controller));
    router.get(
      '/',
      this.controller.getAllOrdersOfCurrUser.bind(this.controller),
    );
    router.post('/', this.controller.postOne.bind(this.controller));
    router.delete('/:orderId', this.controller.deleteOne.bind(this.controller));

    return router;
  }
}

module.exports = OrdersRouter;
