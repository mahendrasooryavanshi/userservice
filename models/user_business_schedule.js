"use strict";
const { Model } = require("sequelize");
const { Sequelize } = require(".");
module.exports = (sequelize, DataTypes) => {
  class user_business_schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user_business_schedule.belongsTo(models.users, {
        foreignKey: "id",
        as: "users",
      });
    }
  }
  user_business_schedule.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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
      day: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      openTime: {
        type: DataTypes.TIME,
        allowNull: false,
        field: "open_time",
      },
      closeTime: {
        type: DataTypes.TIME,
        allowNull: false,
        field: "close_time",
      },
      schedule: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isOpen: {
        type: DataTypes.ENUM("yes", "no"),
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
    },
    {
      sequelize,
      modelName: "user_business_schedule",
    }
  );
  return user_business_schedule;
};
