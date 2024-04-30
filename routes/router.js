const express = require("express");
const router = express.Router();
const signUp = require("../controllers/v1/auth/signup.controller");
const tokenMiddleware = require("./../middleware/token.middleware");
const tokenOptionalMiddleware = require("./../middleware/optional.token.middleware");
const languageMiddleware = require("../middleware/language.middleware");
const verifyController = require("../controllers/v1/auth/verify.controller");
const user = require("../controllers/v1/user/user.controller");
const login = require("./../controllers/v1/auth/login.controller");
const userAddress = require("../controllers/v1/address/address.controller");
const business = require("../controllers/v1/business/business.controller");
const follow = require("../controllers/v1/follow/follow.controller");
const tokenMiddlewareOTP = require("../middleware/tokenOTP.middleware");
const facebookLogin = require("../controllers/v1/auth/facebook.controller");
const googleLogin = require("../controllers/v1/auth/google.controller");
const uploadImage = require("../middleware/upload.middleware");
const uploadController = require("../controllers/v1/upload.controller");

/** User login Section */
router.post("/login", [languageMiddleware], login.index);

/** upload profile image Section **/
router.post(
  "/upload",
  uploadImage,
  [languageMiddleware, tokenOptionalMiddleware],
  uploadController.uploadUrl
);

/** User Signup Section **/
router.post(
  "/signUp",
  [languageMiddleware, tokenOptionalMiddleware],
  signUp.index
);

router.post(
  "/account/verify",
  [languageMiddleware, tokenMiddlewareOTP],
  verifyController.index
);

router.post(
  "/otp/resend/",
  [languageMiddleware, tokenMiddlewareOTP],
  verifyController.resend
);

router.post(
  "/addAddress",
  [languageMiddleware, tokenMiddleware],
  userAddress.addAddress
);

router.post(
  "/googleLogin",
  [languageMiddleware, tokenOptionalMiddleware],
  googleLogin.index
);

router.post(
  "/facebookLogin",
  [languageMiddleware, tokenOptionalMiddleware],
  facebookLogin.index
);
/** User Forgot Password Section **/
router.post("/forgotPassword", languageMiddleware, user.forgotPassword);
router.post("/forgotPassword/verify", languageMiddleware, user.verifyOtp);
router.post("/forgotPassword/resendOtp", languageMiddleware, user.resendOtp);
router.post("/resetPassword", languageMiddleware, user.resetPassword);

/** User Token section  **/
router.post(
  "/changePassword",
  [languageMiddleware, tokenMiddleware],
  user.changePassword
);

router.get(
  "/user/:userId",
  [languageMiddleware, tokenMiddleware],
  user.userDetail
);

/** Business section **/
router.get(
  "/businessDetail",
  [languageMiddleware, tokenMiddleware],
  business.businessProfile
);

/** Follow Section  **/
router.post(
  "/follow/",
  [languageMiddleware, tokenMiddleware],
  follow.makeFollow
);
router.delete(
  "/follow/",
  [languageMiddleware, tokenMiddleware],
  follow.unFollow
);
router.get(
  "/follow/",
  [languageMiddleware, tokenMiddleware],
  follow.followerList
);
router.put(
  "/acceptRejectRequest/",
  [languageMiddleware, tokenMiddleware],
  follow.acceptRejectRequest
);
router.get(
  "/following/",
  [languageMiddleware, tokenMiddleware],
  follow.followingList
);
router.get(
  "/followInvitation/",
  [languageMiddleware, tokenMiddleware],
  follow.followInvitationList
);
router.put(
  "/blockUser/",
  [languageMiddleware, tokenMiddleware],
  follow.blockUser
);
router.delete(
  "/removeRequest/",
  [languageMiddleware, tokenMiddleware],
  follow.removeRequest
);

module.exports = router;
