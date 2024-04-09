const express = require('express');
const router = express.Router();

class AddressesRouter {
  constructor(controller) {
    this.controller = controller;
  }

  routes() {
    router.get('/', this.controller.getAllAddresses.bind(this.controller));
    router.post('/', this.controller.postNewAddress.bind(this.controller));
    router.get(
      '/get-address-id',
      this.controller.getAddressIdBasedOnActualAddress.bind(this.controller),
    );
    router.get('/:addressId', this.controller.getAddress.bind(this.controller));
    return router;
  }
}

module.exports = AddressesRouter;
