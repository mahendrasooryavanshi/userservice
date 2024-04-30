let Validator = require("validatorjs");
const languageUtility = require("../../utilities/language.utilities.js");

const validators = {
  /* follow */
  followValidate: async (data) => {
    const constants = await languageUtility(data.myLang);
    var response = {
      validate: false,
    };
    var rules = {
      userId: "required",
    };
    var validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("userId")) {
        response.message = constants.USER_ID_REQUIRED;
      }
      return response;
    }
    response.validate = true;
    return response;
  },

  /* unFollow */
  unFollowValidate: async (data) => {
    const constants = await languageUtility(data.myLang);
    var response = {
      validate: false,
    };
    var rules = {
      userId: "required",
      type: ["required", { in: ["follower", "following"] }],
    };
    var validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("userId")) {
        response.message = constants.USER_ID_REQUIRED;
      } else if (validator.errors.first("type")) {
        response.message = validator.errors.first("type");
      }
      return response;
    }
    response.validate = true;
    return response;
  },

  /*  accept reject and block status update */
  acceptRejectValidate: async (data) => {
    const constants = await languageUtility(data.myLang);
    var response = {
      validate: false,
    };
    var rules = {
      userId: "required",
      status: ["required", { in: ["accepted", "rejected"] }],
    };
    var validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("userId")) {
        response.message = constants.USER_ID_REQUIRED;
      }
      if (validator.errors.first("status")) {
        response.message = validator.errors.first("status");
      }
      return response;
    }
    response.validate = true;
    return response;
  },

  blockedValidate: async (data) => {
    const constants = await languageUtility(data.myLang);
    var response = {
      validate: false,
    };
    var rules = {
      userId: "required",
      status: ["required", { in: ["blocked"] }],
    };
    var validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("userId")) {
        response.message = constants.USER_ID_REQUIRED;
      }
      if (validator.errors.first("status")) {
        response.message = validator.errors.first("status");
      }
      return response;
    }
    response.validate = true;
    return response;
  },

  /*  list */
  listValidate: async (data) => {
    const constants = await languageUtility(data.myLang);
    var response = {
      validate: false,
    };
    var rules = {
      limit: "required|integer|max:100",
    };
    var validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("limit")) {
        response.message = validator.errors.first("limit");
      }
      return response;
    }
    response.validate = true;
    return response;
  },
};

module.exports = validators;
