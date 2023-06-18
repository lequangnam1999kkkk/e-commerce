const express = require("express");
const ctrl = require("../controllers/productCategory");
const { verifyAccessToken, isAdmin } = require("../middleware/verifyToken");

const router = express.Router();

router.post("/", [verifyAccessToken, isAdmin], ctrl.createCategory);
router.get("/", ctrl.getCategories);
router.put("/:pcid", [verifyAccessToken, isAdmin], ctrl.updateCategory);
router.delete("/:pcid", [verifyAccessToken, isAdmin], ctrl.deleteCategory);

module.exports = router;
