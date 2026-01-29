'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Books', [
      {
        title: 'Harry Potter and the Philosopher\'s Stone',
        author: 'J.K. Rowling',
        stock: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        stock: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: '1984',
        author: 'George Orwell',
        stock: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        stock: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        stock: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Books', null, {});
  }
};
