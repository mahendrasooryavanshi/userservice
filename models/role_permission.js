"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class role_permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // define association here
      role_permission.belongsTo(models.permissions, {
        foreignKey: "permissionId",
        as: "permissions",
      });
    }
  }
  role_permission.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      roleId: {
        type: DataTypes.BIGINT,
        references: {
          model: "roles",
          key: "id",
        },
        field: "role_id",
      },
      permissionId: {
        type: DataTypes.BIGINT,
        references: {
          model: "permissions",
          key: "id",
        },
        field: "permission_id",
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
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
      modelName: "role_permission",
    }
  );
  return role_permission;
};
