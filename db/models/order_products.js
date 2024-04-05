'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order_products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association with orders
      this.belongsTo(models.orders, { foreignKey: 'order_id' });
      // Define association with products
      this.belongsTo(models.products, { foreignKey: 'product_id' });
    }
  }
  order_products.init(
    {
      order_id: {
        type: DataTypes.INTEGER,
        references: {
          // Sequelize docs suggest this should be plural table name and not singular model name
          // https://sequelize.org/api/v6/class/src/model.js~model#static-method-init
          model: 'orders',
          key: 'id',
        },
      },
      product_id: {
        type: DataTypes.INTEGER,
        references: {
          // Sequelize docs suggest this should be plural table name and not singular model name
          // https://sequelize.org/api/v6/class/src/model.js~model#static-method-init
          model: 'products',
          key: 'id',
        },
      },
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'order_products',
      underscored: true,
    },
  );
  return order_products;
};
