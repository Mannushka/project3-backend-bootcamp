const express = require("express");
const router = express.Router();

class UsersRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.post("/", this.controller.postNewUser.bind(this.controller));
    router.put("/:userId", this.controller.updateUser.bind(this.controller));
    return router;
  }
}

module.exports = UsersRouter;
