const Sequelize = require("sequelize");
const db = require("../config/db");
const User = require("./User");

const UserDetail = db.define("UserDetail", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  contactNumber: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null,
    validate: {
      not: {
        args: ["[a-z]", "i"],
        msg: "Please enter a valid number",
      },
    },
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
  dateOfBirth: {
    type: Sequelize.DATEONLY,
    allowNull: true,
    defaultValue: null
  },
  bio: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null
  },
  featuredVideoUrl: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null
  },
  location: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null
  },
  longitude: {
    type: Sequelize.FLOAT,
    allowNull: true,
    defaultValue: null
  },
  latitude: {
    type: Sequelize.FLOAT,
    allowNull: true,
    defaultValue: null
  },
  gender: {
    type: Sequelize.ENUM,
    values: ["male","female","trans"],
    allowNull: true,
    defaultValue: null
  },
  relationFriends: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  relationLongTerm:{
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  relationMarriage:{
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  relationFriendsWithBenefits:{
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  hasKids: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  numberOfKids: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  houseType: {
    type: Sequelize.ENUM,
    values: ["own", "rent"],
    allowNull: true,
    defaultValue: null
  },
  ownCar: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  smoke: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  drink:{
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  profilePictureUrl: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null
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
  UserId: {
    type: Sequelize.INTEGER,
    unique: true,
  },
});

User.hasOne(UserDetail);
UserDetail.belongsTo(User);

module.exports = UserDetail;
