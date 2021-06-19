const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(401).send(error.message || error);
  }
}

module.exports = authenticateToken;
