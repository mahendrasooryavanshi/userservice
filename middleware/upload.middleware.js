const multer = require("multer");
const languageHelper = require("../utilities/language.utilities");
const secretJson = require("../config/config.json");

const config = require("../config/config.json")[secretJson.environment];
const uploadImage = (req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/temp/");
    },
    filename: function (req, file, cb) {
      let extension = file.originalname.split(".")[1];
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "." + extension);
    },
  });
  const upload = multer({ storage: storage }).array("image", 5);
  upload(req, res, async function (err) {
    let myLang = "en";
    if (req.headers && req.headers.language) {
      myLang = req.headers.language;
    }
    let userInfo = res.locals.userData;
    const constants = await languageHelper(myLang);
    let response = {};
    // console.log("req=====>", req);
    if (!req.files) {
      response.message = constants.FILE_SELECT;
      res.statusCode = constants.VALIDATION_STATUS_CODE;
      return res.json(response);
    }
    if (err) {
      console.log("error ++++++++++++++");
      next();
      // An unknown error occurred when uploading.
    } else {
      console.log("success");
      next();
    }
    // Everything went fine.
  });
};

module.exports = uploadImage;
