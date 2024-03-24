'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.order, {
        through: 'order_products',
        timestamps: false,
      });

      // Define association with categories here
      this.belongsTo(models.category);
    }
  }
  Product.init(
    {
      title: DataTypes.STRING,
      price: DataTypes.BIGINT,
      description: DataTypes.TEXT,
      // shipping_details: DataTypes.TEXT,
      stock_left: DataTypes.BIGINT,
      // model_url: DataTypes.STRING,
      img: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'product',
      underscored: true,
    },
  );
  return Product;
};
