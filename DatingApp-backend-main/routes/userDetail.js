const router = require("express").Router();
const UserDetail_controller = require("../controllers/UserDetail");
const multer = require('multer');
const multerGoogleStorage = require('multer-cloud-storage');

const uploadHandler = multer({
    storage: multerGoogleStorage.storageEngine()
});

router.post("/userDetails/updateProfilePicture", UserDetail_controller.updateProfilePicture);

router.put("/userDetails/updateUserDetails", UserDetail_controller.updateUserDetails);

router.get("/userDetails/getUserDetails", UserDetail_controller.getUserDetails);

router.post("/userDetails/featuredImage", UserDetail_controller.storeFeaturedImage);

router.post("/userDetails/featuredVideo", uploadHandler.single('video'), UserDetail_controller.storeFeaturedVideo);

// router.post("/userDetails/create", UserDetail_controller.createUserDetail);

// router.get(
//   "/userDetails/getLoggedUserDetails",
//   UserDetail_controller.getLoggedUserDetails
// );

module.exports = router;