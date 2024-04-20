const BaseController = require('./baseController');
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

class UsersController extends BaseController {
  constructor(model) {
    super(model);
  }

  async getUserBasedOnEmail(req, res) {
    const { email } = req.body;

    try {
      const targetUser = await this.model.findOne({
        where: { email: email },
      });

      return res.json(targetUser);
    } catch (err) {
      console.log(err.message);
      return res.status(400).json({ error: true, msg: err.message });
    }
  }

  async postNewUser(req, res) {
    const { first_name, last_name, email } = req.body;
    try {
      const newUser = await this.model.create({
        first_name,
        last_name,
        email,
      });
      return res.json(newUser);
    } catch (err) {
      console.log(err.message);
      return res.status(400).json({ error: true, msg: err.message });
    }
  }

  async updateUser(req, res) {
    const { userId } = req.params;
    const { first_name, last_name, phone_number, email } = req.body;
    try {
      const userToBeUpdated = await this.model.findByPk(userId);

      const updatedUser = await userToBeUpdated.update({
        first_name,
        last_name,
        phone_number,
        email,
      });

      res.send(updatedUser);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err.message });
    }
  }

  // Not working
  async getStripeCustomerDetails(req, res) {
    try {
      const session = await stripe.checkout.sessions.retrieve(
        req.query.session_id,
      );

      const customer = await stripe.customers.retrieve(session.customer);

      res.send(customer);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err.message });
    }
  }

  async deleteOne(req, res) {
    const { userId } = req.params;

    try {
      await this.model.destroy({
        where: {
          id: userId,
        },
      });

      res.status(200).send(`Successfully deleted user at user id: ${userId}`);
    } catch (error) {
      console.error(error);
      res.status(400).send({ error: true, msg: error });
    }
  }
}
module.exports = UsersController;
