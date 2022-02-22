require("dotenv").config;
const Application = require("../models/app.model");
const { body } = require("express-validator");
const { checkValidations } = require("../helpers/checkMethods");
const { randomBytes } = require("crypto");
const validateCreateApp = () => {
  return [
    body("title")
      .exists()
      .withMessage("title is required")
      .bail()
      .notEmpty()
      .withMessage("title is empty"),
  ];
};
const createApplication = async (req, res, next) => {
  try {
    const body = checkValidations(req);

    const key = randomBytes(32).toString("hex");
    body.key = key;
    const app = new Application(body);
    await app.save();
    res.status(201).send({ application: app });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  createApplication,
  validateCreateApp,
};
