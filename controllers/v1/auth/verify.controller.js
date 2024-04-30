const userServices = require("../../../services/auth.service");
const businessServices = require("../../../services/business.service");
const userBusinessScheduleServices = require("../../../services/userBusinessSchedule.service");
const languageHelper = require("../../../utilities/language.utilities.js");
const validators = require("../../../validators/auth/signup.js");
const userTempService = require("../../../services/userTemp.service.js");
const roleServices = require("../../../services/role.service");
const userRoleServices = require("../../../services/userRole.services");
const jwtAuth = require("../../../utilities/jwt.utilities.js");
const secretJson = require("../../../secret.json");
const config = require("../../../config/config.json")[secretJson.ENVIRONMENT];
const UUID = require("uuid-int");
const bcrypt = require("bcrypt");
const moment = require("moment");
const firebaseUtilities = require("../../../utilities/firebase.utilities");
const userMetaServices = require("../../../services/userMeta.service");
const userPermissionServices = require("../../../services/userPermission.service");
let randomNumber = Math.floor(Math.random() * 500 + 1);
const generator = UUID(randomNumber);

const verifyController = {
  index: async (req, res) => {
    const myLang = res.locals.language;
    const constants = await languageHelper(res.locals.language);
    const tokenInfo = res.locals.userData;
    const name = tokenInfo.name ? tokenInfo.name : "";
    const countryCode = tokenInfo.countryCode ? tokenInfo.countryCode : "";
    const mobileNumber = tokenInfo.mobileNumber ? tokenInfo.mobileNumber : "";
    const email = tokenInfo.email ? tokenInfo.email.trim().toLowerCase() : "";
    const otp = req.body.otp ? req.body.otp : "";
    const insertRole = tokenInfo.role[0] ? tokenInfo.role[0] : "user";
    const deviceType = tokenInfo.deviceType;
    const deviceId = tokenInfo.deviceId;
    const buildNumber = tokenInfo.buildNumber;
    const notificationId = tokenInfo.notificationId;
    const apiVersion = tokenInfo.apiVersion;
    const isBusiness = tokenInfo.isBusiness;
    const type = tokenInfo.userType;

    const ipAddress =
      req.header("x-forwarded-for") || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const publicId = generator.uuid();
    let userInfo = {};
    let userRole = [];
    let userPermission = [];
    let response = {};
    let data = {
      otp,
      mobileNumber,
      countryCode,
      deviceType,
      deviceId,
      myLang,
      email,
      name,
      role: [],
    };

    let validatorResult = await validators.verify(data);
    if (!validatorResult.validate) {
      res.statusCode = constants.VALIDATION_STATUS_CODE;
      response.error = constants.VALIDATION_TYPE_ERROR;
      response.errorMessage = validatorResult.message;
      return res.json(response);
    }
    try {
      let emailExistResult = await userServices.emailExist(data);
      if (emailExistResult) {
        response.error = constants.DUPLICATE_ACCOUNT_EXIST_ERROR;
        response.errorMessage = constants.DUPLICATE_EMAIL_EXIST;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }

      let mobileExistResult = await userServices.mobileExistResult(data);
      if (mobileExistResult) {
        response.error = constants.DUPLICATE_ACCOUNT_EXIST_ERROR;
        response.errorMessage = constants.DUPLICATE_NUMBER_EXIST;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }

      //get temp info
      let tempUser = await userTempService.getOne({ id: tokenInfo.id });
      if (!tempUser) {
        response.error = constants.TEMP_USER_NOT_FOUND;
        response.errorMessage = constants.TEMP_USER_NOT_FOUND_MSG;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }

      //compare otp
      const otpCheck = await bcrypt.compare(otp, tempUser.verifyOtp);
      if (!otpCheck) {
        response.error = constants.WRONG_OTP;
        response.errorMessage = constants.WRONG_OTP_MSG;
        res.statusCode = constants.UNAUTHORIZED_CODE;
        return res.json(response);
      }
      let password = tempUser.password;

      //make a object to insert
      let insertData = {
        publicId,
        email,
        password,
        name,
        socialType: type,
        type: insertRole,
        mobileNumber,
        countryCode: tempUser.countryCode,
        isBusiness: tempUser.isBusiness,
        image: tempUser.image,
      };

      let signupResult = await userServices.signUp(insertData);
      // use trigger to delete from tempUser
      let userId = signupResult.id;
      if (!signupResult) {
        response.error = constants.SOMETHING_WENT_WRONG_TYPE;
        response.errorMessage = constants.SOMETHING_WENT_WRONG;
        res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
        return res.json(response);
      }

      //insert user meta
      // add to meta
      let insertMetaData = [
        {
          userId: userId,
          publicId: generator.uuid(),
          metaKey: "total_followers",
          metaValue: 0,
        },
        {
          userId: userId,
          publicId: generator.uuid(),
          metaKey: "total_following",
          metaValue: 0,
        },
        {
          userId: userId,
          publicId: generator.uuid(),
          metaKey: "is_private",
          metaValue: 0,
        },
      ];

      let rolesResult = await roleServices.getOne({ title: insertRole });
      let rolePermission = rolesResult.rolePermission;

      if (rolesResult) {
        //Assign role to user
        let roleInsert = {
          roleId: rolesResult.id,
          userId: userId,
          publicId: generator.uuid(),
        };
        let roleInserted = await userRoleServices.create(roleInsert);
        rolePermission.forEach(async (element) => {
          let permissionId = element.permissionId;
          let permissionInsert = {
            permissionId: permissionId,
            userId: userId,
          };

          await userPermissionServices.create(permissionInsert);
        });
      }
      //set bussiness info

      if (isBusiness == 1) {
        const publicId = generator.uuid();
        let businessPayload = {
          publicId: publicId,
          userId: userId,
          businessName: tempUser.businessName,
          businessAddress: tempUser.businessAddress,
          lat: tempUser.lat,
          long: tempUser.long,
          businessEmail: tempUser.businessEmail ? tempUser.businessEmail : null,
          countryCode: tempUser.businessCountryCode
            ? tempUser.businessCountryCode
            : null,
          mobileNumber: tempUser.businessMobileNumber
            ? tempUser.businessMobileNumber
            : null,
          websiteLink: tempUser.websiteLink ? tempUser.websiteLink : null,
        };

        await businessServices.createBussess(businessPayload);
        //set user business schedule time
        var businessSchedule = tempUser.businessHour;

        var userBusinessSchedule = [];
        // businessSchedule.forEach((element) => {
        //   userBusinessSchedule.push({
        //     publicId: generator.uuid(),
        //     userId: userId,
        //     day: element.day,
        //     openTime: element.open_time,
        //     closeTime: element.close_time,
        //     isOpen: element.is_open,
        //     schedule: JSON.stringify(element.schedule),
        //   });
        // });
        await userBusinessScheduleServices.createUserBusinessSchedule(
          userBusinessSchedule
        );
      }

      // called login services
      let result = await userServices.login({
        email: data.email,
        deletedAt: null,
      });

      if (!result) {
        response.error = constants.WRONG_CREDENTIALS_TYPE;
        response.errorMessage = constants.WRONG_CREDENTIALS;
        res.statusCode = constants.UNAUTHORIZED_CODE;
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
          userPermission.push(element.permissions.title);
        });
      }
      // make access token in seconds
      userInfo.expiresAt = parseInt(
        moment().add(config.BEARER_TOKEN_EXPIRY_IN, "hours").utc().valueOf() /
          1000
      );
      const accessToken = {
        id: result.publicId,
        name: name,
        email: result.email,
        countryCode: result.countryCode,
        mobileNumber: result.mobileNumber,
        isBusiness: result.isBusiness,
        role: userRole,
        deviceId: deviceId,
        expireAt: userInfo.expiresAt,
        type: "Bearer",
        permissions: userPermission,
      };
      let accessTokenInfo = await jwtAuth.JWTSighing(
        accessToken,
        config.BEARER_TOKEN_EXPIRY_IN
      );

      // // make refresh  token
      userInfo.refreshExpiresAt = parseInt(
        moment().add(config.REFRESH_TOKEN_EXPIRY_IN, "hours").utc().valueOf() /
          1000
      );
      const refreshToken = {
        id: result.id,
        role: userRole,
        deviceId: deviceId,
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
        deviceDetail: deviceType,
        userAgent: req.headers["user-agent"],
      };
      let deviceData = await userServices.getOne({ userId: userId });
      if (deviceData != null) {
        await userServices.updateDeviceInfo(deviceInfo);
      } else {
        await userServices.insertDeviceInfo(deviceInfo);
      }

      //user device controller called
      // if (config.UPDATE_QUEUE_URL != "") {
      //   let params = {
      //     MessageBody: JSON.stringify(deviceInfo),
      //     QueueUrl: config.UPDATE_QUEUE_URL,
      //   };
      //   await sqs.sendMessage(params).promise();
      // } else {
      //   deviceController.updateUserDevice(deviceInfo);
      // }
      userInfo.accessToken = accessTokenInfo.token;
      userInfo.tokenType = accessTokenInfo.type;
      userInfo.refreshToken = refreshTokenInfo.token;
      userInfo.role = userRole;
      userInfo.marketPlaceToken = "";
      userInfo.scope = userPermission.toString();
      // //get Firebase token

      let firebasePayload = {
        email: signupResult.email,
        password: signupResult.password,
        name: signupResult.name,
        mysqlUserId: signupResult.publicId,
      };
      let firebaseInfo = await firebaseUtilities.createUser(firebasePayload);

      if (firebaseInfo.statusCode == 201) {
        insertMetaData.push({
          userId: userId,
          publicId: generator.uuid(),
          metaKey: "user_auth_id",
          metaValue: firebaseInfo.firebaseUserCreate.userAuth.uid,
        });

        //   // login from firebase
        let firebaseLoginInfo = await firebaseUtilities.createCustomToken({
          authId: firebaseInfo.firebaseUserCreate.userAuth.uid,
        });
        console.log("firebaseLoginInfo", firebaseLoginInfo);
        if (firebaseLoginInfo.statusCode == 201) {
          userInfo.firebaseToken = firebaseLoginInfo.token;
        }
      } else {
        // removed user
      }
      //added metadata
      await userMetaServices.bulkCreateUserMeta(insertMetaData);
      const message = {
        to: email,
        subject: "Welcome to AIOIO",
        name: name,
        template_name: config.WELCOME_TEMPLATE,
        web_link: config.WEB_LINK,
      };

      res.statusCode = constants.SUCCESS_STATUS_CODE;
      return res.json(userInfo);
    } catch (error) {
      console.log("error", "try-catch: verifyController.verify failed.", error);
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      response.error = constants.SOMETHING_WENT_WRONG_TYPE;
      response.errorMessage = constants.SOMETHING_WENT_WRONG;
      userInfo.marketPlaceToken = "";
      return res.json(userInfo);
    }
  },
  resend: async (req, res) => {
    const myLang = res.locals.language;
    const constants = await languageHelper(res.locals.language);
    const tokenInfo = res.locals.userData;
    const name = tokenInfo.name ? tokenInfo.name : "";
    const countryCode = tokenInfo.countryCode ? tokenInfo.countryCode : "";
    const mobileNumber = tokenInfo.mobileNumber ? tokenInfo.mobileNumber : "";
    const email = tokenInfo.email ? tokenInfo.email.trim().toLowerCase() : "";
    const insertRole = tokenInfo.role[0] ? tokenInfo.role[0] : "user";
    const deviceType = tokenInfo.deviceType;
    const deviceId = tokenInfo.deviceId;
    const buildNumber = tokenInfo.buildNumber;
    const notificationId = tokenInfo.notificationId;
    const apiVersion = tokenInfo.apiVersion;
    const isBusiness = tokenInfo.isBusiness;
    const type = tokenInfo.userType;
    const id = tokenInfo.id;
    let response = {};
    // call login service
    let tempUser = await userTempService.getOne({ id: id });
    if (!tempUser) {
      response.error = constants.TEMP_USER_NOT_FOUND;
      response.errorMessage = constants.TEMP_USER_NOT_FOUND_MSG;
      res.statusCode = constants.NOT_FOUND_STATUS_CODE;
      return res.json(response);
    }
    // let verifyOtp = Math.floor(Math.random() * 500000 + 1);
    const verifyOtp = 111111;
    let hashedVerifyOtp = await bcrypt.hash(verifyOtp.toString(), 10);

    // const verifyOtp = 111111;
    let password = tempUser.password;
    try {
      //make a object to insert
      let insertData = {
        email,
        password,
        name,
        verifyOtp: hashedVerifyOtp,
        mobileNumber,
        countryCode,
        type: insertRole,
      };

      if (isBusiness) {
        insertData = {
          ...insertData,
          isBusiness,
          businessName: tempUser.businessName,
          businessHour: tempUser.businessHour,
          businessAddress: tempUser.businessAddress,
          lat: tempUser.lat,
          long: tempUser.long,
          businessEmail: tempUser.businessEmail,
          businessCountryCode: tempUser.businessCountryCode,
          businessMobileNumber: tempUser.businessMobileNumber,
          websiteLink: tempUser.websiteLink,
        };
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
          .add(config.VERIFICATION_TOKEN_EXPIRY_IN, "hours")
          .utc()
          .valueOf() / 1000
      );
      const verifyToken = {
        id: signupTempResult.id,
        name: name,
        email: email,
        countryCode: countryCode,
        mobileNumber: mobileNumber,
        notificationId: notificationId,
        isBusiness: isBusiness,
        otp: hashedVerifyOtp,
        role: [insertRole],
        userType: type,
        deviceId: deviceId,
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

      const message = {
        to: email,
        name: name,
        subject: "AioiA: Email Verification",
        otp: verifyOtp,
        // template_name: config.SIGN_UP_TEMPLATE,
        // web_link: config.WEB_LINK,
      };
      if (config.MAIL_STATUS == 1) {
        // await mailChimp
        //   .sendMail(message)
        //   .then((res) => console.log("Email sent....."))
        //   .catch((error) => console.log(error.message));
        // let params = {
        //   MessageBody: JSON.stringify(message),
        //   QueueUrl: config.QUEUE_URL,
        // };
        // let queueRes = await sqs.sendMessage(params).promise();
        // console.log(queueRes);
      }
      response.accessToken = verifyTokenInfo.token;
      response.tokenType = verifyToken.type;
      response.expireAt = expiresAt;
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      return res.json(response);
    } catch (err) {
      console.log("error", "try-catch: resendController.signIn failed.", err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.error = constants.SOMETHING_WENT_WRONG_TYPE;
      response.errorMessage = constants.SOMETHING_WENT_WRONG;
      return res.json(response);
    }
  },
};
module.exports = verifyController;
