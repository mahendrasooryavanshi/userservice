const { min } = require("moment");
let Validator = require("validatorjs");
const languageUtility = require("../../utilities/language.utilities.js");
const validators = {
  /**
   * Email Login validation
   * @param { } data 
   * @returns 
   */
  emailLogin: async (data) => {
    const constants = await languageUtility(data.myLang);
    var response = {
      validate: false,
    };
    var rules = {
      email: "required|email",
      password: "required|min:6|max:50",
    };
    var validator = new Validator(data, rules, {
      "required.email": {
        string: constants.EMAIL_REQUIRED,
      },
      "email.email": {
        string: constants.EMAIL_REQUIRED,
      },
      "min.password": {
        string: constants.MIN_PASSWORD_VALIDATE,
      },
      "max.password": {
        string: constants.MAX_PASSWORD_VALIDATE,
      },
      "required.password": {
        string: constants.PASSWORD_REQUIRED,
      },
     
    });
    if (validator.fails()) {
      if (validator.errors.first("email")) {
        response.message = validator.errors.first("email");
      } else if (validator.errors.first("password")) {
        response.message = validator.errors.first("password");
      } 
      return response;
    }
    response.validate = true;
    return response;
  },

  mobileLogin: async (data) => {
    const constants = await languageUtility(data.myLang);
    var response = {
      validate: false,
    };
    var rules = {
      countryCode: "required",
      mobileNumber: "required",
      password: "required|min:6|max:50",
    };
    var validator = new Validator(data, rules, {
      "required.countryCode": {
        string: constants.EMAIL_REQUIRED,
      },
      "required.mobileNumber": {
        string: constants.EMAIL_REQUIRED,
      },
      "min.password": {
        string: constants.MIN_PASSWORD_VALIDATE,
      },
      "max.password": {
        string: constants.MAX_PASSWORD_VALIDATE,
      },
      "required.password": {
        string: constants.PASSWORD_REQUIRED,
      },
     
    });
    if (validator.fails()) {
      if (validator.errors.first("countryCode")) {
        response.message = validator.errors.first("countryCode");
      } else if (validator.errors.first("password")) {
        response.message = validator.errors.first("password");
      } else if(validator.errors.first("mobileNumber")) {
        response.message = validator.errors.first("mobileNumber");
      }
      return response;
    }
    response.validate = true;
    return response;
  },
};

// export module to use it on other files
module.exports = validators;
