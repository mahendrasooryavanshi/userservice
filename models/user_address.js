"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user_address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_address.init(
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
      addressLine1: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "address_line_1",
      },
      addressLine2: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "address_line_2",
      },
      lat: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      long: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      zipCode: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "zip_code",
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
      },
      isDefault: {
        type: DataTypes.ENUM("0", "1"),
        defaultValue: "0",
        field: "is_default",
      },
      createdAt: {
        allowNull: true,
        type: DataTypes.DATE,
        field: "created_at",
      },
      updatedAt: {
        allowNull: true,
        type: DataTypes.DATE,
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
      modelName: "user_address",
    }
  );
  return user_address;
};
