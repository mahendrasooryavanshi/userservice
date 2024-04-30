"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      users.hasMany(models.user_role, {
        foreignKey: "userId",
        as: "userRole",
      });

      users.hasMany(models.user_permission, {
        foreignKey: "userId",
        as: "userPermission",
      });

      users.hasMany(models.user_meta, {
        foreignKey: "userId",
        as: "userMeta",
      });
      users.hasOne(models.business, {
        foreignKey: "userId",
        as: "business",
      });

      users.hasMany(models.user_business_schedule, {
        foreignKey: "userId",
        as: "userBusinessSchedule",
      });

      models.users.hasOne(models.user_meta, {
        foreignKey: "userId",
        as: "userMetaData",
      });
      users.hasMany(models.user_gallery, {
        foreignKey: "userId",
        as: "userGallery",
      });
      users.hasOne(models.user_reviews, {
        foreignKey: "userId",
        as: "userReviews",
      });
    }
  }
  users.init(
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
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      countryCode: {
        type: DataTypes.BIGINT,
        field: "country_code",
        allowNull: true,
      },
      mobileNumber: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: "mobile_number",
      },
      isBusiness: {
        type: DataTypes.ENUM("1", "0"),
        defaultValue: "0",
        field: "is_business",
      },
      type: {
        type: DataTypes.ENUM("user", "business", "admin"),
        defaultValue: "user",
      },
      socialId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "social_id",
      },
      socialType: {
        type: DataTypes.ENUM("email", "mobile", "facebook", "google", "apple"),
        defaultValue: "email",
        field: "social_type",
      },
      status: {
        type: DataTypes.ENUM,
        values: ["active", "inactive"],
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
      modelName: "users",
    }
  );
  return users;
};
