const blogCategory = require("../models/blogCategory");
const asyncHandler = require("express-async-handler");

const createBlogCategory = asyncHandler(async (req, res) => {
  const response = await blogCategory.create(req.body);
  return res.json({
    success: response ? true : false,
    createCategory: response ? response : "Can not create new blog-category",
  });
});

const getBlogCategories = asyncHandler(async (req, res) => {
  const response = await blogCategory.find().select("title _id");
  return res.json({
    success: response ? true : false,
    blogCategories: response ? response : "Can not get blog-category",
  });
});

const updateBlogCategory = asyncHandler(async (req, res) => {
  const { bcid } = req.params;

  const response = await blogCategory.findByIdAndUpdate(bcid, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updateCategory: response ? response : "Can not update blog-category",
  });
});

const deleteBlogCategory = asyncHandler(async (req, res) => {
  const { bcid } = req.params;

  const response = await blogCategory.findByIdAndDelete(bcid);
  return res.json({
    success: response ? true : false,
    deleteCategory: response ? response : "Can not delete blog-category",
  });
});

module.exports = {
  createBlogCategory,
  getBlogCategories,
  updateBlogCategory,
  deleteBlogCategory,
};
