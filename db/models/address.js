'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user);
    }
  }
  Address.init(
    {
      buyer_id: {
        type: DataTypes.INTEGER,
        field: 'buyer_id',
        references: {
          model: 'users',
          key: 'id',
        },
      },
      address: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'address',
      underscored: true,
    },
  );
  return Address;
};
