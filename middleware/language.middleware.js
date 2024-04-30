/**
 * language middleware file
 */

const languageMiddleware = async (req, res, next) => {
  const language = req.headers.language ? req.headers.language : "en";
  res.locals.language = language;
  next();
};

// export data to use in other files
module.exports = languageMiddleware;
