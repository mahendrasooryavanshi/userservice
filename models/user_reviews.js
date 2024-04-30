"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user_reviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user_reviews.belongsTo(models.users, {
        foreignKey: "id",
        as: "users",
      });
      user_reviews.hasMany(models.user_review_history, {
        foreignKey: "user_review_id",
        as: "userReviewHistory",
      });
    }
  }
  user_reviews.init(
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
        allowNull: true,
        field: "user_id",
        references: {
          model: "users",
          key: "id",
        },
      },
      isAnonymous: {
        type: DataTypes.ENUM("0", "1"),
        defaultValue: "0",
        field: "is_anonymous",
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
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
      modelName: "user_reviews",
    }
  );
  return user_reviews;
};
