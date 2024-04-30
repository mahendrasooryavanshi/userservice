"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_addresses", {
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
      addressLine1: {
        type: Sequelize.STRING,
        allowNull: true,
        field: "address_line_1",
      },
      addressLine2: {
        type: Sequelize.STRING,
        allowNull: true,
        field: "address_line_2",
      },
      lat: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      long: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      zipCode: {
        type: Sequelize.STRING,
        allowNull: true,
        field: "zip_code",
      },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        defaultValue: "active",
      },
      isDefault: {
        type: Sequelize.ENUM("0", "1"),
        defaultValue: "0",
        field: "is_default",
      },
      createdAt: {
        allowNull: true,
        type: "TIMESTAMP",
        field: "created_at",
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        field: "updated_at",
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        field: "updated_at",
        defaultValue: null,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_addresses");
  },
};
