const constant = {
  // HTTP Status code.
  SUCCESS_STATUS_CODE: 200,
  VALIDATION_STATUS_CODE: 400,
  RECORD_NOT_FOUND_STATUS_CODE: 404,
  SOMETHING_WENT_WRONG_STATUS_CODE: 500,
  NOT_FOUND_STATUS_CODE: 404,
  SUCCESS: "성공",
  CREATE_STATUS_CODE: 201,
  PERMISSION_STATUS_CODE: 403,
};

// export module pool to be used in other files
module.exports = Object.freeze(constant);
