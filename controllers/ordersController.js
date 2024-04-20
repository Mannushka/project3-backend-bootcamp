const BaseController = require('./baseController');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  `postgres://${process.env.DB_USERNAME}:@${process.env.DB_HOST}:5432/${process.env.DB_NAME}`,
);

class OrdersController extends BaseController {
  constructor(model, userModel, productModel, orderProductModel, addressModel) {
    super(model);
    this.userModel = userModel;
    this.productModel = productModel;
    this.orderProductModel = orderProductModel;
    this.addressModel = addressModel;
  }

  async getAllOrdersOfCurrUser(req, res) {
    const { email } = req.query;
    try {
      const user = await this.userModel.findOrCreate({
        where: { email: email },
      });
      const user_id = user[0].dataValues.id;
      const orders = await this.model.findAll({
        where: { user_id: user_id },
        include: [
          {
            model: this.productModel,
            attributes: ['id', 'title', 'price', 'img'],
            through: {
              model: this.orderProductModel,
              attributes: ['quantity'],
            },
          },
          { model: this.addressModel, attributes: ['address'] },
        ],
      });
      return res.json(orders);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err.message });
    }
  }

  async postOne(req, res) {
    const { address_id, user_id, total_price, products } = req.body;

    if (!products || products.length === 0) {
      return res
        .status(400)
        .json({ error: true, msg: 'No products in the order' });
    }

    try {
      await sequelize.transaction(async (t) => {
        const newOrder = await this.model.create(
          {
            address_id: address_id,
            user_id: user_id,
            total_price: total_price,
          },
          { transaction: t },
        );

        const arrayOfJunctionTableEntries = [];
        for (let i = 0; i < products.length; i++) {
          const productObj = products[i];
          const [id, quantity] = Object.entries(productObj)[0];
          const newEntryInOrderProducts = await this.orderProductModel.create(
            {
              order_id: newOrder.dataValues.id,
              product_id: id,
              quantity: quantity,
            },
            { transaction: t },
          );
          arrayOfJunctionTableEntries.push(newEntryInOrderProducts);
        }

        const purchasedProducts = [];

        for (let i = 0; i < products.length; i++) {
          const productObj = products[i];
          const [id, quantity] = Object.entries(productObj)[0];

          const product = await this.productModel.findByPk(id);

          const stock = product.dataValues.stock_left;

          const stock_left = stock - quantity;

          const updatedProduct = await product.update(
            { stock_left: stock_left },
            { transaction: t },
          );

          purchasedProducts.push(updatedProduct);
        }

        return res.send([
          newOrder,
          arrayOfJunctionTableEntries,
          purchasedProducts,
        ]);
      });
    } catch (err) {
      console.error(err.message);
      return res.status(400).json({ error: true, msg: err });
    }
  }

  async getOne(req, res) {
    const { orderId } = req.params;

    const order = await this.model.findByPk(orderId, {
      include: [
        {
          association: 'products',
        },
        { model: this.addressModel, attributes: ['address'] },
      ],
    });

    return res.send(order);
  }

  async deleteOne(req, res) {
    const { orderId } = req.params;

    try {
      const orderToBeDeleted = await this.model.destroy({
        where: {
          id: orderId,
        },
      });

      console.log(orderToBeDeleted);

      res.status(200).send('Success:');
    } catch (error) {
      console.error(error);
      res.status(400).send({ error: true, msg: error });
    }
  }
}

module.exports = OrdersController;
