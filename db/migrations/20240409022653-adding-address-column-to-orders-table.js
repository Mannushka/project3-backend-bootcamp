'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('orders', 'address_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.addConstraint('orders', {
      fields: ['address_id'],
      type: 'foreign key',
      name: 'fk_orders_address_id_addresses',
      references: {
        table: 'addresses',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('orders', 'address_id');
  },
};
