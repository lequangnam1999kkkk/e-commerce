const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");

const createNewCoupon = asyncHandler(async (req, res) => {
  const { name, discount, expiry } = req.body;
  if (!name || !discount || !expiry) throw new Error("Missing inputs");
  const response = await Coupon.create({
    ...req.body,
    expiry: Date.now() + +expiry * 24 * 60 * 1000,
  });
  return res.json({
    success: response ? true : false,
    createCoupon: response ? response : "Can not new coupon",
  });
});

const getCoupons = asyncHandler(async (req, res) => {
  const response = await Coupon.find().select("-createAt -updateAt");
  return res.json({
    success: response ? true : false,
    getCoupon: response ? response : "Can not get coupon",
  });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  if (req.body.expiry)
    req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000;
  const response = await Coupon.findByIdAndUpdate(cid, req.body, { new: true });
  return res.json({
    success: response ? true : false,
    updateCoupon: response ? response : "Can not update coupon",
  });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await Coupon.findByIdAndDelete(cid);
  return res.json({
    success: response ? true : false,
    deleteCoupon: response ? response : "Can not delete coupon",
  });
});

module.exports = { createNewCoupon, getCoupons, updateCoupon, deleteCoupon };
