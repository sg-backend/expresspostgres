var buffer = require("buffer");
var path = require("path");
var fs = require("fs");
const dir = "./files";
var base64Img = require("base64-img");
const gc = require("../config/cloudBucketConfig");
const bucket = gc.bucket("datingfiles");
function encode_base64(filename) {
  fs.readFile(
    path.join(__dirname, "/public/", filename),
    function (error, data) {
      if (error) {
        throw error;
      } else {
        var buf = Buffer.from(data);
        var base64 = buf.toString("base64");
        return base64;
      }
    }
  );
}

function decodeBase64(base64str) {
  let base64Image = base64str.split(";base64,").pop();
  const filename = Math.random().toString().substr(2, 8) + ".png";

  var filePath = base64Img.imgSync(base64str, "profilepics", filename);

  // Upload the image to the bucket
  bucket.upload(
    __dirname.slice(0, -15) + filePath,
    {
      destination: "profile-images/576dba00c1346abe12fb502a-original.jpg",
      public: true,
      validation: "md5",
    },
    function (error, file) {
      if (error) {
        sails.log.error(error);
      }

      // return res.ok("Image uploaded");
    }
  );

  // // create new directory
  // try {
  //   // first check if directory already exists
  //   if (!fs.existsSync(dir)) {
  //     fs.mkdirSync(dir);
  //     console.log("Directory is created.");
  //   } else {
  //     console.log("Directory already exists.");
  //   }
  // } catch (err) {
  //   console.log(err);
  // }
  // const path = dir + "/" + filename;
  // fs.writeFile(path, base64Image, { encoding: "base64" }, function (error) {
  //   if (error) {
  //     throw error;
  //   } else {
  //     console.log("File created from base64 string!" + filename);
  //   }
  // });
  return filename;
}
module.exports = {
  encode_base64,
  decodeBase64,
};
