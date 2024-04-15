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
    await queryInterface.bulkInsert('products', [
      {
        title: 'Alienware Laptop',
        price: 3500,
        description:
          'Unleash the ultimate gaming supremacy with the Alienware Laptop, where lightning-fast performance meets unbeatable power for the most immersive gaming experience ever.',
        stock_left: 30,
        created_at: new Date(),
        updated_at: new Date(),
        img: 'https://m.media-amazon.com/images/I/71PSUjIQKDS._AC_UF894,1000_QL80_.jpg',
        category_id: 2,
      },
      {
        title: 'Pear IPhone X',
        price: 1200,
        description:
          'Experience unparalleled performance with the iPhone, where every tap, swipe, and game takes you on a journey of unrivaled speed and seamless entertainment.',
        stock_left: 100,
        created_at: new Date(),
        updated_at: new Date(),
        img: 'https://www.courts.com.sg/media/catalog/product/i/p/ip186838_00.jpg?quality=80&bg-color=255,255,255&fit=bounds&height=770&width=770&canvas=770:770',
        category_id: 3,
      },
      {
        title: 'Pear Vision Pro',
        price: 5000,
        description:
          'Dive into a realm of boundless exploration with the Apple Vision Pro VR, where unparalleled performance and stunning visuals merge to redefine the way you experience virtual reality',
        stock_left: 28,
        created_at: new Date(),
        updated_at: new Date(),
        img: 'https://www.apple.com/newsroom/images/media/introducing-apple-vision-pro/Apple-WWDC23-Vision-Pro-with-battery-230605_big.jpg.large.jpg',
        category_id: 4,
      },
      {
        title: 'Cyberpunk Tablet',
        price: 10000,
        description:
          'Immerse yourself in the neon-lit streets of Night City with the Cyberpunk 2077 Tablet, where unparalleled performance and cutting-edge visuals transport you into a dystopian future like never before.',
        stock_left: 10,
        created_at: new Date(),
        updated_at: new Date(),
        img: 'https://i.imgur.com/id31Xn1.png',
        category_id: 5,
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
    await queryInterface.bulkDelete('products', {
      title: [
        'Alienware Laptop',
        'Pear IPhone X',
        'Pear Vision Pro',
        'Cyberpunk Tablet',
      ],
    });
  },
};
