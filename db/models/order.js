'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // define association here

      // Many-to-1 relationship with user
      this.belongsTo(models.user);

      // Many-to-Many relationship with products with junction table order_products
      // this.belongsToMany(models.product, {
      //   through: 'order_products',
      //   timestamps: false,
      // });
      this.belongsToMany(models.product, { through: 'order_products' });
    }
  }
  Order.init(
    {
      // quantity: DataTypes.BIGINT,
      delivery_address: DataTypes.STRING,
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          // Sequelize docs suggest this should be plural table name and not singular model name
          // https://sequelize.org/api/v6/class/src/model.js~model#static-method-init
          model: 'users',
          key: 'id',
        },
      },
      total_price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'order',
      timestamps: true,
      underscored: true,
    },
  );
  return Order;
};
