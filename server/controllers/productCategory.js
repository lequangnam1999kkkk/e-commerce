const ProductCategory = require("../models/productCategory");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
  const response = await ProductCategory.create(req.body);
  return res.json({
    success: response ? true : false,
    createCategory: response ? response : "Can not create new product-category",
  });
});

const getCategories = asyncHandler(async (req, res) => {
  const response = await ProductCategory.find().select("title _id");
  return res.json({
    success: response ? true : false,
    productCategories: response ? response : "Can not get product-category",
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { pcid } = req.params;
  console.log(pcid);

  const response = await ProductCategory.findByIdAndUpdate(pcid, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updateCategory: response ? response : "Can not update product-category",
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { pcid } = req.params;

  const response = await ProductCategory.findByIdAndDelete(pcid);
  return res.json({
    success: response ? true : false,
    deleteCategory: response ? response : "Can not delete product-category",
  });
});

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
