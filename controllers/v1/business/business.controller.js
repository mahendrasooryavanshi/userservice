const businessServices = require("../../../services/business.service");
const languageHelper = require("../../../utilities/language.utilities");
const { Op } = require("sequelize");
const secretJson = require("../../../secret.json");
const config = require("../../../config/config.json")[secretJson.ENVIRONMENT];
let otp = Math.floor(Math.random() * 500000 + 1);

//let aws = require("aws-sdk");
// aws.config.update({
//   secretAccessKey: config.SECRET_ACCESS_KEY,
//   accessKeyId: config.ACCESS_KEY,
//   region: config.S3_REGION,
//   signatureVersion: "v4",
// });
const business = {
  businessProfile: async (req, res) => {
    const myLang = res.locals.language;
    const constants = await languageHelper(res.locals.language);
    const userInfo = res.locals.userData;
    const id = req.body.userId;
    const type = req.body.type;
    let response = {};
    try {
      let userId = userInfo.id;
      if (id) {
        userId = id;
      }
      let profile = await businessServices.businessDetail({
        id: userId,
        type: type,
      });
      response.result = profile;
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      return res.json(response);
    } catch (err) {
      console.log("try-catch: profileData remove controller failed.", err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.errorMessage = constants.SOMETHING_WENT_WRONG;
      return res.json(response);
    }
  },
};
module.exports = business;
