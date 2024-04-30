"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("temp_users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      verifyOtp: {
        type: Sequelize.STRING,
        field: "verify_otp",
        allowNull: false,
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
      businessName: {
        type: Sequelize.STRING,
        allowNull: true,
        field: "business_name",
      },
      businessHour: {
        type: Sequelize.JSON,
        allowNull: true,
        field: "business_hour",
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
      businessCountryCode: {
        type: Sequelize.BIGINT,
        allowNull: true,
        field: "business_country_code",
      },
      businessMobileNumber: {
        type: Sequelize.BIGINT,
        allowNull: true,
        field: "business_mobile_number",
      },
      websiteLink: {
        type: Sequelize.STRING,
        allowNull: true,
        field: "website_link",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        field: "created_at",
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
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
    await queryInterface.dropTable("temp_users");
  },
};
