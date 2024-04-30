"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class business extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      business.belongsTo(models.users, {
        foreignKey: "id",
        as: "users",
      });
    }
  }
  business.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      publicId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
        field: "public_id",
      },
      userId: {
        type: DataTypes.BIGINT,
        field: "user_id",
        references: {
          model: "users",
          key: "id",
        },
      },
      businessName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "business_name",
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
      countryCode: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: "country_code",
      },
      mobileNumber: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: "mobile_number",
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
      },
      websiteLink: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "website_link",
      },
      about: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      additionalInfo: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "additional_info",
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
      modelName: "business",
    }
  );
  return business;
};
