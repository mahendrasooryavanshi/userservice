/**
 * token middleware file
 */
const languageUtility = require("./../utilities/language.utilities.js"),
  jwtAuth = require("./../utilities/jwt.utilities.js");
const tokenOptionalMiddleware = async (req, res, next) => {
  let token = req.headers.authorization ? req.headers.authorization : "";
  const secretJson = require("../secret.json");
  const config = require("../config/config.json")[secretJson.ENVIRONMENT];

  let response = {
    // message: constants.TOKEN_VALIDATION,
  };
  const constants = await languageUtility(res.locals.language);
  console.log('token', token)
  if (token === "") {

    next();
  } else {
    // get token
    if (token && token.split(" ")[0] === "Bearer") {
      token = token.split(" ")[1];
      const jwtData = await jwtAuth.JWTVerify(token);
      if (jwtData.status === false) {
        res.statusCode = 403;
        response.error = constants.TOKEN_INVALID_ERROR;
        response.errorMessage = constants.TOKEN_EXPIRED;
        return res.json(response);
      }
      if (jwtData.verify.version != config.VERSION) {
        res.statusCode = 403;
        response.error = constants.VERSION_ERROR;
        response.errorMessage = constants.VERSION_ERROR;
        return res.json(response);
      }
      const roles = config.roles.split(",");
      const roleExist = jwtData.verify.role.filter(function (item) {
        return roles.indexOf(item) > -1;
      });
      if (roleExist.length > 0) {
        res.locals.userData = jwtData.verify;
        next();
      } else {
        res.statusCode = 403;
        response.error = constants.PERMISSION_ERROR;
        response.errorMessage = constants.PERMISSION_ERROR_DESCRIPTION;
        return res.json(response);
      }
    }
  }
};

// export data to use in other files
module.exports = tokenOptionalMiddleware;
