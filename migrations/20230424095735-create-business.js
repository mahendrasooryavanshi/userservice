"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("businesses", {
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
      businessName: {
        type: Sequelize.STRING,
        allowNull: true,
        field: "business_name",
      },
      businessAddress: {
        type: Sequelize.STRING,
        allowNull: true,
        field: "business_address",
      },
      lat: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      long: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      businessEmail: {
        type: Sequelize.STRING,
        allowNull: true,
        field: "business_email",
      },
      countryCode: {
        type: Sequelize.BIGINT,
        allowNull: true,
        field: "country_code",
      },
      mobileNumber: {
        type: Sequelize.BIGINT,
        allowNull: true,
        field: "mobile_number",
      },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        defaultValue: "active",
      },
      websiteLink: {
        type: Sequelize.STRING,
        allowNull: true,
        field: "website_link",
      },
      about: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      additionalInfo: {
        type: Sequelize.TEXT,
        allowNull: true,
        field: "additional_info",
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
    await queryInterface.dropTable("businesses");
  },
};
