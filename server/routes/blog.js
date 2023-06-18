const express = require("express");
const blogController = require("../controllers/blog");
const { verifyAccessToken, isAdmin } = require("../middleware/verifyToken");
const uploader = require("../config/cloudinary.config");

const router = express.Router();

router.post("/", [verifyAccessToken, isAdmin], blogController.createNewBlog);
router.get("/", blogController.getBlogs);
router.put("/:bid", [verifyAccessToken, isAdmin], blogController.updateBlog);
router.get("/one/:bid", blogController.getBlog);
router.put("/like/:bid", [verifyAccessToken], blogController.likeBlog);
router.put(
  "/images/:bid",
  [verifyAccessToken, isAdmin],
  uploader.single("images"),
  blogController.uploadImageBlog
);
router.put("/dislike/:bid", [verifyAccessToken], blogController.dislikeBlog);
router.delete("/:bid", [verifyAccessToken, isAdmin], blogController.deleteBlog);

module.exports = router;
