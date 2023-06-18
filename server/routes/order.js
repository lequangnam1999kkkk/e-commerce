const express = require("express");
const orderController = require("../controllers/order");
const { verifyAccessToken, isAdmin } = require("../middleware/verifyToken");

const router = express.Router();

router.post("/", verifyAccessToken, orderController.createOrder);
router.get("/", verifyAccessToken, orderController.getUserOrder);
router.get("/admin", [verifyAccessToken, isAdmin], orderController.getOrders);
router.put(
  "/status/:oid",
  [verifyAccessToken, isAdmin],
  orderController.updateStatus
);

module.exports = router;
