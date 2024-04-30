const bcrypt = require("bcrypt");
const connection = require("../models");
const { sequelize, Sequelize } = connection;
const { Op } = Sequelize;

const Models = sequelize.models;

const {
  users,
  user_role,
  roles,
  user_permission,
  permissions,
  role_permission,
  user_devices,
} = Models;
const auth = {
  /**
   * login
   */
  login: async (data) => {
    const userResult = await users.findOne({
      where: data,
      // attributes: [
      //   "id",
      //   "publicId",
      //   "countryCode",
      //   "mobileNumber",
      //   "email",
      //   "password",
      //   "isBusiness",
      //   "name",
      //   "status",
      // ],
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
    });

    return userResult;
  },

  getRole: async (data) => {
    const roleResult = await user_role.findAll(
      {
        where: { userId: data.id, deletedAt: null },
        include: [
          {
            model: roles,
            as: "roles",
            // attributes: ["title"],
            include: [
              {
                model: role_permission,
                as: "rolePermission",
                // attributes: ["roleId"],
                include: [
                  {
                    model: permissions,
                    as: "permissions",
                    // attributes: ["title"],
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
        // attributes: ["permissionId"],
        include: [
          {
            model: permissions,
            as: "permissions",
            // attributes: ["title"]
          },
        ],
      }
    );

    if (roleResult.length > 0) {
      return roleResult;
    } else {
      return false;
    }
  },
  emailExist: async (data) => {
    const userResult = await users.count({
      where: { email: data.email, deletedAt: null },
    });
    if (userResult) {
      return true;
    } else {
      return false;
    }
  },
  mobileExistResult: async (data) => {
    const userResult = await users.count({
      where: {
        countryCode: data.countryCode,
        mobileNumber: data.mobileNumber,
        deletedAt: null,
      },
    });
    if (userResult) {
      return true;
    }
    return false;
  },

  signUp: async (data) => {
    return await users
      .create(data)
      .then(async (insert_result) => {
        return insert_result.dataValues;
      })
      .catch(async (err) => {
        console.log("error", "DB error: sign up query failed.", err);
        return false;
      });
  },

  SocialKeyExist: async (data) => {
    let where = {
      socialId: data.socialId,
      socialType: data.socialType,
      deletedAt: null,
    };
    if (data.email) {
      where.email = data.email;
    }
    const userResult = await users.findOne({
      where: where,
      attributes: [
        "id",
        "publicId",
        "countryCode",
        "mobileNumber",
        "email",
        "password",
        "isBusiness",
        "name",
        "status",
        "socialId",
      ],
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
        //   // {
        //   //   model: user_permission,
        //   //   as: "userPermission",
        //   //   attributes: ["permissionId"],
        //   //   include: [
        //   //     { model: permissions, as: "permission", attributes: ["title"] },
        //   //   ],
        //   // },
      ],
    });
    if (userResult === null) {
      return false;
    } else {
      return userResult.dataValues;
    }
  },

  refreshToken: async (data) => {
    const userResult = await users.findOne({
      where: { publicId: data.publicId, deletedAt: null },
      attributes: [
        "id",
        "publicId",
        "countryCode",
        "mobileNumber",
        "email",
        "password",
        "name",
        "status",
      ],
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
    });

    if (userResult === null) {
      return false;
    } else {
      return userResult.dataValues;
    }
  },
  logOut: async (data, userId) => {
    return await user_devices
      .update(data, { where: { userId: userId } })
      .then(async (updateResult) => {
        return updateResult.dataValues;
      })
      .catch(async (err) => {
        console.log("error", "DB error: user logout query failed.", err);
        return false;
      });
  },

  getOne: async (data) => {
    try {
      const deviceInfoResult = await user_devices.findOne({
        where: data,
      });
      return deviceInfoResult;
    } catch (err) {
      console.log("getOne auth service failed ", err);
    }
  },

  updateDeviceInfo: async (data) => {
    console.log("updateDeviceInfo", data);
    return await user_devices
      .update(data, { where: { userId: data.userId } })
      .then(async (updateResult) => {
        return updateResult.dataValues;
      })
      .catch(async (err) => {
        console.log("error", "DB error: user logout query failed.", err);
        return false;
      });
  },

  insertDeviceInfo: async (data) => {
    console.log("insertDeviceInfo", data);
    return await user_devices
      .create(data)
      .then(async (insert_result) => {
        return insert_result;
      })
      .catch(async (err) => {
        console.log("error", "DB error: sign up query failed.", err);
        return false;
      });
  },
};

// export module to use on other files
module.exports = auth;
