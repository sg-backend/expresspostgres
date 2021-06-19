const User = require("../models/User");
// var empty = require("is-empty");

exports.getUser = async (req, res) => {
  try {
    const Users = await User.findByPk(req.params.id);
    return res.json({ message: "All User get successfully", data: Users });
  } catch (err) {
    console.log("err: ", err);
    return res.status(405).json({ error: err.details || err.message || err });
  }
};

exports.getallUser = async (req, res) => {
  try {
    const Users = await User.findAll();
    return res.json({ message: "All User get successfully", data: Users });
  } catch (err) {
    console.log("err: ", err);
    return res.status(405).json({ error: err.details || err.message || err });
  }
};

exports.updateUser = async (req, res) => {
  try {
    let updatedate = {
      ...req.body,
    };
    const selectedUser = await User.findOne({ where: { id: req.params.id } });
    const updatedUser = await selectedUser.update(updatedate);
    return res.json({ message: "User update successfully", data: updatedUser });
  } catch (err) {
    console.log("err: ", err);
    return res.status(405).json({ error: err.details || err.message || err });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    return res.json({ message: "User delete successfully", data: [] });
  } catch (err) {
    console.log("err: ", err);
    return res.status(405).json({ error: err.details || err.message || err });
  }
};
