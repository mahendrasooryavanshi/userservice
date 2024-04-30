
let Validator = require("validatorjs");
const languageUtility = require("../../utilities/language.utilities.js");

module.exports.emailForgotPassword = async (data) => {
  const constants = await languageUtility(data.myLang);
  var response = {
    validate: false,
  };
  var rules = {
    email: "required|email",
  };
  //var validator = new Validator(data, rules);
  var validator = new Validator(data, rules, {
    "required.email": {
      string: constants.EMAIL_REQUIRED,
    },
    "email.email": {
      string: constants.EMAIL_FORMATE,
    },
  });

  if (validator.fails()) {
    if (validator.errors.first("email")) {
      response.message = validator.errors.first("email");
    }
    return response;
  }
  response.validate = true;
  return response;
};

module.exports.moblieForgotPassword = async (data) => {
  const constants = await languageUtility(data.myLang);
  var response = {
    validate: false,
  };
  var rules = {
    countryCode: "required|min:1|max:4",
    mobileNumber: "required|min:8|max:20",
  };
  //var validator = new Validator(data, rules);
  var validator = new Validator(data, rules, {
    "required.countryCode": {
      string: constants.COUNTRY_CODE_REQUIRED,
    },
    "min.countryCode": {
      string: constants.MIN_COUNTRY_CODE_VALIDATE,
    },
    "max.countryCode": {
      string: constants.MAX_COUNTRY_CODE_VALIDATE,
    },
    "required.mobileNumber": {
      string: constants.MOBILE_NUMBER_REQUIRED,
    },
    "min.mobileNumber": {
      string: constants.MIN_MOBILE_NUMBER_VALIDATE,
    },
    "max.mobileNumber": {
      string: constants.MAX_MOBILE_NUMBER_VALIDATE,
    },
  });

  if (validator.fails()) {
    if (validator.errors.first("countryCode")) {
      response.message = validator.errors.first("countryCode");
    }
    if (validator.errors.first("mobileNumber")) {
      response.message = validator.errors.first("mobileNumber");
    }
    return response;
  }
  response.validate = true;
  return response;
};



module.exports.verifyOtp = async (data) => {
  const constants = await languageUtility(data.myLang);
  var response = {
    validate: false,
  };
  var rules = {
    token: "required",
    otp: "required|max:6",
  };
  var validator = new Validator(data, rules, {
    "required.token": {
      string: constants.TOKEN_VALIDATION,
    },
    "required.otp": {
      string: constants.OTP_REQUIRED,
    },
    "max.otp": {
      string: constants.MAX_OTP_FORMATE,
    },
  });
  if (validator.fails()) {
    if (validator.errors.first("token")) {
      response.message = validator.errors.first("token");
    } else if (validator.errors.first("otp")) {
      response.message = validator.errors.first("otp");
    }
    return response;
  }
  response.validate = true;
  return response;
};

module.exports.resendOtp = async (data) => {
  const constants = await languageUtility(data.myLang);
  var response = {
    validate: false,
  };
  var rules = {
    token: "required",
  };
  var validator = new Validator(data, rules);
  if (validator.fails()) {
    if (validator.errors.first("token")) {
      response.message = constants.TOKEN_VALIDATION;
    }
    return response;
  }
  response.validate = true;
  return response;
};

module.exports.resetPassword = async (data) => {
  const constants = await languageUtility(data.myLang);
  var response = {
    validate: false,
  };
  var rules = {
    token: "required",
    password: "required|min:6|max:100",
    confirmPassword: "required|min:6|max:100",
  };
  
  var validator = new Validator(data, rules, {
    "required.password": {
      string: constants.PASSWORD_REQUIRED,
    },
    "min.password": {
      string: constants.MIN_PASSWORD_VALIDATE,
    },
    "max.password": {
      string: constants.MAX_PASSWORD_VALIDATE,
    },
    "required.confirmPassword": {
      string: constants.CONFIRM_PASSWORD_REQUIRED,
    },
    "min.confirmPassword": {
      string: constants.MIN_CONFIRM_PASSWORD_VALIDATE,
    },
    "max.confirmPassword": {
      string: constants.MAX_CONFIRM_PASSWORD_VALIDATE,
    },
  });
  if (validator.fails()) {
    if (validator.errors.first("token")) {
      response.message = constants.TOKEN_VALIDATION;
    } else if (validator.errors.first("password")) {
      response.message = validator.errors.first("password");
    } else if (validator.errors.first("confirmPassword")) {
      response.message = validator.errors.first("confirmPassword");
    }
    return response;
  }
  response.validate = true;
  return response;
};


module.exports.changePassword = async (data) => {
  const constants = await languageUtility(data.myLang);
  var response = {
    validate: false,
  };
  var rules = {
    oldPassword: "required|min:6|max:100",
    newPassword: "required|min:6|max:100",
    confirmPassword: "required|min:6|max:100",
  };

  var validator = new Validator(data, rules, {
    "required.oldPassword": {
      string: constants.OLD_PASSWORD_REQUIRED,
    },
    "min.oldPassword": {
      string: constants.MIN_OLD_PASSWORD_VALIDATE,
    },
    "max.oldPassword": {
      string: constants.MAX_OLD_PASSWORD_VALIDATE,
    },
    "required.newPassword": {
      string: constants.NEW_PASSWORD_REQUIRED,
    },
    "min.newPassword": {
      string: constants.MIN_NEW_PASSWORD_VALIDATE,
    },
    "max.newPassword": {
      string: constants.MAX_NEW_PASSWORD_VALIDATE,
    },
    "required.confirmPassword": {
      string: constants.CONFIRM_PASSWORD_REQUIRED,
    },
    "min.confirmPassword": {
      string: constants.MIN_CONFIRM_PASSWORD_VALIDATE,
    },
    "max.confirmPassword": {
      string: constants.MAX_CONFIRM_PASSWORD_VALIDATE,
    },
  });
  if (validator.fails()) {
    if (validator.errors.first("oldPassword")) {
      response.message = validator.errors.first("oldPassword");
    } else if (validator.errors.first("newPassword")) {
      response.message = validator.errors.first("newPassword");
    }
    return response;
  }
  response.validate = true;
  return response;
}
