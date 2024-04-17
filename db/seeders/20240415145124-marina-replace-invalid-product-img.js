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
      { img: "https://m.media-amazon.com/images/I/71dP5ll6V-L.jpg" },
      { id: 5 }
    );

    await queryInterface.bulkUpdate(
      "products",
      {
        img: "https://powermaccenter.com/cdn/shop/files/iPhone_14_Yellow_PDP_Image_Position-1A__en-US_0695e8c6-77b7-4ee2-a2e4-360fd972281b.jpg?v=1705405593",
      },
      { id: 15 }
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
      {
        img: "https://www.ect.my/image/ectmy/image/cache/data/all_product_images/product-16000/G733P-YLL009W----2-900x900.jpg",
      },
      { id: 5 }
    );

    await queryInterface.bulkUpdate(
      "products",
      {
        img: "https://cdn.alloallo.media/catalog/product/apple/iphone/iphone-13/iphone-13-pink.jpg",
      },
      { id: 15 }
    );
  },
};
