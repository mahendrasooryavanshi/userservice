const connection = require("../models");
const { sequelize, Sequelize } = connection;
const { Op } = Sequelize;
const Models = sequelize.models;
const { temp_users } = Models;
const userTempService = {
  create: async (data) => {
    try {
      return await temp_users.create(data);
    } catch (error) {
      console.log(error, "try-catch error occurred");
      return false;
    }
  },
  emailExist: async (data) => {
    try {
      return await temp_users.findOne({
        where: { email: data.email },
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  mobileNumberExist: async (data) => {
    try {
      return await temp_users.findOne({
        where: {
          countryCode: data.countryCode,
          mobileNumber: data.mobileNumber,
        },
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  getOne: async (data) => {
    const userResult = await temp_users.findOne({
      where: data,
    });
    if (userResult === null) {
      return false;
    } else {
      return userResult.dataValues;
    }
  },
  deleteByEmail: async (email) => {
    const userResult = await temp_users
      .destroy({
        where: { email: email },
      })
      .then(async (updateResult) => {
        return updateResult.dataValues;
      })
      .catch(async (err) => {
        console.log(
          "error",
          "DB error: delete temp  user info query failed.",
          err
        );
        return false;
      });
  },
};
module.exports = userTempService;
