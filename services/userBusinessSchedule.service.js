const connection = require("../models");
const { sequelize, Sequelize } = connection;
const { QueryTypes } = require("sequelize");
const { Op } = Sequelize;
const Models = sequelize.models;
const {
  user_business_schedule,
} = Models;

const userBusinessSchedule = {
  createUserBusinessSchedule: async (data) => {
    return await user_business_schedule.bulkCreate(data)
      .then(async (insert_result) => {
        return insert_result;
      })
      .catch(async (err) => {
        console.log("error", "DB error: userBusinessScheduleService query failed.", err);
        return false;
      });
  },
};

// export module to use on other files
module.exports = userBusinessSchedule;
