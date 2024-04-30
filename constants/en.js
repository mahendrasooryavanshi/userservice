const _constant = {
  // HTTP Status code.
  CREATE_STATUS_CODE: 201,
  SUCCESS_STATUS_CODE: 200,
  VALIDATION_STATUS_CODE: 400,
  NOT_FOUND_STATUS_CODE: 404,
  SOMETHING_WENT_WRONG_STATUS_CODE: 500,
  PERMISSION_ERROR_STATUS_CODE: 403,
  ALREADY_EXIST_STATUS_CODE: 409,
  UNAUTHORIZED_CODE: 401,
  PERMISSION_STATUS_CODE: 403,

  // Validation type
  VALIDATION_TYPE_ERROR: "validationError",
  SUCCESS: "Success",
  TOKEN_REQUIRED_ERROR: "tokenMissingError",
  TOKEN_INVALID_ERROR: "verificationFailed",
  PERMISSION_ERROR: "permissionError",
  SOMETHING_WENT_WRONG_TYPE: "internalIssue",
  NOT_FOUND_ERROR: "notFound",

  TOKEN_EXPIRED: "Session is expired",
  TOKEN_VALIDATION: "Token is required",
  RECORD_NOT_FOUND: "Record not found.",
  TOKEN_MISSING_ERROR: "Authentication credentials were not provided.",
  SOMETHING_WENT_WRONG: "Something wrong. Please try again",
  PERMISSION_ERROR_DESCRIPTION:
    "You do not have permission to perform this action.",
  INVALID_REQUEST_ERROR: "invalid_request",
  NOT_FOUND: "Invalid page. Please go back and request Again.",
  NOT_FOUND_DESCRIPTION_ERROR: "Record not found.",

  TITLE_REQUIRED: "title is required",
  ABOUT_REQUIRED: "about is required",
  USER_ID_NOT_EXIST: "User id not Exist.",
  FILE_UPLOAD: "File uploaded successfully.",
  FILE_SELECT: "Please select any file",
  MOBILE_NUMBER_REQUIRED: "The Mobile number is required",
  COUNTRY_CODE_REQUIRED: "The Country code is required",
  DUPLICATE_NUMBER_EXIST: "Mobile number is existed",

  DUPLICATE_EMAIL_EXIST: "Email already exists.",
  COUNTRY_CODE_FORMATE: "The country code is required.",
  MOBILE_NUMBER_FORMATE: "The mobile number is required.",
  MIN_COUNTRY_CODE_VALIDATE: "CountryCode must be minimum 1 number required.",
  MAX_COUNTRY_CODE_VALIDATE: "CountryCode may not be greater than 4 number.",
  MIN_MOBILE_NUMBER_VALIDATE: "MobileNumber must be minimum 8 number required.",
  MAX_MOBILE_NUMBER_VALIDATE: "MobileNumber may not be greater than 16 number.",
  BUSINESS_NAME_REQUIRED: "The businessName field is required.",

  BUSINESS_EMAIL_FORMATE: "The businessEmail format is invalid.",
  BUSINESS_ADDRESS_FORMATE: "The businessAddress field is required.",
  LATITUBE_FORMATE: "The latitube field is required.",
  LONGITUBE_FORMATE: "The longitube field is required.",
  EMAIL_REQUIRED: "The email field is required.",
  EMAIL_FORMATE: "The email format is invalid.",
  USER_NOT_FOUND: "No user found.",
  OTP_REQUIRED: "OTP required.",

  OTP_VERIFIED: "OTP verified.",
  MAX_OTP_FORMATE: "Invalid otp.",
  CONFIRM_PASSWORD_REQUIRED: "The confirm password field is required.",
  PASSWORD_REQUIRED: "The password field is required.",
  MIN_PASSWORD_VALIDATE: "The password must be at least 6 characters",
  MAX_PASSWORD_VALIDATE: "The password may not be greater than 50 characters",

  MIN_CONFIRM_PASSWORD_VALIDATE:
    "The confirm password must be at least 6 characters",
  MAX_CONFIRM_PASSWORD_VALIDATE:
    "The confirm password may not be greater than 50 characters",
  NOT_MATCHED_PASSWORD: "Password and confirm password not matched.",
  PASSPORT_UPDATED: "Password Update Successfully",
  WRONG_CREDENTIALS_TYPE: "invalidGrant",
  WRONG_CREDENTIALS: "Invalid user credentials",
  WRONG_PASSWORD: "Wrong password",

  USER_LOGOUT: "User has been logout Successfully",

  TEMP_USER_NOT_FOUND: "notFound",
  TEMP_USER_NOT_FOUND_MSG: "Sorry! Something wrong please try again ",
  ALREADY_RATING: "You are already rated this user.",

  SELF_FOLLOWED: "You can't follow your self",
  SELF_SUBSCRIBE: "You can't subscribe your self",
  VERSION_ERROR: "Invalid Version",

  GOOGLE_TOKEN_REQUIRED: "Access token required",
  SOCIAL_ID_REQUIRED: "social id required",
  NO_GOOGLE_ACCOUNT: "No google account found.",
  NO_USERS_FOUND: "No users found.",
  LINK_REQUIRED: "The link field is required.",
  REFRESH_TOKEN_INVALID_ERROR: "refresh_verification_failed",
  TOKEN_INVALID: "Token is invalid",

  TOKEN_EXPIRED_ERROR: "sessionExpired",
  EMAIL_INVALID_PASSWORD: "Invalid email format",
  INVALID_DEVICE_TYPE: "Invalid device type.",
  INVALID_TYPE: "Invalid type",
  INACTIVE_USER: "Your profile was in active.",
  INACTIVE_USER_ERROR: "inActiveUser",
  NOT_FOUND: "Invalid page. Please go back and request Again.",

  PRIVATE_USER_ERROR: "privateAccount",
  NO_REQUEST_FOUND: "No request found",

  DUPLICATE_USERNAME_EXIST: "UserName already exists.",
  SUCCESS: "Success",
  ALREADY_FOLLOW: "Already followed",
  ALREADY_REQUESTED: "Already requested",
  REQUEST_NOT_FOUND: "Request not found",
  STATUS_REQUIRED: "Status is required",
  BLOCKED: "You can't follow this user because you are blocked",

  CHECK_PASSWORD:
    "Password must be minimum 6 characters and maximum 50 characters long",

  USER_IDS_REQUIRED: "The userIds field is required.",
  TYPE_REQUIRED: "The type field is required.",
  USER_ID_REQUIRED: "The userId field is required.",
  RATING_REQUIRED: "The rating field is required.",
  ID_REQUIRED: "Id field is required.",

  MAX_LAST_NAME_VALIDATE:
    "The last name may not be greater than 50 characters.",
  DUPLICATE_ACCOUNT_EXIST_ERROR: "account_exist",
  DUPLICATE_ACCOUNT_EXIST: "Account already exist.",
  isFollowerPrivate: "The isFollowPrivate field is required.",
  USER_BLOCKED: "User blocked successfully.",
  WRONG_OTP: "wrong_otp",
  WRONG_OTP_MSG: "Sorry! code was mismatch",

  USER_UNBLOCKED: "User unblocked successfully.",
  SEND_MAIL:
    "We sent a OTP on your registered email address to reset password.",

  SUBSCRIBE: "User has been subscribed Successfully",
  UNSUBSCRIBE: "User has been unsubscribed Successfully",
  USER_LOGOUT: "User has been logout Successfully",
  PRIVATE_FOLLOW_ERROR: "You do not have permission to see following list",
  FULL_NAME_REQUIRED: "The name field is required.",
  PHONE_NUMBER: "Phone Number field is required.",
  ADDRESS_REQUIRED: "Address field is required.",
  SOCIAL_ACCOUNT_ERROR: "Social login users can't request for forgot password.",
  NO_SUBSCRIBE: "You are not subscribe to this user.",
  ADDRESS_NOT_VALID: "Address not valid.",
  NOTIFICATION_ID_REQUIRED: "Notification Id field is required.",
  INVALID_BUILDNUMBER_TYPE: "Invalid build number",

  PRIVATE_ACCOUNT: "Not found due to private account.",
  UPDATE_PERSONAL_INFO: "Personal Info has been updated successfully.",
  UPDATE_PROFILE: "Profile has been updated successfully.",

  //Address field validation
  ADDRESS_LINE_1_REQUIRED: "The address line 1 field is required.",
  COUNTRY_REQUIRED: "The country field is required.",
  CITY_REQUIRED: "The city field is required.",
  STATE_REQUIRED: "The state field is required.",
  ZIPCODE_REQUIRED: "The zip code field is required.",
  LAT_REQUIRED: "The lat field is required.",
  LONG_REQUIRED: "The long field is required.",
  ADD_ADDRESS_SUCCESS: "Add address successfully.",

  // Change Password Validation
  OLD_PASSWORD_REQUIRED: "The old password field is required.",
  MIN_OLD_PASSWORD_VALIDATE: "The old password must be at least 6 characters.",
  MAX_OLD_PASSWORD_VALIDATE:
    "The old password may not be greater than 50 characters.",
  NEW_PASSWORD_REQUIRED: "The new password field is required.",
  MIN_NEW_PASSWORD_VALIDATE: "The new password must be at least 6 characters.",
  MAX_NEW_PASSWORD_VALIDATE:
    "The new password may not be greater than 50 characters.",
  OLD_PASS_NOT_MATCH: "Old password does not match",
  CHANGE_PASSWORD_SUCCESS: "Password updated successfully.",

  // --------------------------
  FACEBOOK_TOKEN_REQUIRED: "facebook token required",
  GOOGLE_TOKEN_REQUIRED: "Access token required",
  SOCIAL_ID_REQUIRED: "social id required",
  NO_GOOGLE_ACCOUNT: "No google account found.",
  FACEBOOK_ACC_NOT_EXIST: "facebook account not exist",
  FACEBOOK_ACC_ALREADY_EXIST: "facebook account is already existed",
  ACCOUNT_TEMPORARY_INACTIVE: "account temporary inactive ",
};

// export module pool to be used in other files
export const constant = Object.freeze(_constant);
