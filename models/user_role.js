"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user_role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user_role.belongsTo(models.roles, {
        foreignKey: "roleId",
        as: "roles",
      });
    }
  }
  user_role.init(
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
      roleId: {
        type: DataTypes.BIGINT,
        field: "role_id",
        references: {
          model: "roles",
          key: "id",
        },
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
      modelName: "user_role",
    }
  );
  return user_role;
};
