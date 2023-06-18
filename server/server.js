const cookieParser = require("cookie-parser");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const dbConnect = require("./config/dbconnect");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const productCategoryRoute = require("./routes/productCategory");
const blogCategoryRoute = require("./routes/blogCategory");
const blogRoute = require("./routes/blog");
const brandRoute = require("./routes/brand");
const couponRoute = require("./routes/coupon");
const orderRouter = require("./routes/order");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
mongoose.set("strictQuery", true);

// db
dbConnect();

// route
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/productcategory", productCategoryRoute);
app.use("/api/blogcategory", blogCategoryRoute);
app.use("/api/blog", blogRoute);
app.use("/api/brand", brandRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("hi");
});

app.listen(port || 8000, () => {
  console.log(`Server running on http://localhost:${port}`);
});
