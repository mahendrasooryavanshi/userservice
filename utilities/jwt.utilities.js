const path = require("path");
const jwt = require("jsonwebtoken");
const secretJson = require("../secret.json");
const config = require("../config/config.json")[secretJson.ENVIRONMENT];

const jwtAuth = {
  JWTSighing: async (payload, TokenExpiryTime) => {
    // payload.version = config.VERSION;
    try {
      const token = await jwt.sign(payload, config.JWT_AUTH_KEY, {
        expiresIn: TokenExpiryTime + "h",
      });
      return {
        expiresIn: TokenExpiryTime + "h",
        token,
        status: true,
      };
    } catch (err) {
      return {
        expiresIn: TokenExpiryTime,
        token: "",
        status: false,
      };
    }
  },

  JWTVerify: async (token) => {
    try {
      return jwt.verify(token, config.JWT_AUTH_KEY, async (err, decoded) => {
        if (err) {
          return {
            status: false,
            verify: {},
            err: err,
          };
        } else {
          return {
            status: true,
            verify: decoded,
          };
        }
      });
    } catch (err) {
      return {
        status: false,
        verify: {},
      };
    }
  },
};

// export
module.exports = jwtAuth;
