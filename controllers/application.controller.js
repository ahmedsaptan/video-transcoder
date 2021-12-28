require("dotenv").config;
const createError = require("http-errors");
const { join, extname } = require("path");
const fs = require("fs-extra");
const Application = require("../models/app.model");
const ObjectId = require("mongoose").Types.ObjectId;
const { body } = require("express-validator");
const { checkValidations } = require("../helpers/checkMethods");

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
