const connection = require("../models");
const { sequelize, Sequelize } = connection;
const { Op } = Sequelize;
const Models = sequelize.models;
const { user_gallery } = Models;
/*twe 
code start
*/
const userGallery = {
  create: async (data) => {
    // console.log(data, "________________-gallary");

    return await user_gallery
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

  getOne: async (data) => {
    const userFollowResult = await user_gallery.findOne(data);
    if (userFollowResult === null) {
      return false;
    } else {
      return userFollowResult.dataValues;
    }
  },

  update: async (data, entity) => {
    return await user_gallery
      .update(entity, { where: data })
      .then(async (updateResult) => {
        return updateResult.dataValues;
      })
      .catch(async (err) => {
        console.log("error", "DB error: update Status   query failed.", err);
        return false;
      });
  },
  delete: async (data) => {
    try {
      const userResult = await user_gallery.destroy({ where: data });
      return userResult;
    } catch (err) {
      console.log("createUserMeta service failed");
    }
  },
};

// export module to use on other files
module.exports = userGallery;
