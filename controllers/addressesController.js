const BaseController = require('./baseController');
const { QueryTypes } = require('sequelize'); // Import DataTypes and QueryTypes

class AddressesController extends BaseController {
  constructor(model, userModel) {
    super(model);
    this.userModel = userModel;
  }

  async getAllAddresses(req, res) {
    try {
      const address = await this.model.sequelize.query(
        `SELECT "id", "buyer_id", "address", "created_at" AS "createdAt", "updated_at" AS "updatedAt", "buyer_id" AS "user_id" FROM "addresses"`,
        {
          type: this.model.sequelize.QueryTypes.SELECT,
        },
      );

      return res.json(address); // Assuming you expect only one address
    } catch (err) {
      console.error(err);
      return res.status(400).send(err);
    }
  }

  // Get a single address
  async getAddress(req, res) {
    const { addressId } = req.params;
    try {
      const address = await this.model.sequelize.query(
        `SELECT "id", "buyer_id", "address", "created_at" AS "createdAt", "updated_at" AS "updatedAt", "buyer_id" AS "user_id" FROM "addresses" WHERE "id" = :addressId`,
        {
          replacements: { addressId },
          type: this.model.sequelize.QueryTypes.SELECT,
        },
      );
      return res.json(address[0]); // Assuming you expect only one address
    } catch (err) {
      console.error(err);
      return res.status(400).send(err);
    }
  }

  async getAddressIdBasedOnActualAddress(req, res) {
    const { delivery_address } = req.query;

    try {
      const address = await this.model.findOne({
        where: {
          address: delivery_address,
        },
      });

      return res.status(200).json(address.id);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: true, msg: err });
    }
  }

  async postNewAddress(req, res) {
    const { email, address } = req.body;

    const allAddresses = await this.model.sequelize.query(
      `SELECT "id", "buyer_id", "address", "created_at" AS "createdAt", "updated_at" AS "updatedAt", "buyer_id" AS "user_id" FROM "addresses"`,
      {
        type: this.model.sequelize.QueryTypes.SELECT,
      },
    );

    const arrayOfAddresses = allAddresses.map(
      (singleAddress) => singleAddress.address,
    );

    if (!arrayOfAddresses.includes(address)) {
      try {
        const [buyer] = await this.userModel.findOrCreate({
          where: { email: email },
        });

        const queryResult = await this.model.sequelize.query(
          'INSERT INTO "addresses" ("buyer_id", "address", "created_at", "updated_at") VALUES ($1, $2, $3, $4) RETURNING "id", "buyer_id", "address", "created_at", "updated_at"',
          {
            bind: [buyer.id, address, new Date(), new Date()],
            type: QueryTypes.INSERT,
          },
        );

        const newAddress = queryResult[0];

        return res.json(newAddress);
      } catch (err) {
        console.error(err);
        return res.status(400).json({ error: true, msg: err.message });
      }
    } else {
      return res.send('Address already exists!');
    }
  }

  async deleteOne(req, res) {
    const { addressId } = req.params;

    try {
      await this.model.destroy({
        where: {
          id: addressId,
        },
      });

      res.status(200).send(`Successfully deleted address at id ${addressId}`);
    } catch (error) {
      console.error(error);
      res.status(400).send({ error: true, msg: error });
    }
  }
}

module.exports = AddressesController;
