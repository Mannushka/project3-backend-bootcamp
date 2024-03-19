'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert('orders', [
      {
        quantity: 1,
        delivery_address: 'Plaza Singapura',
        created_at: new Date(),
        updated_at: new Date(),
        user_id: 2,
      },
      {
        quantity: 3,
        delivery_address: 'Orchard Road',
        created_at: new Date(),
        updated_at: new Date(),
        user_id: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('orders', null, {});
  },
};
