const BaseController = require('./baseController');

class ProductsController extends BaseController {
  constructor(model) {
    super(model);
  }

  // Retrieve specific product
  async getOne(req, res) {
    const { productId } = req.params;

    try {
      const product = await this.model.findByPk(productId);

      return res.json(product);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}

module.exports = ProductsController;
