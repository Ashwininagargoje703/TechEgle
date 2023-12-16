var express = require("express");
var router = express.Router();
var productController = require("../controllers/product");
const authJwt = require("../auth/auth");

router.post("/addItem", authJwt.authenticateToken, productController.addItem);
router.get(
  "/getAllItems",
  authJwt.authenticateToken,
  productController.getAllItems
);
router.get(
  "/getAvailableInventory",
  authJwt.authenticateToken,
  productController.getAvailableInventory
);
router.get(
  "/addItemToCart",
  authJwt.authenticateToken,
  productController.addItemToCart
);
router.get(
  "/getUserCart",
  authJwt.authenticateToken,
  productController.getUserCart
);
router.post(
  "/removeCart",
  authJwt.authenticateToken,
  productController.removeCart
);

module.exports = router;
