"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user_following extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // define association here
      user_following.belongsTo(models.users, {
        foreignKey: "fromId",
        as: "followerUser",
      });
      user_following.belongsTo(models.users, {
        foreignKey: "toId",
        as: "followingUser",
      });
      models.users.hasOne(user_following, {
        foreignKey: "toId",
        as: "myFollowing",
      });
      models.users.hasOne(user_following, {
        foreignKey: "fromId",
        as: "myFollower",
      });
      models.users.hasOne(user_following, {
        foreignKey: "fromId",
        as: "isBlocked",
      });
    }
  }
  user_following.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      toId: {
        type: DataTypes.BIGINT,
        field: "to_id",
        references: {
          model: "users",
          key: "id",
        },
      },
      fromId: {
        type: DataTypes.BIGINT,
        field: "from_id",
        references: {
          model: "users",
          key: "id",
        },
      },
      status: {
        type: DataTypes.ENUM("pending", "accepted", "rejected", "blocked"),
        defaultValue: "pending",
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
      modelName: "user_following",
    }
  );
  return user_following;
};
