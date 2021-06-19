const DealBreaker = require("../models/DealBreaker");
var empty = require("is-empty");

exports.updateDealBreakerDetails = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const requestData = {
      ...req.body,
      UserId: loggedInUser.id,
    };
    
    const dealBreakerDetail = await DealBreaker.findOne({
      where: { UserId: loggedInUser.id },
    });
    
    if (empty(dealBreakerDetail)) {
      const createdDealBreakerDetail = await new DealBreaker(requestData).save();
      return res.status(200).json({
        message: "Dealbreaker details has been updated successfully.",
        data: createdDealBreakerDetail,
      });
    } else {
      const updatedDealBreakerDetail = await dealBreakerDetail.update(requestData);
      return res.status(200).json({
        message: "Dealbreaker details has been updated successfully.",
        data: updatedDealBreakerDetail,
      });
    }
  } catch (err) {
    console.log("err: ", err.message);
    return res.status(405).json({ error: err.details || err.message || err });
  }
};

exports.getDealBreakerDetails = async (req, res) => {
  try {
    const loggedInDealBreaker = await DealBreaker.findOne({
      where: { UserId: req.user.id },
    });

    if (!empty(loggedInDealBreaker)) {
      return res.status(200).json({
        message: "DealBreaker details has been fetched successfully.",
        data: loggedInDealBreaker
      });
    } else {
      return res.status(404).json({
        message: "Record not found with id " + req.user.id
      });
    }
  } catch (err) {
    console.log("err: ", err);
    return res.status(405).json({ error: err.details || err.message || err });
  }
};
