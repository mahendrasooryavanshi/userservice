const userAddressServices = require("../../../services/userAddress.service");
const userServices = require("./../../../services/user.service.js");
const languageHelper = require("../../../utilities/language.utilities");
const jwtUtility = require("../../../utilities/jwt.utilities.js");
const validators = require("../../../validators/address/address.js");

const UUID = require("uuid-int");
// require("dotenv").config();
const { Op } = require("sequelize");
const secretJson = require("../../../secret.json");
const config = require("../../../config/config.json")[secretJson.ENVIRONMENT];
let randomNumber = Math.floor(Math.random() * 500 + 1);
const generator = UUID(randomNumber);


const address = {
  addAddress: async (req, res) => {
    const myLang = res.locals.language;
    const constants = await languageHelper(res.locals.language);
    const tokenInfo = res.locals.userData;
    const addressLine1 = req.body.addressLine1 ? req.body.addressLine1 : '';
    const addressLine2 = req.body.addressLine2 ? req.body.addressLine2 :'';
    const country = req.body.country ? req.body.country : '';
    const state = req.body.state ? req.body.state : '';
    const city = req.body.city ? req.body.city : '';
    const zipCode = req.body.zipCode ? req.body.zipCode : '';
    const lat = req.body.lat ? req.body.lat : '';
    const long = req.body.long ? req.body.long : ''; 
    let response = {};
    let data = {
      addressLine1,
      addressLine2,
      country,
      state,
      city,
      zipCode,
      lat, 
      long,
      myLang,
    };
    let validatorResult = await validators.addAddress(data);
    if (!validatorResult.validate) {
      res.statusCode = constants.VALIDATION_STATUS_CODE;
      response.error = constants.VALIDATION_TYPE_ERROR;
      response.errorMessage = validatorResult.message;
      return res.json(response);
    }
    
    let userData = await userServices.getOne({
      public_id: tokenInfo.id,
      deletedAt: null,
    });
    
    let payload = {
      publicId: generator.uuid(),
      userId: userData.id,
      addressLine1,
      addressLine2,
      country, 
      state,
      city,
      zipCode,
      lat,
      long
    }
    try {
      let address = await userAddressServices.addAddress(payload);
      res.statusCode = constants.CREATE_STATUS_CODE;
      response.message = constants.ADD_ADDRESS_SUCCESS;
      response.result = address;
      return res.json(response);
    } catch (err) {
      console.log("error", "try-catch: user address controller failed.", err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.errorMessage = constants.SOMETHING_WENT_WRONG;
      return res.json(response);
    }

  },
};
module.exports = address;
