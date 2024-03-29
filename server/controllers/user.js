const User = require("../models/user");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/jwt");
const user = require("../models/user");

const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(500).json("Missing input");
  }

  const user = await User.findOne({ email });
  if (user) {
    throw new Error("User has exited");
  } else {
    const newUser = await User.create(req.body);
    res.status(200).json({
      success: newUser ? true : false,
      message: newUser ? "Register successfully" : "Something went wrong",
    });
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(500).json("Missing input");
  }

  const response = await User.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    const { password, role, refreshToken, ...userData } = response.toObject();
    const accessToken = generateAccessToken(response._id, role);
    const newReFreshToken = generateRefreshToken(response._id);

    await User.findByIdAndUpdate(
      response._id,
      { refreshToken: newReFreshToken },
      { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      userData,
    });
  } else {
    res.status(500).json("Invalid Credentials");
  }
});

const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select(
    " -password -refreshToken -role"
  );
  return res.status(200).json({
    success: user ? true : false,
    message: user ? user : "User not Found",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie && cookie.refreshToken) throw new Error("No refresh in cookie");

  const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  const response = await User.findOne({ _id: rs._id }, process.env.JWT_SECRET);
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id, response.role)
      : "Refresh token matched",
  });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie && !cookie.refreshToken) throw new Error("No refresh in token");

  await User.findByIdAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    message: "Logout Successfully",
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) throw new Error("Missing email");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const resetToken = user.createPasswordChangeToken();
  await user.save();

  const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here</a>`;

  const data = {
    email,
    html,
  };
  const rs = await sendMail(data);
  return res.status(200).json({
    success: true,
    rs,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) throw new Error("Missing inputs");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Invalid reset token");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangedAt = Date.now();
  user.passwordResetExpires = undefined;
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    mes: user ? "Updated password" : "Something went wrong",
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const response = await User.find().select("-refreshToken -password -role");
  return res.status(200).json({
    success: response ? true : false,
    users: response,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  if (!_id) throw new Error("Missing inputs");
  const response = await User.findByIdAndDelete(_id);
  return res.status(200).json({
    success: response ? true : false,
    deletedUser: response
      ? `User with email ${response.email} deleted`
      : "No user delete",
  });
});

const updateUser = asyncHandler(async (req, res) => {
  //
  const { _id } = req.user;
  if (!_id || Object.keys(req.body).length === 0)
    throw new Error("Missing inputs");
  const response = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select("-password -role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Some thing went wrong",
  });
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
  //
  const { uid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  const response = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-password -role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    updatedAdminUser: response ? response : "Some thing went wrong",
  });
});

const updateUserAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!req.body.address) throw new Error("Missing input");
  const response = await User.findByIdAndUpdate(
    _id,
    { $push: { address: req.body.address } },
    { new: true }
  ).select("-refreshToken -password -role");

  return res.status(200).json({
    success: response ? true : false,
    updateUser: response ? response : "Something went wong",
  });
});

const updateCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, quantity, color } = req.body;
  if (!pid || !quantity || !color) throw new Error("Missing input");

  const user = await User.findById(_id).select("cart");
  const alreadyProduct = user?.cart?.find(
    (el) => el.product.toString() === pid
  );
  if (alreadyProduct) {
    if (alreadyProduct.color === color) {
      const response = await User.updateOne(
        { cart: { $elemMatch: alreadyProduct } },
        { $set: { "cart.$.quantity": quantity } },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        updateUser: response ? response : "Something went wrong",
      });
    } else {
      const response = await User.findByIdAndUpdate(
        _id,
        { $push: { cart: { product: pid, quantity, color } } },
        { new: true }
      );

      return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : "Something went Wrong",
      });
    }
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      { $push: { cart: { product: pid, quantity, color } } },
      { new: true }
    );

    return res.status(200).json({
      success: response ? true : false,
      updatedUser: response ? response : "Something went wrong",
    });
  }
});

module.exports = {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUser,
  updateUser,
  updateUserByAdmin,
  updateUserAddress,
  updateCart,
};
