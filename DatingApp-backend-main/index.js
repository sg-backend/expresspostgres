require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const allRoutes = require("./routes");

const db = require("./config/db.js");
db.authenticate()
  .then(() => {
    db.sync().then(() => {
      console.log("all table created");
    });
    console.log("Database connected...");
  })
  .catch((err) => {
    console.log("Error: " + err);
  });

const app = express();

app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/public", express.static(__dirname + "/public"));

app.use("/api", allRoutes);

const PORT =  3001;
app.listen(PORT, (error) => {
  if(error){
    console.log("Error",err);
    return console.log(error);
  }
  console.log("Server is up and running on port number: "+PORT);
});
