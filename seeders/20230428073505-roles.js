"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("roles", [
      {
        // id: 1,
        title: "admin",
        description: "admin role",
        status: "active",
        // deletedAt: null,
      },
      {
        // id: 2,
        title: "business",
        description: "business role",
        status: "active",
        // deletedAt: null,
      },
      {
        // id: 3,
        title: "user",
        description: "user role",
        status: "active",
        // deletedAt: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("roles", null, {});
  },
};
