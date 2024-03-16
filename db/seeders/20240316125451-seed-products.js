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
      'products',
      [
        {
          title: 'iPhone 15',
          price: 1999,
          description:
            'Introducing the iPhone 15, a pinnacle of innovation and elegance. With its sleek design and advanced features, experience unparalleled performance and seamless integration into your daily life.',
          shipping_details:
            'Receive your iPhone 15 swiftly with our expedited shipping, ensuring delivery within 2-3 business days, straight to your doorstep, hassle-free.',
          stock_left: 40,
          model_url: 'https://example.com/models/my_model.glb',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'iPad Pro 2024',
          price: 1499,
          description:
            'Experience the power and versatility of the iPad Pro 2024. With its cutting-edge technology and stunning display, unleash your creativity and productivity like never before.',
          shipping_details:
            'Enjoy fast and reliable shipping for your iPad Pro 2024, ensuring delivery within 3-5 business days, straight to your doorstep, for ultimate convenience.',
          stock_left: 30,
          model_url: 'https://example.com/models/ipad_pro_2024.glb',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Samsung Galaxy S25',
          price: 1299,
          description:
            'Discover the future of mobile technology with the Samsung Galaxy S25. Boasting cutting-edge features and an exquisite design, elevate your smartphone experience to new heights.',
          shipping_details:
            'Experience prompt delivery with our efficient shipping services for the Samsung Galaxy S25, ensuring arrival within 3-5 business days, securely delivered to your doorstep.',
          stock_left: 50,
          model_url: 'https://example.com/models/samsung_galaxy_s25.glb',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Google Pixel 7',
          price: 999,
          description:
            'Experience the latest in Android innovation with the Google Pixel 7. Featuring cutting-edge technology and an intuitive user experience, stay connected and productive wherever you go.',
          shipping_details:
            'Enjoy reliable shipping for your Google Pixel 7, with delivery expected within 4-6 business days, securely packaged and delivered to your doorstep for your convenience.',
          stock_left: 25,
          model_url: 'https://example.com/models/google_pixel_7.glb',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Asus ROG Strix Scar 17',
          price: 2199,
          description:
            'Unleash unparalleled gaming performance with the Asus ROG Strix Scar 17. Designed for serious gamers, this laptop boasts cutting-edge hardware and immersive features for an unmatched gaming experience.',
          shipping_details:
            'Get ready to dominate the gaming arena with our swift shipping service for the Asus ROG Strix Scar 17, with delivery expected within 3-5 business days, securely packaged and delivered to your doorstep.',
          stock_left: 15,
          model_url: 'https://example.com/models/asus_rog_strix_scar_17.glb',
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
    await queryInterface.bulkDelete('products', null, {});
  },
};
