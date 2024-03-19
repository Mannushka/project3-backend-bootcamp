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
    await queryInterface.bulkInsert(
      'addresses',
      [
        {
          buyer_id: 1,
          address: '123 Ang Mo Kio Avenue 4, #07-123, Singapore 560123',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          buyer_id: 2,
          address: '456 Jurong West Street 52, #12-345, Singapore 640456',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('addresses', null, {});
  },
};
