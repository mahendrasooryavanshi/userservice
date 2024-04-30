"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user_devices extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_devices.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      userId: {
        type: DataTypes.BIGINT,
        field: "user_id",
        references: {
          model: "users",
          key: "id",
        },
      },
      uniqueId: {
        type: DataTypes.STRING,
        field: "unique_id",
        allowNull: true,
      },
      deviceType: {
        type: DataTypes.ENUM("android", "iphone", "web"),
        defaultValue: "web",
        field: "device_type",
      },
      appVersion: {
        type: DataTypes.STRING,
        field: "app_version",
        allowNull: true,
      },
      buildVersion: {
        type: DataTypes.STRING,
        field: "build_version",
        allowNull: true,
      },
      userAgent: {
        type: DataTypes.STRING,
        field: "user_agent",
        allowNull: true,
      },
      deviceDetail: {
        type: DataTypes.STRING,
        field: "device_detail",
        allowNull: true,
      },
      notificationId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "notification_id",
      },
      notificationStatus: {
        type: DataTypes.TINYINT(0, 1),
        defaultValue: 0,
        field: "notification_status",
      },
      isLogin: {
        type: DataTypes.TINYINT(0, 1),
        field: "is_login",
        defaultValue: 0,
      },
      createdAt: {
        allowNull: true,
        type: DataTypes.DATE,
        field: "created_at",
      },
      updatedAt: {
        allowNull: true,
        type: DataTypes.DATE,
        field: "created_at",
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
      modelName: "user_devices",
    }
  );
  return user_devices;
};
