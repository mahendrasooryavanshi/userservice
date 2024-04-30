const languageUtility = require("./../../../utilities/language.utilities.js");
const userServices = require("./../../../services/user.service");
const followServices = require("./../../../services/follow.service");
const { Op, Sequelize } = require("sequelize");
const validators = require("../../../validators/follow/follow");
const UUID = require("uuid-int");
const secretJson = require("../../../secret.json");
const config = require("../../../config/config.json")[secretJson.ENVIRONMENT];

const follow = {
  

  /**
   * Make FOllow
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  makeFollow: async (req, res) => {
    const myLang = res.locals.language;
    const constants = await languageUtility(res.locals.language);
    const userId = req.body.userId;
    const userInfo = res.locals.userData;
    let response = {};
    let data = {
      userId,
      myLang,
    };
    try {
      let validatorResult = await validators.followValidate(data);
      if (!validatorResult.validate) {
        res.statusCode = constants.VALIDATION_STATUS_CODE;
        response.error = constants.VALIDATION_TYPE_ERROR;
        response.errorMessage = validatorResult.message;
        return res.json(response);
      }
      if (userId == userInfo.id) {
        response.message = constants.SELF_FOLLOWED;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }
      let params = { where: { publicId: userId, deletedAt: null } };
      let paramsData = { where: { metaKey: "is_private_follow" } };
      let userData = await Promise.all([
        userServices.getOne({
          publicId: userInfo.id,
          deletedAt: null,
        }),
        userServices.getOneWithMeta(params, paramsData),
      ]);

      if (!userData[1]) {
        response.message = constants.NOT_FOUND_ERROR;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }
      let check = await Promise.all([
        followServices.getOne({
          where: {
            status: "blocked",
            fromId: userData[1].id,
            toId: userData[0].id,
          },
          attributes: ["id", "status"],
        }),
        followServices.getOne({
          where: {
            fromId: userData[0].id,
            toId: userData[1].id,
          },
          attributes: ["id", "status"],
        }),
      ]);
      if (check[0]) {
        if (check[0].status == "blocked") {
          response.message = constants.BLOCKED;
          res.statusCode = constants.NOT_FOUND_STATUS_CODE;
          return res.json(response);
        }
      }
      if (check[1] && check[1].status == "accepted") {
        response.message = constants.ALREADY_FOLLOW;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      } else if (check[1] && check[1].status == "pending") {
        response.message = constants.ALREADY_REQUESTED;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }
      let insertData = {
        fromId: userData[0].id,
        toId: userData[1].id,
        status: "accepted",
      };
      let message = userInfo.name + " started following you";
      let type = "follow_accept";
      let title = "Profile Follow";
      if (userData[1].userMetaData) {
        if (
          userData[1].userMetaData.metaValue == "private" ||
          userData[1].userMetaData.metaValue == "protected"
        ) {
          type = "follow_request";
          message = userInfo.name + " would like to follow you";
          insertData.status = "pending";
        }
      }
      let notificationEntity = {
        title: title,
        type: type,
        userIds: userId.toString(),
        actionId: userInfo.id,
        message: message,
      };
      console.log(notificationEntity, "notificationEntity");
      // notification.send(notificationEntity, token);
      await followServices.create(insertData);
      response.message = constants.SUCCESS;
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      return res.json(response);
    } catch (err) {
      console.log("try-catch: follow controller.follow failed.", err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.errorMessage = constants.SOMETHING_WENT_WRONG;
      return res.json(response);
    }
  },

  
  /**
   * UN Follow
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  unFollow: async (req, res) => {
    const myLang = res.locals.language;
    const constants = await languageUtility(res.locals.language);
    const userId = req.body.userId;
    const type = req.body.type;
    const userInfo = res.locals.userData;
    let response = {};
    let data = {
      userId,
      type,
      myLang,
    };
    try {
      let validatorResult = await validators.unFollowValidate(data);
      if (!validatorResult.validate) {
        res.statusCode = constants.VALIDATION_STATUS_CODE;
        response.error = constants.VALIDATION_TYPE_ERROR;
        response.errorMessage = validatorResult.message;
        return res.json(response);
      }
      let formId = userInfo.id;
      let toId = userId;
      if (type == "follower") {
        formId = userId;
        toId = userInfo.id;
      }
      if (!validatorResult.validate) {
        res.statusCode = constants.VALIDATION_STATUS_CODE;
        response.error = constants.VALIDATION_TYPE_ERROR;
        response.errorMessage = validatorResult.message;
        return res.json(response);
      }
      let userData = await Promise.all([
        userServices.getOne({
          publicId: formId,
          deletedAt: null,
        }),
        userServices.getOne({
          publicId: toId,
          deletedAt: null,
        }),
      ]);

      if (!userData[1] || !userData[0]) {
        response.message = constants.NOT_FOUND_ERROR;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }
      let followData = {
        where: {
          fromId: userData[0].id,
          toId: userData[1].id,
          status: "accepted",
        },
        attributes: ["id", "status"],
      };
      let checkFollow = await followServices.getOne(followData);
      if (!checkFollow) {
        response.message = constants.NOT_FOUND_ERROR;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }
      await followServices.delete({ id: checkFollow.id });
      response.message = constants.SUCCESS;
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      return res.json(response);
    } catch (err) {
      console.log("try-catch: unFollow controller.follow failed.", err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.errorMessage = constants.SOMETHING_WENT_WRONG;
      return res.json(response);
    }
  },

  
  /**
   * follower List
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  followerList: async (req, res) => {
    const myLang = res.locals.language;
    const constants = await languageUtility(res.locals.language);
    const userInfo = res.locals.userData;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    let search = req.query.search ? req.query.search.trim() : "";
    let userId = userInfo.id;
    if (req.query.userId) {
      userId = req.query.userId;
    }
    let response = {};
    try {
      let validData = {
        userId,
        limit,
      };
      let validatorResult = await validators.listValidate(validData);
      if (!validatorResult.validate) {
        res.statusCode = constants.VALIDATION_STATUS_CODE;
        response.error = constants.VALIDATION_TYPE_ERROR;
        response.errorMessage = validatorResult.message;
        return res.json(response);
      }
      let params = { where: { publicId: userId, deletedAt: null } };
      let paramsData = { where: { metaKey: "is_private_follow" } };
      let userData = await userServices.getOneWithMeta(params, paramsData);
      if (!userData) {
        response.errorMessage = constants.USER_ID_NOT_EXIST;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }
      if (userData.userMetaData) {
        if (
          (userData.userMetaData.metaValue == "private" ||
            userData.userMetaData.metaValue == "protected") &&
          userId != userInfo.id &&
          userInfo.role != "Admin"
        ) {
          response.errorMessage = constants.PRIVATE_ACCOUNT;
          res.statusCode = constants.NOT_FOUND_STATUS_CODE;
          return res.json(response);
        }
      }
      let followData = {
        where: { toId: userData.id, status: "accepted" },
        limit,
        offset,
      };
      let data = {};
      if (search != "") {
        data = { name: { [Op.like]: "%" + search + "%" } };
      }
      let result = await followServices.followerList(followData, data);
      if (result.length < 1) {
        response.message = constants.NOT_FOUND_ERROR;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }
      if (userData != userInfo.id) {
        userData = await userServices.getOne({
          publicId: userInfo.id,
          deletedAt: null,
        });
      }
      let fromIdArray = [];
      for (let element of result.followerResult) {
        console.log(element.fromId);
        fromIdArray.push(element.fromId);
      }
      let checkFollow = await followServices.getAll({
        where: { fromId: userData.id, toId: { [Op.in]: fromIdArray } },
        attributes: ["toId", "status"],
      });

      let followerArray = [];
      for (let element of result.followerResult) {
        let data = Object.assign({}, element.dataValues);
        let followerData = Object.assign({}, element.followerUser.dataValues);
        followerData.isFollow = false;
        const checkData = checkFollow.find(
          ({ toId }) => toId == element.fromId
        );
        if (
          checkData &&
          (checkData.status == "accepted" || checkData.status == "pending")
        ) {
          followerData.isFollow = true;
        }
        data.followerUser = followerData;
        followerArray.push(data);
      }
      response.count = result.followerCount;
      response.result = followerArray;
      return res.json(response);
    } catch (err) {
      console.log(
        "error",
        "try-catch: followerList controller.follow failed.",
        err
      );
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.errorMessage = constants.SOMETHING_WENT_WRONG;
      return res.json(response);
    }
  },

  /**
   * Accept reject Request
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */

  acceptRejectRequest: async (req, res) => {
    const myLang = res.locals.language;
    const constants = await languageUtility(res.locals.language);
    const userId = req.body.userId;
    const status = req.body.status;
    const userInfo = res.locals.userData;
    let response = {};
    let data = {
      userId,
      status,
      myLang,
    };
    try {
      let validatorResult = await validators.acceptRejectValidate(data);
      if (!validatorResult.validate) {
        res.statusCode = constants.VALIDATION_STATUS_CODE;
        response.error = constants.VALIDATION_TYPE_ERROR;
        response.errorMessage = validatorResult.message;
        return res.json(response);
      }
      let userData = await Promise.all([
        userServices.getOne({
          publicId: userId,
          deletedAt: null,
        }),
        userServices.getOne({
          publicId: userInfo.id,
          deletedAt: null,
        }),
      ]);
      if (!userData[0]) {
        response.message = constants.NOT_FOUND_ERROR;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }
     
      let followData = {
        where: {
          fromId: userData[0].id,
          toId: userData[1].id,
          status: "pending",
        },
      };
      let checkFollowRequest = await followServices.getOne(followData);
      if (!checkFollowRequest) {
        response.message = constants.NOT_FOUND_ERROR;
        response.errorMessage = constants.REQUEST_NOT_FOUND;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }
      let updateData = {
        id: checkFollowRequest.id,
        status: status,
      };

      if (status == "accepted") {
        let notificationEntity = {
          title: "Follows request accept",
          type: "accept_request",
          userIds: userId.toString(),
          actionId: userInfo.id,
          message: userInfo.name + " has accepted your follow request",
        };
      }
      await followServices.updateStatus(
        {
          id: checkFollowRequest.id,
        },
        { status: status }
      );
      response.message = constants.SUCCESS;
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      return res.json(response);
    } catch (err) {
      console.log("error", "accept Reject Request controller. failed.", err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.errorMessage = constants.SOMETHING_WENT_WRONG;
      return res.json(response);
    }
  },

  /**
   * Get Folloing List
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  followingList: async (req, res) => {
    const myLang = res.locals.language;
    const constants = await languageUtility(res.locals.language);
    const userInfo = res.locals.userData;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    let search = req.query.search ? req.query.search.trim() : "";
    let userId = userInfo.id;
    if (req.query.userId) {
      userId = req.query.userId;
    }
    let response = {};
    try {
      let validData = {
        userId,
        limit,
      };
      let validatorResult = await validators.listValidate(validData);
      if (!validatorResult.validate) {
        res.statusCode = constants.VALIDATION_STATUS_CODE;
        response.error = constants.VALIDATION_TYPE_ERROR;
        response.errorMessage = validatorResult.message;
        return res.json(response);
      }
      let params = { where: { publicId: userId, deletedAt: null } };
      let paramsData = { where: { metaKey: "is_private_follow" } };
      let userData = await userServices.getOneWithMeta(params, paramsData);

      if (!userData) {
        response.errorMessage = constants.USER_ID_NOT_EXIST;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }
      if (userData.userMetaData) {
        if (
          (userData.userMetaData.metaValue == "private" ||
            userData.userMetaData.metaValue == "protected") &&
          userId != userInfo.id &&
          userInfo.role != "Admin"
        ) {
          response.errorMessage = constants.PRIVATE_ACCOUNT;
          res.statusCode = constants.NOT_FOUND_STATUS_CODE;
          return res.json(response);
        }
      }
      let followData = {
        where: { fromId: userData.id, status: "accepted" },
        limit,
        offset,
      };
      let data = {};
      if (search != "") {
        data = { name: { [Op.like]: "%" + search + "%" } };
      }

      let result = await followServices.followingList(followData, data);
      if (!result.length < 1) {
        response.message = constants.NOT_FOUND_ERROR;
        response.errorMessage = constants.RECORD_NOT_FOUND;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }
      response.results = result;
      return res.json(response);
    } catch (err) {
      console.log(
        "error",
        "try-catch: followingList controller.follow failed.",
        err
      );
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.errorMessage = constants.SOMETHING_WENT_WRONG;
      return res.json(response);
    }
  },

  /**
   * Follow Invitation List
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */

  followInvitationList: async (req, res) => {
    const myLang = res.locals.language;
    const constants = await languageUtility(res.locals.language);
    const userInfo = res.locals.userData;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    let search = req.query.search ? req.query.search.trim() : "";
    let response = {};
    try {
      let validData = {
        limit,
        myLang,
      };
      let validatorResult = await validators.listValidate(validData);
      if (!validatorResult.validate) {
        res.statusCode = constants.VALIDATION_STATUS_CODE;
        response.error = constants.VALIDATION_TYPE_ERROR;
        response.errorMessage = validatorResult.message;
        return res.json(response);
      }
      let userData = await userServices.getOne({
        publicId: userInfo.id,
      });
      let followData = {
        where: { toId: userData.id, status: "pending" },
        limit,
        offset,
      };
      let data = {};
      if (search != "") {
        data.where = { name: { [Op.like]: "%" + search + "%" } };
      }
      let result = await followServices.followerList(followData, data);
      if (!result.length < 1) {
        response.message = constants.NOT_FOUND_ERROR;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }
      response.results = result;
      return res.json(response);
    } catch (err) {
      console.log("try-catch: follow Invitation List controller failed.", err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.errorMessage = constants.SOMETHING_WENT_WRONG;
      return res.json(response);
    }
  },

  
  /**
   * Remove Request
   * @param {*} req 
   * @param {*} res 
   * @returns 
  */
  removeRequest: async (req, res) => {
    const myLang = res.locals.language;
    const constants = await languageUtility(res.locals.language);
    const userId = req.body.userId ? req.body.userId : "";
    const userInfo = res.locals.userData;
    let response = {};
    let data = {
      userId,
      myLang,
    };
    try {
      let validatorResult = await validators.followValidate(data);
      if (!validatorResult.validate) {
        res.statusCode = constants.VALIDATION_STATUS_CODE;
        response.error = constants.VALIDATION_TYPE_ERROR;
        response.errorMessage = validatorResult.message;
        return res.json(response);
      }
      let userData = await Promise.all([
        userServices.getOne({
          publicId: userInfo.id,
          deletedAt: null,
        }),
        userServices.getOne({
          publicId: userId,
          deletedAt: null,
        }),
      ]);

      if (!userData[1]) {
        response.message = constants.NOT_FOUND_ERROR;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }
      let followData = {
        where: {
          fromId: userData[0].id,
          toId: userData[1].id,
          status: "pending",
        },
      };
      let checkFollowRequest = await followServices.getOne(followData);
      if (!checkFollowRequest) {
        response.message = constants.NO_REQUEST_FOUND;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }
      await followServices.delete({ id: checkFollowRequest.id });
      response.message = constants.SUCCESS;
      res.statusCode = constants.SUCCESS_STATUS_CODE;
      return res.json(response);
    } catch (err) {
      console.log("error", "try-catch: remove request controller failed.", err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.errorMessage = constants.SOMETHING_WENT_WRONG;
      return res.json(response);
    }
  },

  
  /**
   * Bolck User
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  blockUser: async (req, res) => {
    const myLang = res.locals.language;
    const constants = await languageUtility(res.locals.language);
    const userId = req.body.userId;
    const status = req.body.status;
    const userInfo = res.locals.userData;
    let response = {};
    let data = {
      userId,
      status,
      myLang,
    };

    try {
      let validatorResult = await validators.blockedValidate(data);
      if (!validatorResult.validate) {
        res.statusCode = constants.VALIDATION_STATUS_CODE;
        response.error = constants.VALIDATION_TYPE_ERROR;
        response.errorMessage = validatorResult.message;
        return res.json(response);
      }
      let userData = await Promise.all([
        userServices.getOne({
          publicId: userInfo.id,
          deletedAt: null,
        }),
        userServices.getOne({
          publicId: userId,
          deletedAt: null,
        }),
      ]);

      if (!userData[1]) {
        response.message = constants.NOT_FOUND_ERROR;
        res.statusCode = constants.NOT_FOUND_STATUS_CODE;
        return res.json(response);
      }

      let checkFollow = await followServices.getOne({
        where: { fromId: userData[0].id, toId: userData[1].id },
      });

      if (checkFollow) {
        // let updateData = {
        //   id: checkFollow.id,
        //   status: status,
        // };
        if (checkFollow.status == "blocked") {
          await followServices.delete({ id: checkFollow.id });
          response.message = constants.USER_UNBLOCKED;
        } else {
          await followServices.updateStatus(
            {
              id: checkFollow.id,
            },
            { status: status }
          );
          response.message = constants.USER_BLOCKED;
        }
        res.statusCode = constants.SUCCESS_STATUS_CODE;
        return res.json(response);
      } else {
        await followServices.create({
          fromId: userData[0].id,
          toId: userData[1].id,
          status: "blocked",
        });
        response.message = constants.USER_BLOCKED;
        res.statusCode = constants.SUCCESS_STATUS_CODE;
        return res.json(response);
      }
    } catch (err) {
      console.log("try-catch: block user controller.follow failed.", err);
      res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
      response.errorMessage = constants.SOMETHING_WENT_WRONG;
      return res.json(response);
    }
  },
};
module.exports = follow;
