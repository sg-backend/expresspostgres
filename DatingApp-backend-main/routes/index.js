const routes = require("express").Router();
const authenticateToken = require("../helper/authenticateToken");

const loginSingup = require("./loginSingup");
const UserDetail = require("./userDetail");
const DealBreaker = require("./dealBreaker");

const User = require("./User");
const chat = require("./chat");
const matches = require("./matches");

// public URL
routes.use("/", loginSingup);

// secured URL
routes.use("/", authenticateToken, User, UserDetail, DealBreaker, chat, matches);

module.exports = routes;
