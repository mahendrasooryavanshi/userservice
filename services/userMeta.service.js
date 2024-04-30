const { Op } = require("sequelize");
const connection = require("../models");
const sequelize = connection.sequelize;
const Models = sequelize.models;
const { user_meta, users } = Models;

const userMeta = {
  create: async (data) => {
    return await user_meta
      .bulkCreate(data)
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        console.log("error", "DB error: create user meta query failed.", err);
        return false;
      });
  },

  checkVendor: async (userId) => {
    return await user_meta
      .findOne({
        where: { metaKey: "vendorId", metaValue: userId, deletedAt: null },
      })
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        console.log("error", "DB error: get vendor query failed.", err);
        return false;
      });
  },

  checkIsSync: async () => {
    return await user_meta
      .findAll({
        where: {
          metaKey: "isSync",
          metaValue: { [Op.ne]: null },
          deletedAt: null,
        },
        order: [["metaValue", "ASC"]],
        limit: 20,
        include: [
          {
            model: users,
            as: "userData",
            attributes: [
              "id",
              "publicId",
              "email",
              "firstName",
              "lastName",
              "userAuthId",
              "userName",
              "isPrivate",
              "totalFollowers",
              "totalFollowing",
              "isPrivateFollow",
              "status",
            ],
            where: { deletedAt: null },
            include: [
              {
                model: user_meta,
                attributes: ["metaKey", "metaValue"],
                required: false,
                as: "userMeta",
                where: {
                  metaKey: "vendorRating",
                  deletedAt: null,
                },
              },
            ],
          },
        ],
      })
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        console.log("error", "DB error: get vendor query failed.", err);
        return false;
      });
  },

  update: async () => {
    return await user_meta
      .update(
        { metaValue: null },
        { where: { metaKey: "isSync", deletedAt: null } }
      )
      .then(async (updateResult) => {
        return updateResult;
      })
      .catch(async (err) => {
        console.log("error", "DB error: update password  query failed.", err);
        return false;
      });
  },

  updateUser: async (data) => {
    return await user_meta
      .update(data.set, { where: data.where })
      .then(async (updateResult) => {
        return updateResult;
      })
      .catch(async (err) => {
        console.log("error", "DB error: update user query failed.", err);
        return false;
      });
  },

  topFollower: async (data) => {
    return await users
      .findAll({
        attributes: [
          "id",
          "publicId",
          "isFeatured",
          "totalFollowers",
          "status",
        ],
        where: { status: "active", isShop: 0, deletedAt: null },
        limit: 10,
        order: [["totalFollowers", "DESC"]],
      })
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        console.log("error", "DB error: get top follower query failed.", err);
        return false;
      });
  },

  topShop: async (data) => {
    return await users
      .findAll({
        attributes: [
          "id",
          "publicId",
          "isFeatured",
          "totalFollowers",
          "status",
        ],
        where: { status: "active", isShop: 1, deletedAt: null },
        limit: 15,
        order: [["totalFollowers", "DESC"]],
      })
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        console.log("error", "DB error: get top shop query failed.", err);
        return false;
      });
  },

  updateIsFeatured: async (data) => {
    return await users
      .update(data.set, { where: data.where })
      .then(async (updateResult) => {
        return updateResult;
      })
      .catch(async (err) => {
        console.log("error", "DB error: update user query failed.", err);
        return false;
      });
  },

  getMeta: async (data) => {
    return await user_meta
      .findOne({
        where: data,
      })
      .then(async (result) => {
        return result;
      })
      .catch(async (err) => {
        console.log("error", "DB error: get meta query failed.", err);
        return false;
      });
  },

  /*
  *
  @AIOIA code start
  *
  */

  bulkCreateUserMeta: async (data) => {
    try {
      const userResult = await user_meta.bulkCreate(data);
      return userResult;
    } catch (err) {
      console.log("createUserMeta service failed");
    }
  },
  findUserMeta: async (data) => {
    try {
      const userResult = await user_meta.findOne({ where: data });
      return userResult;
    } catch (err) {
      console.log("createUserMeta service failed");
    }
  },
  updateUserMeta: async (data, value) => {
    try {
      const userResult = await user_meta.update(value, { where: data });
      return userResult;
    } catch (err) {
      console.log("createUserMeta service failed");
    }
  },

  deleteUserMeta: async (data) => {
    try {
      const userResult = await user_meta.destroy({ where: data });
      return userResult;
    } catch (err) {
      console.log("createUserMeta service failed");
    }
  },
  addUserMetaPoint: async (data) => {
    return await user_meta
      .create(data)
      .then(async (insert_result) => {
        return insert_result;
      })
      .catch(async (err) => {
        console.log("error", "DB error: User meta query failed.", err);
        return false;
      });
  },
  /*
  *
  @TWE code end
  *
  */
};

// export module to use on other files
module.exports = userMeta;
