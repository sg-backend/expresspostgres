const Sequelize = require("sequelize");
const db = require("../config/db");
const User = require("./User");

const DealBreaker = db.define("DealBreaker", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  jobRole: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null
  },
  minSalary: {
    type: Sequelize.DECIMAL,
    allowNull: true,
    defaultValue: null
  },
  maxSalary: {
    type: Sequelize.DECIMAL,
    allowNull: true,
    defaultValue: null
  },
  distance: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null
  },
  haveKids: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  houseOwner: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  hasCar: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  doSmoking: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  doDrinking: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  religiousView: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null
  },
  politicalView: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null
  },
  interestedIn: {
    type: Sequelize.JSON,
    allowNull: true,
    defaultValue: null
  },
  UserId: {
    type: Sequelize.INTEGER,
    unique: true,
  },
});

User.hasOne(DealBreaker);
DealBreaker.belongsTo(User);

module.exports = DealBreaker;
