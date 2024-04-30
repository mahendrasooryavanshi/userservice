"use strict";
const secretJson = require("../../config/config.json");
const secretEnvironment = require("../../config/config.json")[
  secretJson.environment
];

const config = require("../../config/config.json")[secretJson.environment];
const AWS = require("aws-sdk");
// Set the Region
// AWS.config.update({
//   accessKeyId: config.access_key,
//   secretAccessKey: config.secret_access_key,
//   region: config.region,
//   signatureVersion: "v4",
// });

const s3 = new AWS.S3();
const headers = {
  "Access-Control-Allow-Origin": "*", // Required for CORS support to work
};
const languageHelper = require("../../utilities/language.utilities");

module.exports.uploadUrl = async (req, res) => {
  const myLang = res.locals.language;
  let userInfo = res.locals.userData;
  let file = req.file;

  const constants = await languageHelper(myLang);
  let response = {};
  try {
    response.message = constants.FILE_UPLOAD;
    res.statusCode = constants.SUCCESS_STATUS_CODE;
    response.files = file;
    let filenames = [];
    if (req.files.length) {
      req.files.map((ele) => {
        filenames.push(ele);
      });
      response.filenames = filenames;
    }
    return res.json(response);
  } catch (error) {
    console.log("error", "try-catch: upload Controller failed.", error);
    res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE;
    response.error = constants.SOMETHING_WENT_WRONG_TYPE;
    response.errorMessage = constants.SOMETHING_WENT_WRONG;
    return res.json(response);
  }
};
