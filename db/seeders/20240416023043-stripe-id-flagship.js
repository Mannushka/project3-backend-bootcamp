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
    await queryInterface.bulkUpdate(
      'products',
      {
        stripe_id: 'price_1P61sJCe2bVtqVUUawoyhJpq',
      },
      { title: 'Alienware Laptop' },
    );

    await queryInterface.bulkUpdate(
      'products',
      {
        stripe_id: 'price_1P61v9Ce2bVtqVUUIJPrnEUq',
      },
      { title: 'Pear IPhone X' },
    );

    await queryInterface.bulkUpdate(
      'products',
      {
        stripe_id: 'price_1P61wUCe2bVtqVUUS1QaN3IW',
      },
      { title: 'Pear Vision Pro' },
    );

    await queryInterface.bulkUpdate(
      'products',
      {
        stripe_id: 'price_1P61xaCe2bVtqVUUevvjkaO6',
      },
      { title: 'Cyberpunk Tablet' },
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkUpdate(
      'products',
      {
        stripe_id: null,
      },
      {
        title: [
          'Alienware Laptop',
          'Pear IPhone X',
          'Pear Vision Pro',
          'Cyberpunk Tablet',
        ],
      },
    );
  },
};
