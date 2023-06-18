const express = require("express");
const couponController = require("../controllers/coupon");
const { verifyAccessToken, isAdmin } = require("../middleware/verifyToken");

const router = express.Router();

router.get("/", couponController.getCoupons);
router.post(
  "/",
  [verifyAccessToken, isAdmin],
  couponController.createNewCoupon
);
router.put(
  "/:cid",
  [verifyAccessToken, isAdmin],
  couponController.updateCoupon
);
router.delete(
  "/:cid",
  [verifyAccessToken, isAdmin],
  couponController.deleteCoupon
);

module.exports = router;
