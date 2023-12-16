const jwt = require("jsonwebtoken");
const secretKey = "Ashwini";
const Admin = require("../models/admin");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    res.status(401).send({
      response_code: 401,
      response: "Not Authenticated",
    });
    return false;
  }
  jwt.verify(token, secretKey, async (err, user) => {
    if (err) {
      return res.status(403).send({
        response_code: 403,
        response: "Invalid Token",
      });
    }
    let decodedArray = user.payload.split(" ");
    let phoneNumber = decodedArray[0];
    let userData = await Admin.findOne({ phoneNumber: phoneNumber }).lean();
    req.userData = userData;
    next();
  });
}

module.exports = { authenticateToken };
