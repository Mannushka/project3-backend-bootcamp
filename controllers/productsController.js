const BaseController = require('./baseController');

class ProductsController extends BaseController {
  constructor(model) {
    super(model);
  }

  // Retrieve specific product
  async getOne(req, res) {
    const { productId } = req.params;

    try {
      const product = await this.model.findByPk(productId, {
        include: {
          association: 'orders',
        },
      });

      return res.json(product);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Update the specific product to reduce stock by number of quantity
  async updateOne(req, res) {
    const { productId } = req.params;

    const { stock_purchased } = req.body;

    const productToBeBought = await this.model.findByPk(productId);

    const { title, price, description } = productToBeBought.dataValues;

    // purchasedProduct TO BE INSERTED INTO CART
    const purchasedProduct = {
      title: title,
      price: price,
      description: description,
      stock_purchased: stock_purchased,
    };

    const stock_left = productToBeBought.dataValues.stock_left;

    console.log(productToBeBought.dataValues.stock_left);

    await productToBeBought.update({
      stock_left: stock_left - stock_purchased,
    });

    res.send(purchasedProduct);
  }

  // async purchaseOne(req, res) {
  //   const { productId } = req.params;

  //   const productToBeBought = await this.model.findByPk(productId);

  //   const {title, price, description}

  //   const purchasedProduct = {
  //     title: productToBeBought.dataValues
  //   }
  // }
}

module.exports = ProductsController;
