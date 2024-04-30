let Validator = require("validatorjs");
const languageUtility = require("../../utilities/language.utilities.js");

const validators = {
  /**
   * signup
   */
  signup: async (data) => {
    const constants = await languageUtility(data.myLang);
    var response = {
      validate: false,
    };
    var rules = {
      email: "required|email",
      password: "required|min:8|max:50",
      name: "required|min:2|max:255",
      mobileNumber: "required|min:10|max:15",
      countryCode: "required|min:1|max:3",
    };
    let validator = new Validator(data, rules);
    // let validator = new Validator(data, rules, {
    //   "required.email": {
    //     string: constants.EMAIL_REQUIRED,
    //   },
    //   "email.email": {
    //     string: constants.EMAIL_FORMATE,
    //   },
    //   "required.password": {
    //     string: constants.PASSWORD_REQUIRED,
    //   },
    //   "min.password": {
    //     string: constants.MIN_PASSWORD_VALIDATE,
    //   },
    //   "max.password": {
    //     string: constants.MAX_PASSWORD_VALIDATE,
    //   },
    //   "required.name": {
    //     string: constants.USERNAME_REQUIRED,
    //   },
    //   "required.mobileNumber": {
    //     string: constants.MOBILE_NUMBER_REQUIRED,
    //   },
    //   "required.countryCode": {
    //     string: constants.COUNTRY_CODE_REQUIRED,
    //   },
    // });
    // console.log(validator, "_______validator");
    if (validator.fails()) {
      if (validator.errors.first("email")) {
        response.message = validator.errors.first("email");
      } else if (validator.errors.first("password")) {
        response.message = validator.errors.first("password");
      } else if (validator.errors.first("name")) {
        response.message = validator.errors.first("name");
      } else if (validator.errors.first("mobileNumber")) {
        response.message = validator.errors.first("mobileNumber");
      } else if (validator.errors.first("countryCode")) {
        response.message = validator.errors.first("countryCode");
      }
    }
    response.validate = true;
    return response;
  },
  /**
   * signup if isBusiness is true
   */
  signupBusiness: async (data) => {
    const constants = await languageUtility(data.myLang);
    var response = {
      validate: false,
    };
    var rules = {
      businessName: "required|min:2|max:255",
      businessHour: "required",
      businessAddress: "required",
      businessEmail: "email",
      businessCountryCode: "min:1|max:3",
      businessMobileNumber: "min:10|max:15",
      websiteLink: "min:8|max:255",
      lat: "required",
      long: "required",
    };
    var validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("businessName")) {
        response.message = validator.errors.first("businessName");
      } else if (validator.errors.first("businessHour")) {
        response.message = validator.errors.first("businessHour");
      } else if (validator.errors.first("businessAddress")) {
        response.message = validator.errors.first("businessAddress");
      } else if (validator.errors.first("websiteLink")) {
        response.message = validator.errors.first("websiteLink");
      } else if (validator.errors.first("businessEmail")) {
        response.message = validator.errors.first("businessEmail");
      } else if (validator.errors.first("businessCountryCode")) {
        response.message = validator.errors.first("businessCountryCode");
      } else if (validator.errors.first("businessMobileNumber")) {
        response.message = validator.errors.first("businessMobileNumber");
      } else if (validator.errors.first("lat")) {
        response.message = validator.errors.first("lat");
      } else if (validator.errors.first("long")) {
        response.message = validator.errors.first("long");
      }
      return response;
    }
    response.validate = true;
    return response;
  },
  verify: async (data) => {
    const constants = await languageUtility(data.myLang);
    var response = {
      validate: false,
    };
    var rules = {
      // platform: "required",
      otp: "required",
    };
    let validator = new Validator(data, rules, {
      "required.otp": {
        string: constants.OTP_REQUIRED,
      },
      // "required.platform": {
      //   string: constants.PLATFORM_REQUIRED,
      // },
    });
    if (validator.fails()) {
      if (validator.errors.first("otp")) {
        response.message = validator.errors.first("otp");
      }
      // else if (validator.errors.first("platform")) {
      //   response.message = validator.errors.first("platform");
      // }
      return response;
    }
    response.validate = true;

    return response;
  },
  /**
   * googleLogin
   */
  googleLogin: async (data) => {
    const constants = await languageUtility(data.myLang);
    var response = {
      validate: false,
    };
    var rules = {
      accessToken: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("accessToken")) {
        response.message = constants.GOOGLE_TOKEN_REQUIRED;
      }
      return response;
    }
    response.validate = true;
    return response;
  },
  /**
   * facebookLogin
   */
  facebookLogin: async (data) => {
    const constants = await languageUtility(data.myLang);
    var response = {
      validate: false,
    };
    var rules = {
      accessToken: "required",
    };
    let validator = new Validator(data, rules);
    if (validator.fails()) {
      if (validator.errors.first("accessToken")) {
        response.message = constants.FACEBOOK_TOKEN_REQUIRED;
      }
      return response;
    }
    response.validate = true;
    return response;
  },
};

// export module to use it on other files
module.exports = validators;
