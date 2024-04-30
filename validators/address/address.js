
let Validator = require("validatorjs");
const languageUtility = require("../../utilities/language.utilities.js");


module.exports.addAddress = async (data) => {
  const constants = await languageUtility(data.myLang);
  var response = {
    validate: false,
  };
  var rules = {
    addressLine1: "required|max:255",
    country: "required|max:255",
    state: "required|max:255",
    city: "required|max:255",
    zipCode: "required|max:255",
    lat: "required",
    long:"required"
  };
  //var validator = new Validator(data, rules);
  var validator = new Validator(data, rules, {
    "required.addressLine1": {
      string: constants.ADDRESS_LINE_1_REQUIRED,
    },
    "required.country": {
      string: constants.COUNTRY_REQUIRED,
    },
    "required.state": {
      string: constants.STATE_REQUIRED,
    },
    "required.city": {
      string: constants.CITY_REQUIRED,
    },
    "required.zipCode": {
      string: constants.ZIPCODE_REQUIRED,
    },
    "required.lat": {
      string: constants.LAT_REQUIRED,
    },
    "required.long": {
      string: constants.LONG_REQUIRED,
    },
  });

  if (validator.fails()) {
    if (validator.errors.first("addressLine1")) {
      response.message = validator.errors.first("addressLine1");
    }
    if (validator.errors.first("country")) {
      response.message = validator.errors.first("country");
    }
    if (validator.errors.first("state")) {
      response.message = validator.errors.first("state");
    }
    if (validator.errors.first("city")) {
      response.message = validator.errors.first("city");
    }
    if (validator.errors.first("zipCode")) {
      response.message = validator.errors.first("zipCode");
    }
    if (validator.errors.first("lat")) {
      response.message = validator.errors.first("lat");
    }
    if (validator.errors.first("long")) {
      response.message = validator.errors.first("long");
    }
    return response;
  }
  response.validate = true;
  return response;
};



