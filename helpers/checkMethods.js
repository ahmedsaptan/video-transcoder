const createError = require("http-errors");
const { validationResult, matchedData } = require("express-validator");
const checkValidations = (req) => {
  const validationErrors = validationResult(req).array({
    onlyFirstError: true,
  });
  if (validationErrors.length > 0) {
    throw new createError(422, validationErrors[0].msg);
  }
  return matchedData(req);
};

module.exports = {
  checkValidations,
};
