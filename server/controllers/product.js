const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing input");
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);

  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    success: newProduct ? true : false,
    createProduct: newProduct ? newProduct : "Cannot create new Product",
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid);
  return res.status(200).json({
    success: product ? true : false,
    getProduct: product ? product : "Cannot get product",
  });
});

// filtering sorting pagination
const getProducts = asyncHandler(async (req, res) => {
  const queries = { ...req.query };

  // Tách các trường đăc biệt ta khỏi query
  const excludedFields = ["limit", "sort", "page", "fields"];
  excludedFields.forEach((el) => delete queries[el]);

  //Format lại các operator cho đúng cú pháp mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (macthedEl) => `$${macthedEl}`
  );
  const formatedQueries = JSON.parse(queryString);

  // Filtering
  if (queries?.title)
    formatedQueries.title = { $regex: queries.title, $options: "i" };
  let queryCommand = Product.find(formatedQueries);

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }

  // fielding
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }

  // pagination
  // limit số object lấy về 1 gọi api
  // skip 2
  // 1 2 3 ... 10
  // +2 => 2
  // +slkjfsọi => NaN
  const page = +req.body.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);

  // Execute query
  // Số lượng sản phẩm thỏa mãn điều kiện
  queryCommand.exec(async (err, response) => {
    if (err) throw new Error(err.message);
    const counts = await Product.findOne(formatedQueries).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      products: response ? response : "Cannot get product",
      counts,
    });
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updatedProduct ? true : false,
    updatedProduct: updatedProduct ? updatedProduct : "Cannot update product",
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(pid);
  return res.status(200).json({
    success: deletedProduct ? true : false,
    deletedProduct: deletedProduct ? deletedProduct : "Cannot delete product",
  });
});

const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, pid } = req.body;
  if (!star || !pid) throw new Error("Missing input");

  const ratingProduct = await Product.findById(pid);
  const alreadyRating = ratingProduct?.ratings?.find(
    (el) => el.postedBy.toString() === _id
  );
  // console.log(alreadyRating);

  if (alreadyRating) {
    await Product.updateOne(
      {
        ratings: { $elemMatch: alreadyRating },
      },
      {
        $set: { "ratings.$.star": star, "ratings.$.comment": comment },
      },
      { new: true }
    );
  } else {
    await Product.findByIdAndUpdate(
      pid,
      {
        $push: { ratings: { star, comment, postedBy: _id } },
      },
      { new: true }
    );
    // console.log(response);
  }

  // Sim rating
  const updetedProduct = await Product.findById(pid);
  const ratingCounts = updetedProduct.ratings.length;
  const sumRatings = updetedProduct.ratings.reduce(
    (sum, el) => sum + +el.star,
    0
  );
  updetedProduct.totalRatings =
    Math.round((sumRatings * 10) / ratingCounts) / 10;

  await updetedProduct.save();

  return res.status(200).json({
    status: true,
    updetedProduct,
  });
});

const uploadImageProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (!req.files) throw new Error("Missing input");
  const response = await Product.findByIdAndUpdate(
    pid,
    {
      $push: { images: { $each: req.files.map((el) => el.path) } },
    },
    { new: true }
  );

  return res.status(200).json({
    success: response ? true : false,
    updateProduct: response ? response : "Cannot update images product",
  });
});

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  ratings,
  uploadImageProduct,
};
