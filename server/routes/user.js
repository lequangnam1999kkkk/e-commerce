const express = require("express");
const userController = require("../controllers/user");
const { verifyAccessToken, isAdmin } = require("../middleware/verifyToken");

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/current", verifyAccessToken, userController.getCurrent);
router.post("/refreshtoken", userController.refreshAccessToken);
router.get("/logout", userController.logout);
router.get("/forgotpassword", userController.forgotPassword);
router.put("/resetpassword", userController.resetPassword);

router.get("/", [verifyAccessToken, isAdmin], userController.getUsers);
router.delete("/", userController.deleteUser);
router.put("/cart", [verifyAccessToken], userController.updateCart);
router.put("/current", verifyAccessToken, userController.updateUser);
router.put(
  "/:uid",
  [verifyAccessToken, isAdmin],
  userController.updateUserByAdmin
);
router.put(
  "/address/user",
  verifyAccessToken,
  userController.updateUserAddress
);

module.exports = router;
