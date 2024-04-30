const connection = require("../models");
const { sequelize, Sequelize } = connection;
const { Op } = Sequelize;
const Models = sequelize.models;

const { roles, role_permission } = Models;
const roleServices = {
  getAll: async (data) => {
    const roleData = await roles.findAll({
      where: { email: data.email, deletedAt: null },
      attributes: ["id", "publicId", "title"],
      include: [
        {
          model: role_permission,
          as: "rolePermission",
          attributes: ["roleId"],
        },
      ],
    });
    if (roleData === null) {
      return [];
    } else {
      return roleData.dataValues;
    }
  },
  getOne: async (data) => {
    const roleResult = await roles.findOne({
      where: { title: data.title },
      // attributes: ["id", "title"],
      // attributes: ["id", "publicId", "title"],
      include: [
        {
          model: role_permission,
          as: "rolePermission",
          // attributes: ["roleId"],
        },
      ],
    });
    if (roleResult) {
      return roleResult;
    }
    return null;
  },
};
module.exports = roleServices;
