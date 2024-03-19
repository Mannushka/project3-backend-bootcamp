"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      "addresses",
      "fk_addresses_buyer_id_users"
    );
  },
};
