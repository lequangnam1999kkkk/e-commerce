const express = require("express");
const ctrl = require("../controllers/blogCategory");
const { verifyAccessToken, isAdmin } = require("../middleware/verifyToken");

const router = express.Router();

router.post("/", [verifyAccessToken, isAdmin], ctrl.createBlogCategory);
router.get("/", ctrl.getBlogCategories);
router.put("/:bcid", [verifyAccessToken, isAdmin], ctrl.updateBlogCategory);
router.delete("/:bcid", [verifyAccessToken, isAdmin], ctrl.deleteBlogCategory);

module.exports = router;
