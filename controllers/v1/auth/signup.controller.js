const languageHelper = require("../../../utilities/language.utilities.js");
const validators = require("../../../validators/auth/signup.js");
const userTempService = require("../../../services/userTemp.service.js");
const jwtAuth = require("../../../utilities/jwt.utilities.js");
const secretJson = require("../../../secret.json");
const config = require("../../../config/config.json")[secretJson.ENVIRONMENT];
const UUID = require("uuid-int");
const bcrypt = require("bcrypt");
const moment = require("moment");

let randomNumber = Math.floor(Math.random() * 500 + 1);
const generator = UUID(randomNumber);
const signUp = {
  /*
   **
   **   signup
   */

  index: async (req, res) => {
    const constants = await languageHelper(res.locals.language);
    const myLang = res.locals.language;
    let publicId = generator.uuid();
    let name = req.body.name ? req.body.name.trim().toLowerCase() : "";
    const email = req.body.email ? req.body.email.trim().toLowerCase() : "";
    const password = req.body.password ? req.body.password : "";

    const mobileNumber = req.body.mobileNumber ? req.body.mobileNumber : "";
    const countryCode = req.body.countryCode ? req.body.countryCode : "";
    const deviceType = req.body.deviceType ? req.body.deviceType : "web";
    const deviceId = req.body.deviceId ? req.body.deviceId : null;
    const notificationId = req.body.notificationId
      ? req.body.notificationId
      : null;
    const buildNumber = req.body.buildNumber ? req.body.buildNumber : null;
    const apiVersion = req.body.apiVersion ? req.body.apiVersion : null;
    const insertRole = req.body.userType ? req.body.userType : "user";
    const isBusiness = req.body.isBusiness ? req.body.isBusiness : 0;
    const type = req.body.type ? req.body.type : "email";
    const image = req.body.image ? req.body.image : null;
    const businessName = req.body.businessName ? req.body.businessName : "";
    const businessEmail = req.body.businessEmail
      ? req.body.businessEmail
      : null;
    const businessMobileNumber = req.body.businessMobileNumber
      ? req.body.businessMobileNumber
      : null;
    const businessCountryCode = req.body.businessCountryCode
      ? req.body.businessCountryCode
      : null;
    const websiteLink = req.body.websiteLink ? req.body.websiteLink : null;
    const businessHour = req.body.businessHour ? req.body.businessHour : null;
    const businessAddress = req.body.businessAddress
      ? req.body.businessAddress
      : "";
    const lat = req.body.lat ? req.body.lat : "";
    const long = req.body.long ? req.body.long : "";

    // let user_name = name;
    // if (user_name) {
    //   user_name = user_name.toLowerCase().trim();
    //   user_name = user_name.replace(/ /g, "");
    //   let firstChar = user_name.charAt(0);
    //   if (firstChar != "@") {
    //     name = "@" + user_name;
    //   }
    // }

    // let verifyOtp = Math.floor(Math.random() * 500000 + 1);

    const verifyOtp = 111111;
    let response = {};
    let data = {
      myLang,
      name,
      email,
      password,
      mobileNumber,
      countryCode,
      image: image,
    };

    // check if insertRole not a user then token have role to make user
    // if (insertRole != "user") {
    //   let noPermission = false;
    //   if (res.locals.userData && Array.isArray(res.locals.userData.role)) {
    //     if (myRole.includes["user.create"]) {
    //       noPermission = true;
    //     }
    //   }
    //   if (!noPermission) {
    //     response.error = constants.PERMISSION_ERROR;
    //     response.errorMessage = constants.PERMISSION_ERROR_DESCRIPTION;
    //     return res.json(response);
    //   }
    // }

    let validatorResult = await validators.signup(data);

    if (!validatorResult.validate) {
      res.statusCode = constants.VALIDATION_STATUS_CODE;
      response.error = constants.VALIDATION_TYPE_ERROR;
      response.errorMessage = validatorResult.message;

      return res.json(response);
    }
    try {
      // check user existence in temp_user model
      let EmailExistResult = await userTempService.emailExist(data);
      if (EmailExistResult) {
        response.error = constants.DUPLICATE_ACCOUNT_EXIST_ERROR;
        response.errorMessage = constants.DUPLICATE_EMAIL_EXIST;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }

      let mobileNumberExist = await userTempService.mobileNumberExist(data);
      if (mobileNumberExist) {
        response.error = constants.DUPLICATE_ACCOUNT_EXIST_ERROR;
        response.errorMessage = constants.DUPLICATE_NUMBER_EXIST;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }
      //make a object to insert
      let hashedPassword = await bcrypt.hash(password, 10);
      let hashedVerifyOtp = await bcrypt.hash(verifyOtp.toString(), 10);

      let insertData = {
        email,
        name,
        password: hashedPassword,
        verifyOtp: hashedVerifyOtp,
        mobileNumber,
        countryCode,
        type: insertRole,
        image: image,
      };
      if (isBusiness == 1) {
        // insertRole = "business";
        insertData = {
          ...insertData,
          lat,
          long,
          isBusiness,
          businessName,
          businessEmail,
          businessAddress,
          businessMobileNumber,
          businessCountryCode,
          websiteLink,
          businessHour,
        };
        let validatorSignupBusiness = await validators.signupBusiness(
          insertData
        );
        if (!validatorSignupBusiness.validate) {
          res.statusCode = constants.VALIDATION_STATUS_CODE;
          response.error = constants.VALIDATION_TYPE_ERROR;
          response.errorMessage = validatorSignupBusiness.message;
          return res.json(response);
        }
      }

      let signupTempResult = await userTempService.create(insertData);
      if (!signupTempResult) {
        response.error = constants.SOMETHING_WENT_WRONG_TYPE;
        response.errorMessage = constants.SOMETHING_WENT_WRONG;
        res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
        return res.json(response);
      }

      // make access token in seconds
      let expiresAt = parseInt(
        moment()
          .add(config.VERIFICATION_TOKEN_EXPIRY_IN, "seconds")
          .utc()
          .valueOf() / 1000
      );

      const verifyToken = {
        id: signupTempResult.id,
        name: name,
        email: email,
        countryCode: signupTempResult.countryCode,
        mobileNumber: signupTempResult.mobileNumber,
        otp: signupTempResult.verifyOtp,
        isBusiness: isBusiness,
        userType: type,
        role: [],
        deviceId: deviceId,
        notificationId: notificationId,
        expireAt: expiresAt,
        deviceType: deviceType,
        deviceId: deviceId,
        buildNumber: buildNumber,
        apiVersion: apiVersion,
        type: "Bearer",
        permissions: [],
      };

      let verifyTokenInfo = await jwtAuth.JWTSighing(
        verifyToken,
        config.VERIFICATION_TOKEN_EXPIRY_IN
      );

      if (!verifyTokenInfo.status) {
        response.error = constants.SOMETHING_WENT_WRONG_TYPE;
        response.errorMessage = constants.SOMETHING_WENT_WRONG;
        res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
        return res.json(response);
      }

      // const tempId = config.FORGOT;
      const message = {
        to: signupTempResult.email,
        subject: "Verify Your Email",
        otp: verifyOtp,
        // templateId: tempId,
      };
      // if (process.env.MAIL_STATUS == 1) {
      //   mail
      //     .Mail(message)
      //     .then((res) => console.log("Email sent....."))
      //     .catch((error) => console.log(error.message));
      // }
      response.accessToken = verifyTokenInfo.token;
      response.tokenType = verifyToken.type;
      response.expireAt = expiresAt;
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      return res.json(response);
    } catch (err) {
      console.log("error", "try-catch: signupController.signIn failed.", err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.error = constants.SOMETHING_WENT_WRONG_TYPE;
      response.errorMessage = constants.SOMETHING_WENT_WRONG;
      return res.json(response);
    }
  },
};
module.exports = signUp;
