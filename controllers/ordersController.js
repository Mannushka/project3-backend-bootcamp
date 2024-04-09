const BaseController = require('./baseController');

class OrdersController extends BaseController {
  constructor(model, userModel, productModel, orderProductModel) {
    super(model);
    this.userModel = userModel;
    this.productModel = productModel;
    this.orderProductModel = orderProductModel;
  }

  // Post a new order based on the shopping cart to the orders table
  /**
   * Once the user is finished shopping and wants to checkout, we get the data in the cart object in the frontend to do a POST request to the database for the orders table 
     as well as the order_products table for the product_ids as well as the quantity of products ordered.
   * NO NEED TO POST ANY PRODUCT DETAILS LIKE PRICE, TITLE, DESCRIPTION ETC 
     SINCE THE PRODUCT_ID IN THE ORDERS_PRODUCTS TABLE ALREADY REFERENCES ALL THIS INFORMATION
   */

  async postOne(req, res) {
    const { address_id, user_id, total_price, productId, quantity } = req.body;

    try {
      // const productBought = await this.productModel.findByPk(productId, {
      //   include: {
      //     association: 'orders',
      //   },
      // });

      const productBought = await this.productModel.findByPk(productId);

      console.log(productBought);

      const newOrder = await this.model.create({
        address_id: address_id,
        user_id: user_id,
        total_price: total_price,
      });

      console.log('newOrder');
      console.log(newOrder.dataValues);
      console.log('currentProduct');
      console.log(productBought);

      console.log('Current order id is', newOrder.dataValues.id);
      console.log(productId);

      // Insert a new row in the junction table, order_products

      const newEntryInOrderProducts = await this.orderProductModel.create({
        order_id: newOrder.dataValues.id,
        product_id: productId,
        quantity: quantity,
      });

      // const result = await this.model.findOne({
      //   where: { delivery_address: delivery_address },
      //   include: this.productModel,
      // });

      // console.log(result);

      return res.send([newOrder, newEntryInOrderProducts]);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: true, msg: err });
    }
  }

  async getOne(req, res) {
    const { orderId } = req.params;

    const order = await this.model.findByPk(orderId, {
      include: {
        association: 'products',
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
          association: 'products',
        },
      });

      orderAssociationToBeDeleted.setProducts([]);

      // await orderToBeDeleted.destroy();

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

      res.status(200).send('Success');
    } catch (error) {
      console.error(error);
      res.status(400).send({ error: true, msg: error });
    }
  }
}

module.exports = OrdersController;
