const languageUtility = require("./../../../utilities/language.utilities.js");
const socialServices = require("./../../../services/social.service");
const userServices = require("./../../../services/user.service");
const validators = require("./../../../validators/auth/social");
const UUID = require("uuid-int");

const socialUpdate = {
  /*
   * request list
   */
  index: async (req, res) => {
    let myLang = res.locals.language;
    const constants = await languageUtility(res.locals.language);
    const platform = req.body.platform ? req.body.platform : "";
    const link = req.body.link ? req.body.link : "";
    let userId = res.locals.userData.id;
    let randomNumber = Math.floor(Math.random() * 500 + 1);
    const generator = UUID(randomNumber);
    const publicId = generator.uuid();
    let response = {};
    let data = {
      platform,
      link,
      myLang,
    };

    // check validation error
    let validatorResult = await validators.create(data);
    if (!validatorResult.validate) {
      res.statusCode = constants.VALIDATION_STATUS_CODE;
      response.error = constants.VALIDATION_TYPE_ERROR;
      response.errorMessage = validatorResult.message;
      return res.json(response);
    }
    try {
      let userData = await userServices.getOne({
        publicId: userId,
      });
      userId = userData.id;
      let insertData = {
        publicId,
        userId,
        platform,
        link,
      };
      let result = await socialServices.create(insertData);
      if (!result) {
        response.error = constants.SOMETHING_WENT_WRONG_TYPE;
        response.errorMessage = constants.SOMETHING_WENT_WRONG;
        res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
        return res.json(response);
      }

      response.message = "Success";
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      return res.json(response);
    } catch (err) {
      console.log("error", "try-catch: socialController.create failed.", err);
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      return res.json(response);
    }
  },
};
module.exports = socialUpdate;
