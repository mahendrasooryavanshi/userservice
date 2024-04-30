"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class temp_users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  temp_users.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verifyOtp: {
        type: DataTypes.STRING,
        field: "verify_otp",
        allowNull: false,
      },
      countryCode: {
        type: DataTypes.BIGINT,
        field: "country_code",
        allowNull: true,
      },
      mobileNumber: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: "mobile_number",
      },
      isBusiness: {
        type: DataTypes.ENUM("1", "0"),
        defaultValue: "0",
        field: "is_business",
      },
      type: {
        type: DataTypes.ENUM("user", "business", "admin"),
        defaultValue: "user",
      },
      businessName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "business_name",
      },
      businessHour: {
        type: DataTypes.JSON,
        allowNull: true,
        field: "business_hour",
      },
      businessAddress: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "business_address",
      },
      lat: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      long: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      businessEmail: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "business_email",
      },
      businessCountryCode: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: "business_country_code",
      },
      businessMobileNumber: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: "business_mobile_number",
      },
      websiteLink: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "website_link",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "updated_at",
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE,
        field: "deleted_at",
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: "temp_users",
    }
  );
  return temp_users;
};
