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

  // Post a new product for sellers
  async postOne(req, res) {
    const {
      title,
      price,
      description,
      shipping_details,
      stock_left,
      model_url,
      img,
      categoryId,
    } = req.body;

    try {
      // Create new product
      const newProduct = await this.model.create({
        title: title,
        price: price,
        description: description,
        shipping_details: shipping_details,
        stock_left: stock_left,
        model_url: model_url,
        img: img,
        categoryId: categoryId,
      });

      res.send(newProduct);
    } catch (err) {
      return res.status(400).send(err);
    }
  }
}

module.exports = ProductsController;
