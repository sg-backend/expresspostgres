const Sequelize = require("sequelize");
const db = require("../config/db");

const UserDevice = db.define("UserDevice", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserId: {
    type: Sequelize.INTEGER
  },
  deviceToken: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  fcmToken: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  createdAt: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  updatedAt: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: true
  }
});

module.exports = UserDevice;
