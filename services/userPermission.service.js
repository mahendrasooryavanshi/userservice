const connection = require("../models");
const sequelize = connection.sequelize;
const Models = sequelize.models;
const { user_permission } = Models;

const userPermissionServices = {
  create: async (data) => {
    return await user_permission
      .create(data)
      .then(async (insert_result) => {
        return insert_result;
      })
      .catch(async (err) => {
        console.log(
          "error",
          "DB error: user permission create  query failed.",
          err
        );
        return false;
      });
  },
};

// export module to use on other files
module.exports = userPermissionServices;
