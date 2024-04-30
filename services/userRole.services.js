const bcrypt = require("bcrypt");
const connection = require("../models");
const sequelize = connection.sequelize;
const Models = sequelize.models;
const { user_role } = Models;

const userRoleServices = {
  create: async (data) => {
    return await user_role
      .create(data)
      .then(async (insert_result) => {
        return insert_result.dataValues;
      })
      .catch(async (err) => {
        console.log("error", "DB error: user role create  query failed.", err);
        return false;
      });
  },
};

// export module to use on other files
module.exports = userRoleServices;
