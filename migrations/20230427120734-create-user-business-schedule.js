"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_business_schedules", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      publicId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
        field: "public_id",
      },
      userId: {
        type: Sequelize.BIGINT,
        field: "user_id",
        references: {
          model: "users",
          key: "id",
        },
      },
      day: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      openTime: {
        type: Sequelize.TIME,
        allowNull: false,
        field: "open_time",
      },
      closeTime: {
        type: Sequelize.TIME,
        allowNull: false,
        field: "close_time",
      },
      schedule: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isOpen: {
        type: Sequelize.ENUM("yes", "no"),
        defaultValue: "no",
        field: "is_open",
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
        field: "created_at",
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        field: "created_at",
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        field: "deleted_at",
        defaultValue: null,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_business_schedules");
  },
};
