const router = require("express").Router();

const User = require("../models/User");
const UserDetail = require("../models/UserDetail");
const UserFeaturedImage = require("../models/UserFeaturedImage");

router.get("/getMatches", async (req, res) => {
    const users = await User.findAll({
        include: [UserDetail, UserFeaturedImage]
    });

    return res.status(200).json({records: users});
});


module.exports = router;