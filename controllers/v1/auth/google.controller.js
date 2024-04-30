const userServices = require("../../../services/auth.service");
const languageHelper = require("../../../utilities/language.utilities.js");
const validators = require("../../../validators/auth/signup.js");
const userTempService = require("../../../services/userTemp.service.js");
const roleServices = require("../../../services/role.service");
const userRoleServices = require("../../../services/userRole.services");
const userGalleryServices = require("../../../services/userGallery.services");
const jwtAuth = require("../../../utilities/jwt.utilities.js");
const secretJson = require("../../../secret.json");
const config = require("../../../config/config.json")[secretJson.ENVIRONMENT];
const UUID = require("uuid-int");
const bcrypt = require("bcrypt");
const moment = require("moment");
const { OAuth2Client } = require("google-auth-library");
let randomNumber = Math.floor(Math.random() * 500 + 1);
const generator = UUID(randomNumber);
const googleController = {
  /*
   * google login
   */
  index: async (req, res) => {
    const myLang = res.locals.language;
    const constants = await languageHelper(res.locals.language);
    const socialType = "google";
    // let email = req.body.email ? req.body.email.trim().toLowerCase() : null;
    // let name = req.body.name;
    let email, name;
    const deviceType = req.body.deviceType ? req.body.deviceType : "";
    const accessToken = req.body.accessToken ? req.body.accessToken : "";
    const insertRole = "user";
    // const insertRole = "student";
    const image = req.body.avatar ? req.body.avatar : null;
    const deviceId = req.body.deviceId ? req.body.deviceId : null;
    const apiVersion = req.body.apiVersion ? req.body.apiVersion : null;
    const buildNumber = req.body.buildNumber ? req.body.buildNumber : null;
    const notificationId = req.body.notificationId
      ? req.body.notificationId
      : null;
    const ipAddress =
      req.header("x-forwarded-for") || req.connection.remoteAddress;

    const publicId = generator.uuid();
    let userInfo = {};
    let userRole = [];
    let userPermission = [];
    let response = {};

    let data = {
      accessToken,
      myLang,
      socialType,

      deviceType,
      deviceId,
    };

    let validatorResult = await validators.googleLogin(data);
    if (!validatorResult.validate) {
      res.statusCode = constants.VALIDATION_STATUS_CODE;
      response.error = constants.VALIDATION_TYPE_ERROR;
      response.errorMessage = validatorResult.message;
      return res.json(response);
    }
    try {
      let googleId = config.GOOGLE_CID;
      if (deviceType === "ios") {
        googleId = config.GOOGLE_CLIENT_IOS_ID;
      }
      let googleJson = { idToken: accessToken, requiredAudience: googleId };

      let client = new OAuth2Client(googleId);

      let ticket = await client.verifyIdToken(googleJson);

      let gPayload = ticket.getPayload();
      if (gPayload["aud"] != googleId) {
        response.error = constants.NO_GOOGLE_ACCOUNT;
        response.errorMessage = constants.NO_GOOGLE_ACCOUNT;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }
      let socialId = gPayload["sub"];

      data.socialId = socialId;
      let result = await userServices.SocialKeyExist({
        socialId: socialId,
        socialType: socialType,
      });
      if (result) {
        if (result.status == "inactive") {
          response.statusCode = constants.UNAUTHORIZED_CODE;
          response.error = constants.INACTIVE_USER_ERROR;
          response.errorMessage = constants.INACTIVE_USER;
          return res.json(response);
        }
      }
      email = ticket.payload.email;
      name = ticket.payload.name;
      let insertData = {
        publicId,
        email: email,
        name: name,
        socialId,
        socialType,
      };
      // console.log(insertData, "______________working");

      let EmailExistResult = await userServices.emailExist({
        email: email,
      });
      if (EmailExistResult) {
        response.error = constants.DUPLICATE_ACCOUNT_EXIST_ERROR;
        response.errorMessage = constants.DUPLICATE_EMAIL_EXIST;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }
      const image = ticket.payload.picture;
      let signupResult = await userServices.signUp(insertData);
      // insert image
      if (image) {
        let result = await userGalleryServices.create({
          publicId: generator.uuid(),
          userId: signupResult.id,
          image: image,
        });
      }
      // fetch role and role permission
      let rolesResult = await roleServices.getOne({ title: insertRole });
      if (rolesResult) {
        //Assign role to user
        let roleInsert = {
          roleId: rolesResult.id,
          userId: signupResult.id,
          publicId: generator.uuid(),
        };
        await userRoleServices.create(roleInsert);

        result = await userServices.SocialKeyExist(data);
      }

      const message = {
        to: email,
        subject: "Welcome to TWE",
        name: name,
        // template_name: config.WELCOME_TEMPLATE,
      };
      //     // if (config.MAIL_STATUS == 1) {
      //     //   // mailChimp
      //     //   //   .sendMail(message)
      //     //   //   .then((res) => console.log("Email sent....."))
      //     //   //   .catch((error) => console.log(error.message));
      //     //   let params = {
      //     //     MessageBody: JSON.stringify(message),
      //     //     QueueUrl: config.QUEUE_URL,
      //     //   };
      //     //   let queueRes = await sqs.sendMessage(params).promise();
      //     // }
      //   }
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
      // if (result.userPermission.length > 0) {
      //   result.userPermission.forEach((element) => {
      //     userPermission.push(element.permissions.title);
      //   });
      // }
      // make access token in seconds
      userInfo.expiresAt = parseInt(
        moment().add(config.BEARER_TOKEN_EXPIRY_IN, "hours").utc().valueOf() /
          1000
      );
      const accessTokenParam = {
        id: result.publicId,
        name: result.name,
        email: result.email,
        role: userRole,
        deviceId: deviceId,
        expireAt: userInfo.expiresAt,
        type: "Bearer",
        permissions: userPermission,
      };
      let accessTokenInfo = await jwtAuth.JWTSighing(
        accessTokenParam,
        config.BEARER_TOKEN_EXPIRY_IN
      );
      // console.log("accessTokenInfo:=", accessTokenParam);
      //   // return false;
      // make refresh  token
      userInfo.refreshExpiresAt = parseInt(
        moment().add(config.BEARER_TOKEN_EXPIRY_IN, "hours").utc().valueOf() /
          1000
      );
      const refreshToken = {
        id: result.publicId,
        role: userRole,
        deviceId: "",
        expireAt: userInfo.refreshExpiresAt,
        type: "Refresh",
      };
      let refreshTokenInfo = await jwtAuth.JWTSighing(
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
        // platform: platform,
        appVersion: apiVersion,
        buildVersion: buildNumber,
        deviceType: deviceType,
        userAgent: req.headers["user-agent"],
      };
      console.log(deviceInfo, "__1111_____________deviceInfo");
      let deviceData = await userServices.getOne({ userId: result.id });
      console.log("deviceDAta,______________", deviceData);
      if (deviceData != null) {
        await userServices.updateDeviceInfo(deviceInfo);
      } else {
        await userServices.insertDeviceInfo(deviceInfo);
      }
      //   // user device controller called
      //   if (config.UPDATE_QUEUE_URL != "") {
      //     let params = {
      //       MessageBody: JSON.stringify(deviceInfo),
      //       QueueUrl: config.UPDATE_QUEUE_URL,
      //     };
      //     await sqs.sendMessage(params).promise();
      //   } else {
      //     deviceController.updateUserDevice(deviceInfo);
      //   }

      userInfo.accessToken = accessTokenInfo.token;
      userInfo.tokenType = accessTokenInfo.type;
      userInfo.refreshToken = refreshTokenInfo.token;
      userInfo.tokenType = accessTokenInfo.type;
      userInfo.role = userRole;
      userInfo.scope = userPermission.toString();
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      return res.json(userInfo);
    } catch (err) {
      console.log("error", "try-catch: googleLogin Controller failed.", err);
      response.error = constants.SOMETHING_WENT_WRONG_TYPE;
      response.errorMessage = constants.SOMETHING_WENT_WRONG;
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      return res.json(response);
    }
  },
};
module.exports = googleController;
