"use strict";

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
    await queryInterface.bulkUpdate("products", { category_id: 2 }, { id: 1 });

    await queryInterface.bulkUpdate("products", { category_id: 4 }, { id: 2 });

    await queryInterface.bulkUpdate("products", { category_id: 2 }, { id: 3 });

    await queryInterface.bulkUpdate("products", { category_id: 2 }, { id: 4 });

    await queryInterface.bulkUpdate("products", { category_id: 1 }, { id: 5 });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkUpdate(
      "products",
      { category_id: null },
      {
        id: [1, 2, 3, 4, 5],
      }
    );
  },
};
