"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("role_permissions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      roleId: {
        type: Sequelize.BIGINT,
        references: {
          model: "roles",
          key: "id",
        },
        field: "role_id",
      },
      permissionId: {
        type: Sequelize.BIGINT,
        references: {
          model: "permissions",
          key: "id",
        },
        field: "permission_id",
      },

      // userId: {
      //   type: Sequelize.BIGINT,
      //   field: "user_id",
      //   references: {
      //     model: "roles",
      //     key: "id",
      //   },
      // },
      permissionId: {
        type: Sequelize.BIGINT,
        references: {
          model: "permissions",
          key: "id",
        },
        field: "permission_id",
      },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        defaultValue: "active",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: "created_at",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
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
    await queryInterface.dropTable("role_permissions");
  },
};
