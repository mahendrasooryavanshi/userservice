"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_devices", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      userId: {
        type: Sequelize.BIGINT,
        field: "user_id",
        references: {
          model: "users",
          key: "id",
        },
      },
      uniqueId: {
        type: Sequelize.STRING,
        field: "unique_id",
        allowNull: true,
      },
      userAgent: {
        type: Sequelize.STRING,
        field: "user_agent",
        allowNull: true,
      },
      deviceType: {
        type: Sequelize.ENUM("android", "iphone", "web"),
        defaultValue: "web",
        field: "device_type",
      },
      appVersion: {
        type: Sequelize.STRING,
        field: "app_version",
        allowNull: true,
      },
      buildVersion: {
        type: Sequelize.STRING,
        field: "build_version",
        allowNull: true,
      },
      deviceDetail: {
        type: Sequelize.STRING,
        field: "device_detail",
        allowNull: true,
      },
      notificationId: {
        type: Sequelize.STRING,
        allowNull: true,
        field: "notification_id",
      },
      notificationStatus: {
        type: Sequelize.TINYINT(0, 1),
        defaultValue: 0,
        field: "notification_status",
      },
      isLogin: {
        type: Sequelize.TINYINT(0, 1),
        field: "is_login",
        defaultValue: 0,
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
    await queryInterface.dropTable("user_devices");
  },
};
