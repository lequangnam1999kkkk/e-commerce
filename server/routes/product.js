const express = require("express");
const ProductController = require("../controllers/product");
const { verifyAccessToken, isAdmin } = require("../middleware/verifyToken");
const uploader = require("../config/cloudinary.config");

const router = express.Router();

router.post("/", [verifyAccessToken, isAdmin], ProductController.createProduct);
router.get("/", ProductController.getProducts);
router.get("/:pid", ProductController.getProduct);
router.put("/ratings", verifyAccessToken, ProductController.ratings);

router.put(
  "/upload-image/:pid",
  [verifyAccessToken, isAdmin],
  uploader.array("images", 10),
  ProductController.uploadImageProduct
);

router.put(
  "/:pid",
  [verifyAccessToken, isAdmin],
  ProductController.updateProduct
);

router.delete(
  "/:pid",
  [verifyAccessToken, isAdmin],
  ProductController.deleteProduct
);

module.exports = router;
