const BaseController = require("./baseController");

class OrdersController extends BaseController {
  constructor(model, userModel, productModel, orderProductModel) {
    super(model);
    this.userModel = userModel;
    this.productModel = productModel;
    this.orderProductModel = orderProductModel;
  }

  async getAllOrdersOfCurrUser(req, res) {
    const { user_id } = req.query;
    try {
      const orders = await this.model.findAll({ where: { user_id: user_id } });
      return res.json(orders);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err.message });
    }
  }

  async postOne(req, res) {
    // productId is an array of ids
    const { address_id, user_id, total_price, productId, quantity } = req.body;

    try {
      const newOrder = await this.model.create({
        address_id: address_id,
        user_id: user_id,
        total_price: total_price,
      });

      console.log("newOrder");
      console.log(newOrder.dataValues);
      console.log("currentProduct");

      console.log("Current order id is", newOrder.dataValues.id);
      console.log(productId);

      // Insert a new row in the junction table, order_products
      const arrayOfJunctionTableEntries = [];

      for (let i = 0; i < productId.length; i++) {
        const newEntryInOrderProducts = await this.orderProductModel.create({
          order_id: newOrder.dataValues.id,
          product_id: productId[i],
          quantity: quantity,
        });
        arrayOfJunctionTableEntries.push(newEntryInOrderProducts);
      }

      return res.send([newOrder, arrayOfJunctionTableEntries]);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: true, msg: err });
    }
  }

  async getOne(req, res) {
    const { orderId } = req.params;

    const order = await this.model.findByPk(orderId, {
      include: {
        association: "products",
      },
    });

    return res.send(order);
  }

  // Had to send the delete request twice to delete an order so ended up creating two delete functions, deleteAssociation and deleteOne
  async deleteAssociation(req, res) {
    const { orderId } = req.params;

    try {
      const orderAssociationToBeDeleted = await this.model.findByPk(orderId, {
        include: {
          association: "products",
        },
      });

      orderAssociationToBeDeleted.setProducts([]);

      return res.send(orderAssociationToBeDeleted);
    } catch (error) {
      console.error(error);
      res.status(400).send({ error: true, msg: error });
    }
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

      res.status(200).send("Success");
    } catch (error) {
      console.error(error);
      res.status(400).send({ error: true, msg: error });
    }
  }
}

module.exports = OrdersController;
