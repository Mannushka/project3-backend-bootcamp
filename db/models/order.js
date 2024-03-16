'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.product, {
        through: 'order_products',
        timestamps: false,
      });
    }
  }
  Order.init(
    {
      quantity: DataTypes.BIGINT,
      delivery_address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'order',
      underscored: true,
    },
  );
  return Order;
};
