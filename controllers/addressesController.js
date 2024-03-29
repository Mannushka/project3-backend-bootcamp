const BaseController = require('./baseController');
const { DataTypes, QueryTypes } = require('sequelize'); // Import DataTypes and QueryTypes

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
          // replacements: { addressId },
          type: this.model.sequelize.QueryTypes.SELECT,
        },
      );

      // console.log(address.map((singleAddress) => singleAddress.address));
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

  //every time the user writes a new address in the shipping details page, we need to post this address to our addresses table

  //Before we send a post req to server, need to check if this address already exits in our DB
  //If yes -> dont post
  // if no -> make a post request

  async postNewAddress(req, res) {
    const { email, address } = req.body;

    const allAddresses = await this.model.sequelize.query(
      `SELECT "id", "buyer_id", "address", "created_at" AS "createdAt", "updated_at" AS "updatedAt", "buyer_id" AS "user_id" FROM "addresses"`,
      {
        // replacements: { addressId },
        type: this.model.sequelize.QueryTypes.SELECT,
      },
    );

    const arrayOfAddresses = allAddresses.map(
      (singleAddress) => singleAddress.address,
    );

    console.log(arrayOfAddresses);
    console.log(email);

    console.log(arrayOfAddresses.includes(address));

    if (!arrayOfAddresses.includes(address)) {
      try {
        // Find or create the buyer
        const [buyer] = await this.userModel.findOrCreate({
          where: { email: email },
        });

        console.log(buyer.dataValues.id === null);

        // Create a new address associated with the buyer
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
}

module.exports = AddressesController;
