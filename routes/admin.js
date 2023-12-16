var express = require('express');
var router = express.Router();
var adminController = require("../controllers/admin")
const authJwt = require("../auth/auth");

router.post("/register",adminController.register);

router.post("/login", adminController.login);

router.get("/refreshToken", [authJwt.authenticateToken], adminController.refreshToken);

module.exports = router;