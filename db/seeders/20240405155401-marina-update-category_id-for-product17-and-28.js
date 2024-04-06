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
    await queryInterface.bulkUpdate("products", { category_id: 2 }, { id: 17 });

    await queryInterface.bulkUpdate("products", { category_id: 3 }, { id: 28 });

    await queryInterface.bulkUpdate("products", { category_id: 3 }, { id: 29 });
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
        id: [17, 28, 29],
      }
    );
  },
};
