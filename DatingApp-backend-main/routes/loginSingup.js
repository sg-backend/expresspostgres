const router = require("express").Router();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const User = require("../models/User");
const UserDetail = require("../models/UserDetail");
const ForgotPassword = require("../models/ForgotPassword");

var empty = require("is-empty");

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');
// Creates a client using Application Default Credentials
const cloudStorage = new Storage({
  projectId: 'lastingaffair-newdatingapp',
  keyFilename: __dirname + '/../lastingaffair-newdatingapp-ac09f05a394b.json'
});

const { Sequelize } = require("sequelize");
const UserDevice = require("../models/UserDevice");
const Op = Sequelize.Op;

const { EMAIL, PASSWORD, MAIN_URL } = {
  EMAIL: "lightyagamius@gmail.com",
  PASSWORD: "JemsHere@123",
  MAIN_URL: "https://mailgen.js/",
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
});
const MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "APP name",
    link: MAIN_URL,
  },
});

router.post("/register", async (req, res) => {
  try {
    const requestData = {
      ...req.body,
    };
    
    const UserExists = await User.findAll({
      where: {
        email: requestData.register.email,
      },
    });
    
    if (empty(UserExists)) {
      const createdUser = await new User(requestData.register).save();
      
      requestData.userDetailData.UserId = createdUser.id;
      
      const createdUserDetail = await new UserDetail(requestData.userDetailData).save();
      
      const extension = requestData.userDetailData.profilePhoto.includes("png") ? '.png' : '.jpeg';
      const bucket = cloudStorage.bucket('lastingaffair-newdatingapp.appspot.com');
      const fileName = `user-${createdUser.id}-profile-pic-${Date.now()}${extension}`;
      const file = bucket.file(fileName);

      const base64EncodedString = requestData.userDetailData.profilePhoto.replace(/^data:\w+\/\w+;base64,/, '');
      const fileBuffer = Buffer.from(base64EncodedString, 'base64')

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

      const updatedUserDetail = await createdUserDetail.update({
        profilePictureUrl: metadata.mediaLink
      });
      console.log(updatedUserDetail);

      return res.status(200).json({
        resCode: 200,
        message: "User registered successfully",
        data: JSON.stringify(createdUser) + JSON.stringify(createdUserDetail),
      });
    } else {
      console.log(
        "Exception : User already exists with email : ",
        requestData.register.email
      );
      return res
        .status(409)
        .json({ resCode: 409, message: "User already exist." });
    }
  } catch (err) {
    console.log("err: ", err.message);
    return res.status(405).json({ error: err.details || err.message || err });
  }
});

router.get("/activeAccount", async (req, res) => {
  try {
    const { token } = req.query;
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    await User.findByIdAndUpdate(user.id, { isActive: true });
    return res.redirect(`${process.env.WEBAPP_URL}/app/login`);
  } catch (err) {
    return res
      .status(401)
      .send(`<h1 style="text-align: center;">Invalid link</h1>`);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password, deviceId, fcmToken } = req.body;
    const selectedUser = await User.findOne({
      where: { email, password },
      raw: true,
    });
    if(selectedUser) {
      let userDevice = await UserDevice.findOne({
        where: {deviceToken: deviceId},
        raw: true
      });
      if(empty(userDevice)){
        userDevice = await new UserDevice({
          UserId: selectedUser.id,
          deviceToken: deviceId,
          fcmToken: fcmToken
        }).save();
      } else{
        userDevice = await UserDevice.update({
          UserId: selectedUser.id,
          deviceToken: deviceId,
          fcmToken: fcmToken
        },{
          where: { deviceToken: deviceId }
        });
      }
      const token = jwt.sign(selectedUser, process.env.TOKEN_SECRET, {
        expiresIn: "1 days",
      });
      res.status(200).json({ UserData: selectedUser, token });
    } else {
      res.status(401).json({ message: "Invalid Details" });
    }
  } catch (err) {
    return res.status(401).json({ error: err.details || err.message || err });
  }
});

