const Cloud = require("@google-cloud/storage");
const path = require("path");
const serviceKey = require("../lastingaffair-newdatingapp-68f8c86c5ee4-keys.json");
const { Storage } = Cloud;
const storage = new Storage({
  keyFilename: serviceKey,
  projectId: "lastingaffair-newdatingapp",
});
module.exports = storage;
