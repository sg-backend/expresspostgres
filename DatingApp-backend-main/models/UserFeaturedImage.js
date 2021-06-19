const Sequelize = require("sequelize");
const db = require("../config/db");

const UserFeaturedImage = db.define("UserFeaturedImage", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserId: {
    type: Sequelize.INTEGER
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,
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

module.exports = UserFeaturedImage;
