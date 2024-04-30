const connection = require("../models");
const { sequelize, Sequelize } = connection;
const { QueryTypes } = require("sequelize");
const { Op } = Sequelize;
const Models = sequelize.models;
const bcrypt = require("bcrypt");
let moment = require("moment");
const {
  users,
  user_role,
  roles,
  user_permission,
  permissions,
  role_permission,
  user_following,
  user_meta
  
} = Models;

const userService = {
  /**
   * reset password
   * @param {*} data 
   * @returns 
   */
  resetPassword: async (data) => {
    const userResult = await users.findOne({
      where: { id: data.id, deletedAt: null },
    });
    if (userResult) {
      let newPassword = await bcrypt.hash(data.password, 10);
      let updateEntity = {
        password: newPassword,
      };
      await users.update(updateEntity, {
        where: {
          id: userResult.id,
        },
      });

      return true;
    } else {
      return false;
    }
  },
  /**
   * getOne
   * @param {*} data 
   * @returns 
   */
  getOne: async (data) => {
    try {
      const userResult = await users.findOne({
        where: data,
      });
      return userResult;
    } catch (err) {
      console.log("getOne user service failed ", err);
    }
  },
  
  /**
   * Update Password
   * @param {} data 
   * @returns 
   */
  updatePassword: async (data) => {
    let updateEntity = {
      password: data.password,
    };
    await users.update(updateEntity, {
      where: {
        id: data.id,
      },
    });
    return true;
  },

  /**
   * User Details
   * @param {*} data 
   * @returns 
   */
  details: async (data) => {
    const userResult = await users.findOne({
      where: { publicId: data.userId, deletedAt: null },
      attributes: {
        exclude: [
          "id",
          "password",
          "updatedAt",
          "deletedAt",
          "socialId",
        ],
      },
      include: [
        {
          model: user_role,
          as: "userRole",
          attributes: ["roleId"],
          include: [
            {
              model: roles,
              as: "roles",
              attributes: ["title"],
              include: [
                {
                  model: role_permission,
                  as: "rolePermission",
                  attributes: ["roleId"],
                  include: [
                    {
                      model: permissions,
                      as: "permissions",
                      attributes: ["title"],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: user_permission,
          as: "userPermission",
          attributes: ["permissionId"],
          include: [
            { model: permissions, as: "permissions", attributes: ["title"] },
          ],
        },
      ],
      include: [
        {
          model: user_following,
          required: false,
          as: "myFollowing",
          attributes: ["fromId", "toId", "status"],
          // where: { fromId: data.fromId, deletedAt: null },
          where: { fromId: data.fromId },
        },
        {
          model: user_following,
          required: false,
          as: "isBlocked",
          attributes: ["fromId", "toId", "status"],
          // where: { toId: data.fromId, deletedAt: null, status: "blocked" },
          where: { toId: data.fromId, status: "blocked" },
        },
      ],
    });
    if (userResult === null) {
      return false;
    } else {
      return userResult.dataValues;
    }
  },

  /**
   * Setting
   * @param {*} data 
   * @returns 
  */

  setting: async (data) => {
    let status;
    if (data.isPrivate == 0) {
      status = "public";
    } else if (data.isPrivate == 1) {
      status = "private";
    }
    let updateEntity = {
      isPrivate: status,
      isPrivateFollow: data.isFollowPrivate,
    };
    await users.update(updateEntity, {
      where: {
        publicId: data.userId,
      },
    });
    return true;
  },
  /**
   * Get OneWithMeta
   * @param {*} params 
   * @param {*} paramsData 
   * @returns 
   */
  getOneWithMeta: async (params, paramsData) => {
    try {
      const userResult = await users.findOne({
        where: params.where,
        include: [
          {
            model: user_meta,
            as: "userMetaData",
            where: paramsData.where,
            required: false,
          },
        ],
      });
      return userResult;
    } catch (err) {
      console.log("getOneWithMeta  user service failed ", err);
    }
  },
 
};

// export module to use on other files
module.exports = userService;
