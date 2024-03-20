const BaseController = require('./baseController');

class OrdersController extends BaseController {
  constructor(model, userModel, productModel) {
    super(model);
    this.userModel = userModel;
    this.productModel = productModel;
  }

  // Post a new order based on the shopping cart to the orders table
  /**
   * Once the user is finished shopping and wants to checkout, we get the data in the cart object in the frontend to do a POST request to the database for the orders table 
     as well as the order_products table for the product_ids as well as the quantity of products ordered.
   * NO NEED TO POST ANY PRODUCT DETAILS LIKE PRICE, TITLE, DESCRIPTION ETC 
     SINCE THE PRODUCT_ID IN THE ORDERS_PRODUCTS TABLE ALREADY REFERENCES ALL THIS INFORMATION
   */

  async postOne(req, res) {
    const { delivery_address } = req.body;

    const { productId, stock_purchased } = req.body;

    try {
      // Change this to logged-in user once Auth0 is established
      const user_id = 1;

      const productBought = await this.productModel.findByPk(productId);

      console.log(productBought);

      const newOrder = await this.model.create({
        delivery_address: delivery_address,
        user_id: user_id,
      });

      console.log('newOrder');
      console.log(newOrder);

      // Set order_products junction table rows here
      await newOrder.setProducts(productId);

      return res.send(newOrder);
    } catch (err) {
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
