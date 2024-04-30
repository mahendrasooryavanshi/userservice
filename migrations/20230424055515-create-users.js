"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
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
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      countryCode: {
        type: Sequelize.BIGINT,
        field: "country_code",
        allowNull: true,
      },
      mobileNumber: {
        type: Sequelize.BIGINT,
        allowNull: true,
        field: "mobile_number",
      },
      isBusiness: {
        type: Sequelize.ENUM("1", "0"),
        defaultValue: "0",
        field: "is_business",
      },
      type: {
        type: Sequelize.ENUM("user", "business", "admin"),
        defaultValue: "user",
      },
      socialId: {
        type: Sequelize.STRING,
        allowNull: true,
        field: "social_id",
      },
      socialType: {
        type: Sequelize.ENUM("email", "mobile", "facebook", "google", "apple"),
        defaultValue: "email",
        field: "social_type",
      },
      status: {
        type: Sequelize.ENUM,
        values: ["active", "inactive"],
        defaultValue: "active",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: "created_at",
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: "updated_at",
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
    await queryInterface.dropTable("users");
  },
};
