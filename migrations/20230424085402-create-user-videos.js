"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_videos", {
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
      title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: true,
        field: "user_id",
        references: {
          model: "users",
          key: "id",
        },
      },
      video: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        defaultValue: "active",
        allowNull: false,
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
    await queryInterface.dropTable("user_videos");
  },
};
