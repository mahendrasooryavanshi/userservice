"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user_meta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user_meta.belongsTo(models.users, {
        foreignKey: "id",
        as: "users",
      });
    }
  }
  user_meta.init(
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
      metaKey: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "meta_key",
      },
      metaValue: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "meta_value",
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
      modelName: "user_meta",
    }
  );
  return user_meta;
};
