const jwtUtility = require("./../../../utilities/jwt.utilities.js");
const languageUtility = require("./../../../utilities/language.utilities.js");
const moment = require("moment");
const userServices = require("./../../../services/auth.service.js");
const userDetail = require("./../../../services/user.service.js");
const validators = require("./../../../validators/auth/login");
const UUID = require("uuid-int");
const bcrypt = require("bcrypt");
const secretJson = require("../../../secret.json");
const config = require("../../../config/config.json")[secretJson.ENVIRONMENT];
const AWS = require("aws-sdk");
//const sqs = new AWS.SQS({ region: config.S3_REGION });

let randomNumber = Math.floor(Math.random() * 500 + 1);
const generator = UUID(randomNumber);
let publicId = generator.uuid();

const login = {
  /*
  
   */
  index: async (req, res) => {
    const myLang = res.locals.language;
    const constants = await languageUtility(res.locals.language);
    const type = req.body.type ? req.body.type : "email";
    const email = req.body.email ? req.body.email.trim().toLowerCase() : "";
    const countryCode = req.body.countryCode ? req.body.countryCode : "";
    const mobileNumber = req.body.mobileNumber ? req.body.mobileNumber : "";
    const password = req.body.password ? req.body.password : "";
    const deviceType = req.body.deviceType ? req.body.deviceType : "";
    const deviceId = req.body.deviceId ? req.body.deviceId : null;
    const apiVersion = req.body.apiVersion ? req.body.apiVersion : null;
    const buildNumber = req.body.buildNumber ? req.body.buildNumber : null;
    const notificationId = req.body.notificationId
      ? req.body.notificationId
      : null;
    const ipAddress =
      req.header("x-forwarded-for") || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];

    let userInfo = {};
    let userRole = [];
    let userPermission = [];

    let response = {};
    let data = {
      email,
      countryCode,
      mobileNumber,
      password,
      deviceType,
      deviceId,
      myLang,
    };

    // check email validation error
    if (type === "email") {
      let validatorResult = await validators.emailLogin(data);
      if (!validatorResult.validate) {
        res.statusCode = constants.VALIDATION_STATUS_CODE;
        response.error = constants.VALIDATION_TYPE_ERROR;
        response.errorMessage = validatorResult.message;
        return res.json(response);
      }
    }
    //check mobile validation error
    if (type === "mobile") {
      let validatorResult = await validators.mobileLogin(data);
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
        where = { email: data.email, deletedAt: null };
      } else if (type === "mobile") {
        where = {
          countryCode: data.countryCode,
          mobileNumber: data.mobileNumber,
          deletedAt: null,
        };
      }

      let result = await userServices.login(where);
      if (!result || !result.password) {
        response.error = constants.WRONG_CREDENTIALS_TYPE;
        response.errorMessage = constants.WRONG_CREDENTIALS;
        res.statusCode = constants.UNAUTHORIZED_CODE;
        return res.json(response);
      }
      const passwordMatch = await bcrypt.compare(password, result.password);
      if (!passwordMatch) {
        response.error = constants.WRONG_CREDENTIALS_TYPE;
        response.errorMessage = constants.WRONG_PASSWORD;
        res.statusCode = constants.UNAUTHORIZED_CODE;
        return res.json(response);
      }

      if (result.status == "inactive") {
        res.statusCode = constants.UNAUTHORIZED_CODE;
        response.error = constants.INACTIVE_USER_ERROR;
        response.errorMessage = constants.INACTIVE_USER;
        return res.json(response);
      }
      userInfo.id = result.publicId;
      // push on userRole array
      if (result.userRole.length > 0) {
        result.userRole.forEach((element) => {
          userRole.push(element.roles.title);
          element.roles.rolePermission.forEach((permissionElement) => {
            userPermission.push(permissionElement.permissions.title);
          });
        });
      }

      // push on userPermissions array
      if (result.userPermission.length > 0) {
        result.userPermission.forEach((element) => {
          userPermission.push(element.permission.title);
        });
      }
      // make access token in seconds
      userInfo.expiresAt = parseInt(
        moment().add(config.BEARER_TOKEN_EXPIRY_IN, "hours").utc().valueOf() /
          1000
      );
      const accessToken = {
        id: result.publicId,
        name: result.name,
        email: result.email,
        countryCode: result.countryCode,
        mobileNumber: result.mobileNumber,
        role: userRole,
        deviceId: deviceId,
        expireAt: userInfo.expiresAt,
        type: "Bearer",
        permissions: userPermission,
      };

      let accessTokenInfo = await jwtUtility.JWTSighing(
        accessToken,
        config.BEARER_TOKEN_EXPIRY_IN
      );

      // make refresh  token
      userInfo.refreshExpiresAt = parseInt(
        moment().add(config.REFRESH_TOKEN_EXPIRY_IN, "hours").utc().valueOf() /
          1000
      );
      const refreshToken = {
        id: result.publicId,
        role: userRole,
        deviceId: deviceId,
        expireAt: userInfo.refreshExpiresAt,
        type: "Refresh",
      };

      let refreshTokenInfo = await jwtUtility.JWTSighing(
        refreshToken,
        config.REFRESH_TOKEN_EXPIRY_IN
      );

      if (!accessTokenInfo.status || !refreshTokenInfo.status) {
        response.error = constants.SOMETHING_WENT_WRONG_TYPE;
        response.errorMessage = constants.SOMETHING_WENT_WRONG;
        res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
        return res.json(response);
      }

      let deviceInfo = {
        userId: result.id,
        uniqueId: deviceId,
        notificationId: notificationId,
        ipAddress: ipAddress,
        appVersion: apiVersion,
        buildVersion: buildNumber,
        deviceType: deviceType,
        userAgent: req.headers["user-agent"],
      };

      let deviceData = await userServices.getOne({ userId: result.id });

      if (deviceData != null) {
        await userServices.updateDeviceInfo(deviceInfo);
      } else {
        await userServices.insertDeviceInfo(deviceInfo);
      }

      // if (config.UPDATE_QUEUE_URL != "") {
      //   let params = {
      //     MessageBody: JSON.stringify(deviceInfo),
      //     QueueUrl: config.UPDATE_QUEUE_URL,
      //   };
      //   await sqs.sendMessage(params).promise();
      // } else {
      //   deviceController.updateUserDevice(deviceInfo);
      // }

      // user device controller called
      userInfo.accessToken = accessTokenInfo.token;
      userInfo.tokenType = accessTokenInfo.type;
      userInfo.refreshToken = refreshTokenInfo.token;
      userInfo.role = userRole;
      userInfo.scope = userPermission.toString();
      if (config.use_marketplace == "true") {
        let marketPlaceInfo = await marketPlace.login({
          email: email,
          password: password,
        });
        //userInfo.marketPlaceToken = marketPlaceInfo.token;
      }
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      return res.json(userInfo);
    } catch (err) {
      console.log("error", "try-catch: loginController.signIn failed.", err);
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      userInfo.marketPlaceToken = "";
      return res.json(userInfo);
    }
  },

  logOut: async (req, res) => {
    const myLang = res.locals.language;
    const constants = await languageUtility(res.locals.language);
    const userInfo = res.locals.userData;
    let response = {};
    try {
      let userId = userInfo.id;
      let checkUser = await userDetail.getOne({
        publicId: userId,
        deletedAt: null,
      });
      if (!checkUser) {
        response.message = constants.USER_LOGOUT;
        res.statusCode = constants.SUCCESS_STATUS_CODE;
        return res.json(response);
      }
      let updateEntity = {
        // notificationId: null,
        uniqueId: null,
        isLogin: 0,
      };
      await userServices.logOut(updateEntity, checkUser.id);
      response.message = constants.USER_LOGOUT;
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      return res.json(response);
    } catch (err) {
      console.log("error", "try-catch: delete user controller failed.", err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.errorMessage = constants.SOMETHING_WENT_WRONG;
      return res.json(response);
    }
  },
};
module.exports = login;
