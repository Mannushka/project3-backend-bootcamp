'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order_products extends Model {
    /**
     * JUNCTION TABLE BETWEEN ORDERS AND PRODUCTS
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association with orders
      this.belongsTo(models.order, { foreignKey: 'order_id' });
      // Define association with products
      this.belongsTo(models.product, { foreignKey: 'product_id' });
    }
  }
  order_products.init(
    {
      order_id: DataTypes.INTEGER,
      // order_id: {
      //   type: DataTypes.INTEGER,

      //   references: {
      //     model: 'orders',
      //     key: 'id',
      //   },
      // },
      product_id: DataTypes.INTEGER,
      // product_id: {
      //   type: DataTypes.INTEGER,

      //   references: {
      //     model: 'products',
      //     key: 'id',
      //   },
      // },
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