router.post("/social-auth", async (req, res) => {
  try {
    const { email, socialAuthToken, loginMode, name, gender, profilePhotoUrl, deviceId, fcmToken } = req.body;
    let selectedUser = await User.findOne({
      where: {
        [Op.or]: [{email: email}, {socialAuthToken: socialAuthToken}] 
      },
      raw: true,
    });
    let isNewRecord = false;
    if(empty(selectedUser)){
      selectedUser = await new User({
        email: email,
        socialAuthToken: socialAuthToken,
        password: generatePassword(12),
        loginMode: loginMode,
        isVerified: true
      }).save();
      const createdUserDetail = await new UserDetail({
        name: name,
        gender: gender,
        profilePictureUrl: profilePhotoUrl,
        UserId: selectedUser.id
      }).save();
      isNewRecord = true;
    }
    let userDevice = await UserDevice.findOne({
      where: {deviceToken: deviceId},
      raw: true
    });
    if(empty(userDevice)){
      userDevice = await new UserDevice({
        UserId: selectedUser.id,
        deviceToken: deviceId,
        fcmToken: fcmToken
      }).save();
    } else{
      userDevice = await UserDevice.update({
        UserId: selectedUser.id,
        deviceToken: deviceId,
        fcmToken: fcmToken
      },{
        where: { deviceToken: deviceId }
      });
    }
    const token = jwt.sign(isNewRecord ? selectedUser.dataValues : selectedUser, process.env.TOKEN_SECRET, {
      expiresIn: "1 days",
    });
    res.json({ UserData: selectedUser, token });
  } catch (err) {
    return res.status(401).json({ error: err.details || err.message || err });
  }
});

router.post("/forgotPassword", async (req, res) => {
  try {
    const { email } = req.body;
    const OTP = "";
    const savedUser = await User.findOne({ where: { email }, raw: true });
    if (savedUser) {
      // delete OLD OTP if user request new
      await ForgotPassword.destroy({ where: { email: email } });

      this.OTP = String(Math.floor(Math.random() * 9999 + 999)).substring(0, 4);
      let expirationTime = await getExpirationTime();

      const forgotPasswordData = {
        email: savedUser.email,
        otp: this.OTP,
        expirationTime: expirationTime,
      };

      const savedData = await new ForgotPassword(forgotPasswordData).save();

      // mail body
      const mail = MailGenerator.generate({
        body: {
          name: savedUser.email,
          intro:
            "Your OTP is " +
            "<b>" +
            this.OTP +
            "</b>" +
            " NOTE : OTP will get expied in 30 minutes",
          outro:
            "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
      });
      // send mail
      await transporter.sendMail({
        from: EMAIL,
        to: email,
        subject: "Forgot Password",
        html: mail,
      });

      return res.json({
        resCode: 200,
        message: "OTP SENT ON MAIL",
      });
    } else {
      return res.status(402).send("Invalid email address");
    }
  } catch (err) {
    return res.status(402).send(err.message || err);
  }
});

router.post("/validateOtp", async (req, res) => {
  const { otp, email } = req.body;

  // cehck validity of OTP
  var currentDateObj = new Date();
  const selectedUser = await ForgotPassword.findOne({
    where: {
      email: email,
      otp: otp,
    },
  });
  if (selectedUser && new Date(selectedUser.expirationTime) > currentDateObj) {
    // delete OTP from Forgotpassword table
    await ForgotPassword.destroy({ where: { email: email } });
    return res.json({
      resCode: 200,
      message: "OTP verified !!",
    });
  } else {
    return res.status(401).json({
      resCode: 401,
      message: "Wrong OR Expired OTP !!",
    });
  }
});

router.post("/changePassword", async (req, res) => {
  const { email, password } = req.body;
  User.update(
    {
      password: password,
    },
    {
      where: {
        email: email,
      },
    }
  ).then((count) => {
    return res.send("Password Reset Successfully");
  });
});

router.get("/test", async (req, res) => {
  listBuckets();
  return res.send("Test working");
});

function generatePassword(length) {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

async function listBuckets() {
  try {
    const results = await cloudStorage.getBuckets();

    const [buckets] = results;

    console.log('Buckets:');
    buckets.forEach(bucket => {
      console.log(bucket.name);
    });
  } catch (err) {
    console.error('ERROR:', err);
  }
}

function getExpirationTime() {
  const minutes = 30;
  var oldDateObj = new Date();
  var newDateObj = new Date();
  newDateObj.setTime(oldDateObj.getTime() + minutes * 60 * 1000);
  return newDateObj;
}

module.exports = router;
