const UserDetail = require("../models/UserDetail");
const UserFeaturedImage = require("../models/UserFeaturedImage");
const mime = require('mime-types');

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');
// Creates a client using Application Default Credentials
const cloudStorage = new Storage({
  projectId: 'lastingaffair-newdatingapp',
  keyFilename: __dirname + '/../lastingaffair-newdatingapp-ac09f05a394b.json'
});

var empty = require("is-empty");

exports.updateProfilePicture = async(req, res) => {
  const bucket = cloudStorage.bucket('lastingaffair-newdatingapp.appspot.com');
  const fileName = `user-${req.user.id}-profile-pic-${Date.now()}.jpeg`;
  const file = bucket.file(fileName);
  const base64EncodedString = req.body.profilePicture.replace(/^data:\w+\/\w+;base64,/, '');
  const fileBuffer = Buffer.from(base64EncodedString, 'base64')

  await file.save(fileBuffer, {
    public: true,
    resumable: false,
    metadata: {
      contentType: "image/jpeg"
    },
    validation: false
  });

  const [metadata] = await file.getMetadata()
  console.log(metadata);

  const userDetail = await UserDetail.update({
    profilePictureUrl: metadata.mediaLink
  },{
    where: { UserId: req.user.id}
  });
  
  return res.status(200).json({
    resCode: 200,
    message: "User's profile picture updated successfully.",
    data: { profilePictureUrl: metadata.mediaLink }
  });
};

exports.updateUserDetails = async (req, res) => {
  try {
    const loggedInUser = req.user;
    
    let data = {
      ...req.body,
      UserId: loggedInUser.id,
    };

    const selectedUserDetail = await UserDetail.findOne({
      where: { UserId: loggedInUser.id },
    });
    
    if(empty(selectedUserDetail)){
      return res.status(404).json({message: "UserDetail not found."});
    }

    const updatedUserDetail = await selectedUserDetail.update(data);

    return res.status(200).json({
      message: "UserDetail has been updated successfully.",
      data: updatedUserDetail,
    });
  } catch (err) {
    console.log("err: ", err);
    return res.status(405).json({ error: err.details || err.message || err });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const loggedInUserDetail = await UserDetail.findOne({
      where: { UserId: req.user.id },
    });

    if (!empty(loggedInUserDetail)) {
      const feauredImages = await UserFeaturedImage.findAll({
        where: {UserId: req.user.id}
      });

      if(!empty(feauredImages)){
        loggedInUserDetail.dataValues.featuredImages = feauredImages;
      } else{
        loggedInUserDetail.dataValues.featuredImages = [];
      }
      
      return res.status(200).json({
        message: "UserDetail has been fetched successfully.",
        data: loggedInUserDetail
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

exports.storeFeaturedImage = async(req, res) => {
  const extension = req.body.image.includes("png") ? '.png' : '.jpeg';
  const bucket = cloudStorage.bucket('lastingaffair-newdatingapp.appspot.com');
  const fileName = `user-${req.user.id}-featured-img-${Date.now()}${extension}`;
  const file = bucket.file(fileName);
  const base64EncodedString = req.body.image.replace(/^data:\w+\/\w+;base64,/, '');
  const fileBuffer = Buffer.from(base64EncodedString, 'base64');

  await file.save(fileBuffer, {
    public: true,
    resumable: false,
    metadata: {
      contentType: "image/"+extension
    },
    validation: false
  });

  const [metadata] = await file.getMetadata()
  console.log(metadata);

  const featuredImage = await new UserFeaturedImage({
    UserId: req.user.id,
    url: metadata.mediaLink
  }).save();

  console.log(featuredImage);
  
  return res.status(200).json({
    message: "User's featured image stored successfully.",
    data: featuredImage
  });
};

exports.storeFeaturedVideo = async(req, res) => {
  console.log(req.file);
  
  const userDetail = await UserDetail.findOne({
    where: {
      UserId : req.user.id
    }
  });

  if(empty(userDetail)){
    res.status(409).json("User not found!");
  }

  const updatedData = await userDetail.update({
    featuredVideoUrl: req.file.linkUrl
  });

  return res.status(200).json({data: {userDetail: updatedData, url: req.file.linkUrl}});
};

exports.createUserDetail = async (req, res) => {
  try {
    const loggedUser = req.user;
    const createData = {
      ...req.body,
      UserId: loggedUser.id,
    };
    // check if userdetails in already exists
    const loggedUserDetail = await UserDetail.findOne({
      where: { UserId: loggedUser.id },
    });

    if (empty(loggedUserDetail)) {
      const createdUserDetail = await new UserDetail(createData).save();
      return res.json({
        resCode: 200,
        message: "UserDetail created successfully",
        data: createdUserDetail,
      });
    } else {
      console.log("Exception : UserDetail already exists");
      return res
        .status(409)
        .json({ resCode: 409, message: "UserDetail Already exist" });
    }
  } catch (err) {
    console.log("err: ", err.message);
    return res.status(405).json({ error: err.details || err.message || err });
  }
};

exports.getLoggedUserDetails = async (req, res) => {
  try {
    const loggedUser = req.user;

    const loggedUserDetail = await UserDetail.findOne({
      where: { UserId: loggedUser.id },
    });
    return res.json({
      message: "Logged UserDetail get successfully",
      data: loggedUserDetail,
    });
  } catch (err) {
    console.log("err: ", err);
    return res.status(405).json({ error: err.details || err.message || err });
  }
};