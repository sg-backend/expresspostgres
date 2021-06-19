const multer = require("multer");

exports.fileUpload = (key, path, ismultipal) => {
  const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, `public/${path}/`);
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}.${file.originalname.split(".").slice(-1)[0]}`);
    },
  });
  if (ismultipal) {
    return multer({ storage: storage }).array(key);
  } else {
    return multer({ storage: storage }).single(key);
  }
};

exports.xlsxUpload = () => {
  return multer({ storage: multer.memoryStorage() }).array("xlsxFile");
};
