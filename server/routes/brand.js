const express = require("express");
const ctrl = require("../controllers/brand");
const { verifyAccessToken, isAdmin } = require("../middleware/verifyToken");

const router = express.Router();

router.post("/", [verifyAccessToken, isAdmin], ctrl.createNewBrand);
router.get("/", ctrl.getBrands);
router.put("/:bid", [verifyAccessToken, isAdmin], ctrl.updateBrand);
router.delete("/:bid", [verifyAccessToken, isAdmin], ctrl.deleteBrand);

module.exports = router;
