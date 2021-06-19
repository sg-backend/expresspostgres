const router = require("express").Router();
const User_controller = require("../controllers/User");
const UserDevice = require("../models/UserDevice");

var empty = require("is-empty");

router.get("/getAllUsers", User_controller.getallUser);
router.get("/User/:id", User_controller.getUser);
router.put("/User/:id", User_controller.updateUser);
router.delete("/User/:id", User_controller.deleteUser);

router.post("/logout", async (req, res) => {
    const device = await UserDevice.findOne({
        where:{
            deviceToken: req.body.device_id
        }
    });

    if(!empty(device)){
        (await device).destroy();
    }

    return res.status(200).json({ message: "Account has been logout successfully." });
});

module.exports = router;