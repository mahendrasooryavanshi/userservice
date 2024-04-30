const userServices = require("../../../services/auth.service");
const languageHelper = require("../../../utilities/language.utilities.js");
const validators = require("../../../validators/auth/signup.js");
const userTempService = require("../../../services/userTemp.service.js");
const roleServices = require("../../../services/role.service");
const userRoleServices = require("../../../services/userRole.services");
const userGalleryServices = require("../../../services/userGallery.services");
const jwtAuth = require("../../../utilities/jwt.utilities.js");
const secretJson = require("../../../secret.json");

const userPermissionServices = require("../../../services/userPermission.service");
const config = require("../../../config/config.json")[secretJson.ENVIRONMENT];
const UUID = require("uuid-int");
const bcrypt = require("bcrypt");
const moment = require("moment");
const axios = require("axios");
let randomNumber = Math.floor(Math.random() * 500 + 1);
const generator = UUID(randomNumber);
const facebookController = {
  index: async (req, res) => {
    const myLang = res.locals.language;
    const constants = await languageHelper(res.locals.language);
    const socialType = "facebook";
    const deviceType = req.body.deviceType ? req.body.deviceType : "";
    const deviceId = req.body.deviceId ? req.body.deviceId : null;
    const accessToken = req.body.accessToken ? req.body.accessToken : "";
    let insertRole = "user";
    const apiVersion = req.body.apiVersion ? req.body.apiVersion : null;
    const buildNumber = req.body.buildNumber ? req.body.buildNumber : null;
    const notificationId = req.body.notificationId
      ? req.body.notificationId
      : null;
    const ipAddress =
      req.header("x-forwarded-for") || req.connection.remoteAddress;
    let response = {};
    const publicId = generator.uuid();
    let userInfo = {};
    let userRole = [];
    let userId;
    let userPermission = [];
    let rolesResult;
    let data = {
      accessToken,
      myLang,
    };

    let validatorResult = await validators.facebookLogin(data);
    if (!validatorResult.validate) {
      res.statusCode = constants.VALIDATION_STATUS_CODE;
      response.error = constants.VALIDATION_TYPE_ERROR;
      response.errorMessage = validatorResult.message;
      return res.json(response);
    }
    try {
      let facebookUrl = config.FACEBOOK_URL;
      const result = await axios.get(`${facebookUrl}${accessToken}`);

      let name = result.data.name;
      let email = result.data.email;
      let socialId = result.data.id;
      let userData = { socialId: socialId, socialType: socialType };
      let userResult = await userServices.SocialKeyExist(userData);

      if (userResult) {
        let data = { userId: userResult.id, socialId: socialId };

        userId = userResult.id;
        if (userResult.socialId != socialId) {
          response.status = constants.NOT_FOUND_STATUS_CODE;
          response.errorMessage = constants.FACEBOOK_ACC_ALREADY_EXIST;
          return res.json(response);
        }
        if (userResult.status === "inactive") {
          response.message = constants.ACCOUNT_TEMPORARY_INACTIVE;
          return res.json(response);
        }

        let emailExistResult = await userServices.emailExist({ email: email });
        if (emailExistResult) {
          response.error = constants.DUPLICATE_ACCOUNT_EXIST_ERROR;
          response.errorMessage = constants.DUPLICATE_EMAIL_EXIST;
          res.statusCode = constants.NOT_FOUND_STATUS_CODE;
          return res.json(response);
        }
      } else {
        let insertEntity = {
          publicId: publicId,
          email: email,
          name: name,
          socialId: socialId,
          socialType: socialType,
        };

        //   const image = ticket.payload.picture;
        // insert image
        //   if (image) {
        //     let result = await userGalleryServices.create({
        //       publicId: generator.uuid(),
        //       userId: signupResult.id,
        //       image: image,
        //     });
        //   }
        userResult = await userServices.signUp(insertEntity);
        userId = userResult.id;
        // fetch role and role permission

        rolesResult = await roleServices.getOne({ title: insertRole });

        let rolePermission = rolesResult.rolePermission;

        if (rolesResult) {
          let roleInsert = {
            publicId: generator.uuid(),
            roleId: rolesResult.id,
            userId: userId,
          };

          await userRoleServices.create(roleInsert);
          rolePermission.forEach(async (element) => {
            let permissionId = element.permissionId;
            let permissionInsert = {
              permissionId: permissionId,
              userId: userId,
            };

            let result = await userPermissionServices.create(permissionInsert);
          });
        }
      }

      data = { ...data, id: userId };
      let roleResult = await userServices.getRole(data);

      roleResult.forEach((element) => {
        userRole.push(element.roles.title);
        let permissionDetails = element.roles.rolePermission;
        permissionDetails.forEach((permissionElement) => {
          userPermission.push(permissionElement.permissions.title);
        });
      });

      userInfo.id = publicId;
      userInfo.expiresAt = parseInt(
        moment().add(config.BEARER_TOKEN_EXPIRY_IN, "hours").utc().valueOf() /
          1000
      );
      const accessTokenParam = {
        id: userResult.publicId,
        name: userResult.name,
        email: userResult.email,
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

      // make refresh  token
      userInfo.refreshExpiresAt = parseInt(
        moment().add(config.BEARER_TOKEN_EXPIRY_IN, "hours").utc().valueOf() /
          1000
      );
      const refreshToken = {
        id: userResult.publicId,
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
        userId: userId,
        uniqueId: deviceId,
        notificationId: notificationId,
        ipAddress: ipAddress,
        // platform: platform,
        appVersion: apiVersion,
        buildVersion: buildNumber,
        deviceType: deviceType,
        userAgent: req.headers["user-agent"],
      };
      let deviceData = await userServices.getOne({ userId: userId });
      if (deviceData != null) {
        await userServices.updateDeviceInfo(deviceInfo);
      } else {
        await userServices.insertDeviceInfo(deviceInfo);
      }
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
      console.log("error", "try-catch: facebookLogin Controller failed.", err);
      response.error = constants.SOMETHING_WENT_WRONG_TYPE;
      response.errorMessage = constants.SOMETHING_WENT_WRONG;
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      return res.json(response);
    }
  },
};
module.exports = facebookController;
