const Sequelize = require("sequelize");
const db = require("../config/db");

const Message = db.define("Message", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  messageType: {
    type: Sequelize.ENUM,
    values: ['text', 'image', 'video'],
    allowNull: false,
    defaultValue: 'text'
  },
  mediaUrl: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null
  },
  senderId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  receiverId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  sentAt: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
});

module.exports = Message;