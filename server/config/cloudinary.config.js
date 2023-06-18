const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: "dtpsy655t",
  api_key: "551118274322867",
  api_secret: "ALFOwAziMnb7e2NQsS9QcZi4w6I",
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png"],
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  params: {
    folder: "namshop",
  },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
