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

    return router;
  }
}

module.exports = ProductsRouter;
