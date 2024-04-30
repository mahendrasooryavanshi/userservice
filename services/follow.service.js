// const user = require("../controllers/v1/user/user.controller");
const connection = require("../models");
const { sequelize, Sequelize } = connection;
const { Op } = Sequelize;
const Models = sequelize.models;
const { users, user_following } = Models;

const followService = {
  /**
   * Create
   * @param {} data
   * @returns
   */
  create: async (data) => {
    return await user_following
      .create(data)
      .then(async (insertResult) => {
        return insertResult.dataValues;
      })
      .catch(async (err) => {
        console.log(
          "error",
          "DB error: follow unFollow  create  query failed.",
          err
        );
        return false;
      });
  },

  /**
   * Get One
   * @param {*} data
   * @returns
   */
  getOne: async (data) => {
    const userFollowResult = await user_following.findOne(data);
    if (userFollowResult === null) {
      return false;
    } else {
      return userFollowResult.dataValues;
    }
  },

  /**
   * Get All
   * @param {} data
   * @returns
   */
  getAll: async (data) => {
    const userFollowResult = await user_following.findAll(data);
    if (userFollowResult === null) {
      return false;
    } else {
      return userFollowResult;
    }
  },

  /**
   * Delete
   * @param {*} data
   * @returns
   */
  delete: async (data) => {
    return await user_following
      .destroy({ where: data })
      .then(async (remove) => {
        return remove;
      })
      .catch(async (err) => {
        console.log("error", "DB error:  unFollow  query failed.", err);
        return false;
      });
  },

  /**
   * Get Follwer List
   * @param {} data
   * @param {*} userData
   * @returns
   */
  followerList: async (data, userData) => {
    let response = {};
    let listData = await Promise.all([
      user_following.findAll({
        attributes: { exclude: ["updatedAt"] },
        include: [
          {
            model: users,
            as: "followerUser",
            attributes: [
              ["public_id", "id"],
              "name",
              "email",
              "status",
              "createdAt",
            ],
            where: userData,
          },
        ],
        where: data.where,
        limit: data.limit,
        offset: data.offset,
        order: [["id", "DESC"]],
      }),
      user_following.count({ where: data.where }),
    ]);
    response.followerCount = listData[1];
    response.followerResult = listData[0];
    if (listData[0] === null) {
      return false;
    } else {
      return response;
    }
  },

  /**
   * Get Following List
   * @param {*} data
   * @param {*} userData
   * @returns
   */
  followingList: async (data, userData) => {
    let response = {};
    let listData = await Promise.all([
      await user_following.findAll({
        attributes: { exclude: ["deletedAt", "updatedAt"] },
        include: [
          {
            model: users,
            as: "followingUser",
            attributes: [
              ["public_id", "id"],
              "name",
              "email",
              "status",
              "createdAt",
            ],
            where: userData,
          },
        ],
        where: data.where,
        limit: data.limit,
        offset: data.offset,
        order: [["id", "DESC"]],
      }),
      user_following.count({ where: data.where }),
    ]);
    response.followingCount = listData[1];
    response.followingResult = listData[0];
    if (listData[0] === null) {
      return false;
    } else {
      return response;
    }
  },

  /**
   * Update Status
   * @param {*} data
   * @param {*} entity
   * @returns
   */
  updateStatus: async (data, entity) => {
    return await user_following
      .update(entity, { where: data })
      .then(async (updateResult) => {
        return updateResult.dataValues;
      })
      .catch(async (err) => {
        console.log("error", "DB error: update Status   query failed.", err);
        return false;
      });
  },
};

// export module to use on other files
module.exports = followService;
