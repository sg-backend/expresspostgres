const Sequelize = require("sequelize");
const db = require("../config/db");
const UserDevice = require("./UserDevice");
const UserFeaturedImage = require("./UserFeaturedImage");

const User = db.define("User", {
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
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  socialAuthToken: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true
  },
  loginMode: {
    type: Sequelize.ENUM,
    values: ['email', 'google', 'apple'],
    allowNull: false,
    defaultValue: 'email',
  },
  isVerified: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }
});

User.hasMany(UserDevice);
UserDevice.belongsTo(User);

User.hasMany(UserFeaturedImage);
UserFeaturedImage.belongsTo(User);

module.exports = User;
