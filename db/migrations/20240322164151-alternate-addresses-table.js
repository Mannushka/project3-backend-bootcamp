"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("addresses", {
      fields: ["buyer_id"],
      type: "foreign key",
      name: "fk_addresses_buyer_id_users",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "addresses",
      "fk_addresses_buyer_id_users"
    );
  },
};
