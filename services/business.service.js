const connection = require("../models");
const { sequelize, Sequelize } = connection;
const { QueryTypes } = require("sequelize");
const { Op } = Sequelize;
const Models = sequelize.models;
const bcrypt = require("bcrypt");
let moment = require("moment");
const {
  business,
  users,
  user_business_schedule,
  user_gallery,
  user_reviews,
  user_review_history,
} = Models;

const businessService = {
  createBussess: async (data) => {
    return await business
      .create(data)
      .then(async (insert_result) => {
        return insert_result;
      })
      .catch(async (err) => {
        console.log("error", "DB error: business service query failed.", err);
        return false;
      });
  },

  businessDetail: async (data) => {
    try {
      let result = await users.findOne({
        where: { publicId: data.id },
        attributes: [
          ["public_id", "id"],
          "name",
          "email",
          "countryCode",
          "mobileNumber",
          "isBusiness",
          "type",
          "total_followers",
          "total_following",
          "status",
          "createdAt",
        ],
        include: [
          {
            model: business,
            as: "business",
            attributes: [
              ["public_id", "id"],
              "userId",
              "businessName",
              "businessAddress",
              "lat",
              "long",
              "businessEmail",
              "countryCode",
              "mobileNumber",
              "websiteLink",
              "about",
              "additionalInfo",
              "status",
              "createdAt",
            ],
          },
          {
            model: user_business_schedule,
            as: "userBusinessSchedule",
            attributes: [
              ["public_id", "id"],
              "userId",
              "day",
              "openTime",
              "closeTime",
              "schedule",
              "isOpen",
              "createdAt",
            ],
          },
          {
            model: user_gallery,
            as: "userGallery",
            attributes: [
              ["public_id", "id"],
              "userId",
              "type",
              "image",
              "status",
              "createdAt",
            ],
          },
          {
            model: user_reviews,
            as: "userReviews",
            attributes: [
              ["public_id", "id"],
              "userId",
              "isAnonymous",
              "createdAt",
            ],
            include: [
              {
                model: user_review_history,
                as: "userReviewHistory",
                attributes: [
                  "id",
                  "userId",
                  "user_review_id",
                  "type",
                  "title",
                  "createdAt",
                ],
              },
            ],
          },
          // {
          //   model: user_meta,
          //   as: "resume",
          //   where: { metaKey: "cvv" },
          //   attributes: [
          //     ["public_id", "id"],
          //     "userId",
          //     "metaKey",
          //     "metaValue",
          //     "createdAt",
          //   ],
          //   required: false,
          // },
        ],
      });
      return result;
    } catch (err) {
      console.log("userProfileService findProfile profile query failed.", err);
      return false;
    }
  },
};

// export module to use on other files
module.exports = businessService;
