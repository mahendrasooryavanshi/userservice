const express = require("express");
const sls = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const languageUtility = require("./utilities/language.utilities");
// parse application/x-www-form-urlencoded
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({ allowedHeaders: "Content-Type,Authorization,language" }));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization,language"
  );
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET");

  next();
});
app.use(require("./routes/router"));
app.use(express.static("uploads"));
// const constant = require("./constants/en");

app.use(async (req, res, next) => {
  // respond with json with set status code 404.
  let myLang = "en";
  if (req.headers && req.headers.language) {
    myLang = req.headers.language;
  }
  const constant = await languageUtility(myLang);

  res.status(constant.NOT_FOUND_STATUS_CODE);
  if (req.accepts("json")) {
    res.json({
      error: constant.NOT_FOUND_ERROR,
      errorMessage: constant.NOT_FOUND,
    });
    return;
  }
});
app.get("/test", async (req, res, next) => {
  res.status(200).send("server is working!");
});

module.exports.server = sls(app);
