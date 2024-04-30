/**
 * token middleware file
 */
const languageHelper = require("./../utilities/language.utilities"),
  jwtAuth = require("../utilities/jwt.utilities");

const secretJson = require("../secret.json");
const config = require("../config/config.json")[secretJson.ENVIRONMENT];

// deviceModel = require('./../models/deviceModel');

const refreshTokenMiddleware = async (req, res, next) => {
  let token = req.headers.authorization ? req.headers.authorization : "";
  let response = {
    // message: constants.TOKEN_VALIDATION,
  };
  const constants = await languageHelper(res.locals.language);
  if (token === "") {
    res.statusCode = constants.PERMISSION_ERROR_STATUS_CODE;
    response.error = constants.TOKEN_REQUIRED_ERROR;
    response.errorMessage = constants.TOKEN_MISSING_ERROR;
    return res.json(response);
  } else {
    // get token
    if (token && token.split(" ")[0] === "Refresh") {
      token = token.split(" ")[1];
      const jwtData = await jwtAuth.JWTVerify(token);
      if (jwtData.status === false) {
        res.statusCode = 403;
        response.error = constants.REFRESH_TOKEN_INVALID_ERROR;
        response.errorMessage = constants.TOKEN_EXPIRED;
        return res.json(response);
      } else if (jwtData.verify.version != config.VERSION) {
        res.statusCode = 403;
        response.error = constants.TOKEN_INVALID_ERROR;
        response.errorMessage = constants.TOKEN_EXPIRED;
        return res.json(response);
      } else {
        if (jwtData.verify.type != "Refresh") {
          res.statusCode = constants.PERMISSION_ERROR_STATUS_CODE;
          response.error = constants.TOKEN_INVALID_ERROR;
          response.errorMessage = constants.TOKEN_INVALID;
          return res.json(response);
        }
        res.locals.refreshData = jwtData.verify;
        next();
      }
    } else {
      res.statusCode = 403;
      response.error = constants.TOKEN_REQUIRED_ERROR;
      response.errorMessage = constants.TOKEN_MISSING_ERROR;
      return res.json(response);
    }
  }
};

// export data to use in other files
module.exports = refreshTokenMiddleware;
