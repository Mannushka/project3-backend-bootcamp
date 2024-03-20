const express = require('express');
const router = express.Router();

class OrdersRouter {
  constructor(controller) {
    this.controller = controller;
  }

  routes() {
    router.get('/:orderId', this.controller.getOne.bind(this.controller));
    router.post('/', this.controller.postOne.bind(this.controller));
    router.delete('/:orderId', this.controller.deleteOne.bind(this.controller));
    router.delete(
      '/association/:orderId',
      this.controller.deleteAssociation.bind(this.controller),
    );

    return router;
  }
}

module.exports = OrdersRouter;
