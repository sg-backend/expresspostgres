const Sequelize = require("sequelize");
const db = require("../config/db");
const User = require("./User");

const Conversation = db.define("Conversation", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  conversationName: {
    type: Sequelize.STRING,
    allowNull: true,
    default: null
  },
  isGroup: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    default: false
  },
  startedBy: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: null
  },
  adminId: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null
  },
  createdAt:{
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  updatedAt:{
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: true
  }
});

User.hasOne(UserDetail);
UserDetail.belongsTo(User);

module.exports = UserDetail;
