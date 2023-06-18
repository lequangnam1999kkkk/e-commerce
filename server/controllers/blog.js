const Blog = require("../models/blog");
const asyncHandler = require("express-async-handler");

const createNewBlog = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category) throw new Error("Missing input");
  const response = await Blog.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    createdBlog: response ? response : "Cannot create new blog",
  });
});

const updateBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing input");
  const response = await Blog.findByIdAndUpdate(bid, req.body, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    updatedBlog: response ? response : "Cannot update new blog",
  });
});

const getBlogs = asyncHandler(async (req, res) => {
  const response = await Blog.find();
  return res.status(200).json({
    success: response ? true : false,
    getBlog: response ? response : "Cannot get blog",
  });
});

/**
 * khi người dùng like block thì
 * check xem người đó có dislike hay không => bỏ dislike
 * check xem người đó có like hay không => bỏ like /them like
 */

const likeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.params;

  if (!bid) throw new Error("Missing input");
  const blog = await Blog.findById(bid);
  const alreadyDislike = blog?.dislikes?.find((el) => el.toString() === _id);
  if (alreadyDislike) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { dislikes: _id } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      rs: response,
    });
  }

  const isLiked = blog?.likes?.find((el) => el.toString() === _id);

  if (isLiked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { likes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $push: { likes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
});

const dislikeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.params;

  if (!bid) throw new Error("Missing input");
  const blog = await Blog.findById(bid);
  const alreadyLike = blog?.likes?.find((el) => el.toString() === _id);
  if (alreadyLike) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { likes: _id } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      rs: response,
    });
  }

  const isDisLike = blog?.dislikes?.find((el) => el.toString() === _id);

  if (isDisLike) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { dislikes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $push: { dislikes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
});

const getBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const blog = await Blog.findByIdAndUpdate(
    bid,
    { $inc: { numberView: 1 } },
    { new: true }
  )
    .populate("likes", "fullName")
    .populate("dislikes", "fullName");
  return res.json({
    success: blog ? true : false,
    rs: blog,
  });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const blog = await Blog.findByIdAndDelete(bid);

  return res.json({
    success: blog ? true : false,
    deleteBlog: blog || "Something went wrong",
  });
});

const uploadImageBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  if (!req.file) throw new Error("Missing input");
  const response = await Blog.findByIdAndUpdate(
    bid,

    { image: req.file.path },

    { new: true }
  );

  return res.status(200).json({
    success: response ? true : false,
    updateBlog: response ? response : "Cannot update images product",
  });
});

module.exports = {
  createNewBlog,
  updateBlog,
  getBlog,
  likeBlog,
  dislikeBlog,
  getBlogs,
  deleteBlog,
  uploadImageBlog,
};
