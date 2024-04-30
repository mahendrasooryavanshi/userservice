const connection = require("../models");
const { sequelize, Sequelize } = connection;
const { QueryTypes } = require("sequelize");
const { Op } = Sequelize;
const Models = sequelize.models;

const {
  user_address,
} = Models;

const userAddress = {
  addAddress: async (data) => {
    return await user_address.create(data)
      .then(async (insert_result) => {
        return insert_result;
      })
      .catch(async (err) => {
        console.log("error", "DB error: userAddressService query failed.", err);
        return false;
      });
  },
};

// export module to use on other files
module.exports = userAddress;
