const express = require('express');
const router = express.Router();

class CategoriesRouter {
  constructor(controller) {
    this.controller = controller;
  }

  routes() {
    router.get('/', this.controller.getAll.bind(this.controller));
    router.get('/:categoryId', this.controller.getOne.bind(this.controller));
    router.post('/', this.controller.postOne.bind(this.controller));
    router.put('/:categoryId', this.controller.updateOne.bind(this.controller));
    router.delete(
      '/:categoryId',
      this.controller.deleteOne.bind(this.controller),
    );
    return router;
  }
}

module.exports = CategoriesRouter;
