const Sequelize = require("sequelize");
const db = require("../config/db");

const ForgotPassword = db.define("ForgotPassword", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  otp: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  expirationTime: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

module.exports = ForgotPassword;
