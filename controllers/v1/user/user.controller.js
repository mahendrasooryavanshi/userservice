const userServices = require("../../../services/user.service.js");
const languageHelper = require("../../../utilities/language.utilities");
const jwtUtility = require("../../../utilities/jwt.utilities.js");
const validators = require("../../../validators/user/user.js");
const bcrypt = require("bcrypt");
const UUID = require("uuid-int");
// require("dotenv").config();
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
const user = {
  /**
   * Forgot Password
   * @param {*} req
   * @param {*} res
   * @returns
   */
  forgotPassword: async (req, res) => {
    const myLang = res.locals.language;
    const constants = await languageHelper(res.locals.language);
    const type = req.body.type ? req.body.type : "email";
    const email = req.body.email ? req.body.email : "";
    const countryCode = req.body.countryCode ? req.body.countryCode : "";
    const mobileNumber = req.body.mobileNumber ? req.body.mobileNumber : "";
    let response = {};
    let data = {
      email,
      countryCode,
      mobileNumber,
      myLang,
    };

    if (type === "email") {
      let validatorResult = await validators.emailForgotPassword(data);
      if (!validatorResult.validate) {
        res.statusCode = constants.VALIDATION_STATUS_CODE;
        response.error = constants.VALIDATION_TYPE_ERROR;
        response.errorMessage = validatorResult.message;
        return res.json(response);
      }
    }
    if (type === "mobile") {
      let validatorResult = await validators.moblieForgotPassword(data);
      if (!validatorResult.validate) {
        res.statusCode = constants.VALIDATION_STATUS_CODE;
        response.error = constants.VALIDATION_TYPE_ERROR;
        response.errorMessage = validatorResult.message;
        return res.json(response);
      }
    }

    try {
      let where = {};
      if (type === "email") {
        where = {
          email: email,
          deletedAt: null,
        };
      } else if (type === "mobile") {
        where = {
          countryCode: countryCode,
          mobileNumber: mobileNumber,
          deletedAt: null,
        };
      }
      let result = await userServices.getOne(where);

      if (!result) {
        response.error = constants.NOT_FOUND_ERROR;
        response.errorMessage = constants.USER_NOT_FOUND;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }
      let otp = 111111;
      let hashOtp = await bcrypt.hash(`${otp}`, 10);
      let accessToken = await jwtUtility.JWTSighing(
        {
          id: result.id,
          email: result.email,
          name: result.name,
          countryCode: result.countryCode,
          mobileNumber: result.mobileNumber,
          type: "forget-password",
          otp: hashOtp,
          status: result.status,
        },
        config.FORGOT_OTP_TOKEN_EXPIRY_IN
      );
      response.token = accessToken.token;
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      return res.json(response);
    } catch (err) {
      console.log("error", "try-catch: forgetPassword.change failed.", err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.errorMessage = constants.SOMETHING_WENT_WRONG;
      return res.json(response);
    }
  },

  /**
   * Verify Otp
   * @param {*} req
   * @param {*} res
   * @returns
   */

  verifyOtp: async (req, res) => {
    const myLang = res.locals.language;
    const constants = await languageHelper(res.locals.language);
    const token = req.body.token;
    const otp = req.body.otp;
    let response = {};
    let data = {
      token,
      otp,
      myLang,
    };
    let validatorResult = await validators.verifyOtp(data);
    if (!validatorResult.validate) {
      res.statusCode = constants.VALIDATION_STATUS_CODE;
      response.error = constants.VALIDATION_TYPE_ERROR;
      response.errorMessage = validatorResult.message;
      return res.json(response);
    }
    try {
      let decode = await jwtUtility.JWTVerify(token);
      if (decode.status === false) {
        res.statusCode = 403;
        response.error = decode.err.name;
        response.errorMessage = decode.err.message;
        return res.json(response);
      }
      const Match = await bcrypt.compare(otp, decode.verify.otp);
      if (Match != true) {
        response.error = constants.NOT_FOUND_ERROR;
        response.errorMessage = constants.WRONG_OTP_MSG;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }
      response.message = constants.OTP_VERIFIED;
      response.token = token;
      return res.json(response);
    } catch (err) {
      console.log("error", "try-catch: forgetPassword verify failed.", err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.errorMessage = constants.SOMETHING_WENT_WRONG;
      return res.json(response);
    }
  },

  /**
   * Resend Otp
   * @param {*} req
   * @param {*} res
   * @returns
   */
  resendOtp: async (req, res) => {
    const myLang = res.locals.language;
    const constants = await languageHelper(res.locals.language);
    const token = req.body.token;
    let response = {};
    let data = {
      token,
      myLang,
    };
    let validatorResult = await validators.resendOtp(data);
    if (!validatorResult.validate) {
      res.statusCode = constants.VALIDATION_STATUS_CODE;
      response.error = constants.VALIDATION_TYPE_ERROR;
      response.errorMessage = validatorResult.message;
      return res.json(response);
    }
    try {
      let decode = await jwtUtility.JWTVerify(token);
      if (decode.status === false) {
        res.statusCode = 403;
        response.error = decode.err.name;
        response.errorMessage = decode.err.message;
        return res.json(response);
      }
      let otp = 123456;
      let hashOtp = await bcrypt.hash(`${otp}`, 10);
      let accessToken = await jwtUtility.JWTSighing(
        {
          id: decode.verify.id,
          email: decode.verify.email,
          name: decode.verify.name,
          countryCode: decode.verify.countryCode,
          mobileNumber: decode.verify.mobileNumber,
          type: "forget-password",
          otp: hashOtp,
          status: decode.verify.status,
        },
        config.FORGOT_OTP_TOKEN_EXPIRY_IN
      );
      response.token = accessToken.token;
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      return res.json(response);
    } catch (err) {
      console.log("error", "try-catch: forgetPassword verify failed.", err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.errorMessage = constants.SOMETHING_WENT_WRONG;
      return res.json(response);
    }
  },

  /**
   * Reset Password
   * @param {} req
   * @param {*} res
   * @returns
   */

  resetPassword: async (req, res) => {
    const myLang = res.locals.language;
    const constants = await languageHelper(res.locals.language);
    const token = req.body.token;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    let response = {};
    try {
      let data = {
        myLang,
        token,
        password,
        confirmPassword,
      };
      let validatorResult = await validators.resetPassword(data);
      if (!validatorResult.validate) {
        res.statusCode = constants.VALIDATION_STATUS_CODE;
        response.error = constants.VALIDATION_TYPE_ERROR;
        response.errorMessage = validatorResult.message;
        return res.json(response);
      }
      if (password != confirmPassword) {
        res.statusCode = constants.VALIDATION_STATUS_CODE;
        response.error = constants.VALIDATION_TYPE_ERROR;
        response.errorMessage = constants.NOT_MATCHED_PASSWORD;
        return res.json(response);
      }
      let decode = await jwtUtility.JWTVerify(token);
      if (decode.status === false) {
        res.statusCode = 403;
        response.error = decode.err.name;
        response.errorMessage = decode.err.message;
        return res.json(response);
      }
      let id = decode.verify.id;
      let hash = await bcrypt.hash(password, 10);
      let entity = {
        id: id,
        password: hash,
      };

      let result = await userServices.updatePassword(entity);
      if (!result) {
        response.error = constants.NOT_FOUND_ERROR;
        response.errorMessage = constants.NOT_FOUND_ERROR;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }
      response.message = constants.PASSPORT_UPDATED;
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      return res.json(response);
    } catch (err) {
      console.log("error", "try-catch: reset Password failed.", err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.errorMessage = constants.SOMETHING_WENT_WRONG;
      return res.json(response);
    }
  },

  /**
   * Change Password
   * @param {*} req
   * @param {*} res
   * @returns
   */
  changePassword: async (req, res) => {
    const myLang = res.locals.language;
    const constants = await languageHelper(res.locals.language);
    const userInfo = res.locals.userData;
    const oldPassword = req.body.oldPassword ? req.body.oldPassword : "";
    const newPassword = req.body.newPassword ? req.body.newPassword : "";
    const confirmPassword = req.body.confirmPassword
      ? req.body.confirmPassword
      : "";
    let response = {};
    const data = {
      oldPassword,
      newPassword,
      confirmPassword,
      myLang,
    };
    let validatorResult = await validators.changePassword(data);
    if (!validatorResult.validate) {
      res.statusCode = constants.VALIDATION_STATUS_CODE;
      response.error = constants.VALIDATION_TYPE_ERROR;
      response.errorMessage = validatorResult.message;
      return res.json(response);
    }

    try {
      let userData = await userServices.getOne({
        public_id: userInfo.id,
        deletedAt: null,
      });
      const match = await bcrypt.compare(oldPassword, userData.password);
      if (!match) {
        response.errorMessage = constants.OLD_PASS_NOT_MATCH;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }

      if (newPassword != confirmPassword) {
        res.statusCode = constants.VALIDATION_STATUS_CODE;
        response.error = constants.VALIDATION_TYPE_ERROR;
        response.errorMessage = constants.NOT_MATCHED_PASSWORD;
        return res.json(response);
      }

      let password = bcrypt.hashSync(newPassword.trim(), 10);
      let updateData = {
        id: userData.id,
        password: password,
      };
      await userServices.updatePassword(updateData);
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      response.message = constants.CHANGE_PASSWORD_SUCCESS;
      return res.json(response);
    } catch (err) {
      console.log(
        "error",
        "try-catch: user controller change password failed.",
        err
      );
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.errorMessage = constants.SOMETHING_WENT_WRONG;
      return res.json(response);
    }
  },

  /**
   * User Detail
   * @param {*} req
   * @param {*} res
   * @returns
   **/
  userDetail: async (req, res) => {
    const myLang = res.locals.language;
    let userInfo = res.locals.userData;
    const constants = await languageHelper(res.locals.language);
    const userId = req.params.userId ? req.params.userId : "";
    let response = {};
    let data = {
      userId,
      myLang,
    };

    try {
      let fromData = await userServices.getOne({
        publicId: userInfo.id,
        deletedAt: null,
      });

      data.fromId = fromData.id;

      let result = await userServices.details(data);
      console.log("result", result);
      if (!result) {
        response.error = constants.NOT_FOUND_ERROR;
        response.errorMessage = constants.USER_ID_NOT_EXIST;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }

      let followStatus = 0;
      let blockStatus = 0;
      if (result.myFollowing) {
        let followData = result.myFollowing.dataValues;
        if (followData.status === "accepted") {
          followStatus = 1;
        } else if (followData.status === "pending") {
          followStatus = 2;
        }
      }
      if (result.isBlocked) {
        blockStatus = 1;
      }
      result.id = result.publicId;
      result.isFollow = followStatus;
      result.isBlocked = blockStatus;
      if (result.isPrivate === "private") {
        result.isPrivate = 1;
      } else {
        result.isPrivate = 0;
      }
      delete result.publicId;
      delete result.myFollowing;
      response.result = result;
      // res.statusCode = constants.SUCCESS_STATUS_CODE;
      return res.json(response);
    } catch (err) {
      console.log("error", "try-catch: userController.details failed.", err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.errorMessage = constants.SOMETHING_WENT_WRONG;
      return res.json(response);
    }
  },
};
module.exports = user;
