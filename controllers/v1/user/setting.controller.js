const userServices = require("../../../services/user.service.js");
const languageHelper = require("../../../utilities/language.utilities");
const setting = {
  /*
   * update setting
   */
  update: async (req, res) => {
    const myLang = res.locals.language;
    const userInfo = res.locals.userData;
    const constants = await languageHelper(res.locals.language);
    const isPrivate = req.body.isPrivate;
    const isFollowPrivate = req.body.isFollowPrivate;
    let userId = userInfo.id;
    let response = {};
    let data = {
      isPrivate,
      isFollowPrivate,
      userId,
      myLang,
    };
    try {
      // call login service
      let result = await userServices.setting(data);
      if (!result) {
        response.error = constants.NOT_FOUND_ERROR;
        response.errorMessage = constants.NOT_FOUND_ERROR;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }

      response.result = result;
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      return res.json(response);
    } catch (err) {
      console.log("error", "try-catch: settingController.update failed.", err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      return res.json(response);
    }
  },
};
module.exports = setting;
