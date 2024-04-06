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

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1P1ievCe2bVtqVUUX6ZhHTf2" },
      { id: 1 }
    );
    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1P1iyaCe2bVtqVUUrWGuWKsd" },
      { id: 2 }
    );
    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1P1izdCe2bVtqVUUEE3qdnFC" },
      { id: 3 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1P1j3vCe2bVtqVUUd3JmvJfT" },
      { id: 4 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1P1j5hCe2bVtqVUUfwlVGtdb" },
      { id: 5 }
    );
    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyRM8Ce2bVtqVUUKsqiHOpR" },
      { id: 6 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyRByCe2bVtqVUUcIgjucVt" },
      { id: 7 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyFtTCe2bVtqVUUkib369iz" },
      { id: 8 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyRI5Ce2bVtqVUUPeZY68jl" },
      { id: 9 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyFtTCe2bVtqVUUs4HXpNpU" },
      { id: 10 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyFtTCe2bVtqVUUm0qJ43ym" },
      { id: 11 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyR5cCe2bVtqVUU55qo1Lig" },
      { id: 12 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyRB8Ce2bVtqVUU3auJ56ve" },
      { id: 13 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyRMcCe2bVtqVUUOyhTG0l0" },
      { id: 14 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyR7yCe2bVtqVUUEE0W130j" },
      { id: 15 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyR9HCe2bVtqVUU0PYKdaQi" },
      { id: 16 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyRJ5Ce2bVtqVUUMk79xSnA" },
      { id: 17 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyR8QCe2bVtqVUUgPkkKJk8" },
      { id: 18 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyR9oCe2bVtqVUUdciEKd2x" },
      { id: 19 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyHThCe2bVtqVUUA9BDZblq" },
      { id: 20 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyR8vCe2bVtqVUUNVK1L4VQ" },
      { id: 21 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyRIRCe2bVtqVUU77Ido4Ac" },
      { id: 22 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyRA4Ce2bVtqVUUzzESOhSs" },
      { id: 23 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyR28Ce2bVtqVUUGj5M0upu" },
      { id: 24 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyRIiCe2bVtqVUUcczlnGf5" },
      { id: 25 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyFtTCe2bVtqVUUvpaqx3UT" },
      { id: 26 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyR9XCe2bVtqVUUOqM8o1ND" },
      { id: 27 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyRAVCe2bVtqVUUKQ4SE0OT" },
      { id: 28 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyR8gCe2bVtqVUUKy5eNKog" },
      { id: 29 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyR2VCe2bVtqVUUjucQXMJV" },
      { id: 30 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyHThCe2bVtqVUUuUch4O2I" },
      { id: 31 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyR5FCe2bVtqVUU6V2MTz9y" },
      { id: 32 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyRJQCe2bVtqVUUGVRG791B" },
      { id: 33 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyQnICe2bVtqVUURNgeoZPs" },
      { id: 34 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyHThCe2bVtqVUUwO4b89vb" },
      { id: 35 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyFtTCe2bVtqVUUWXCwBaBo" },
      { id: 36 }
    );

    await queryInterface.bulkUpdate(
      "products",
      { stripe_id: "price_1OyHThCe2bVtqVUUbi2eVzKJ" },
      { id: 37 }
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
      "products",
      { stripe_id: null },
      {
        id: [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        ],
      }
    );
  },
};
