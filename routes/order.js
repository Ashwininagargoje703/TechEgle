var express = require("express");
var router = express.Router();
var orderController = require("../controllers/order");
const authJwt = require("../auth/auth");

router.post(
  "/createOrder",
  authJwt.authenticateToken,
  orderController.createOrder
);
router.post(
  "/changeOrderStatus",
  authJwt.authenticateToken,
  orderController.changeOrderStatus
);
router.get(
  "/getMyOrders",
  authJwt.authenticateToken,
  orderController.getMyOrders
);
router.get(
  "/getOrderDetails/:id",
  authJwt.authenticateToken,
  orderController.getOrderDetails
);

module.exports = router;
