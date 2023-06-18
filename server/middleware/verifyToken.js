const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const verifyAccessToken = asyncHandler((req, res, next) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(403).json("Token is not valid");
      }
      req.user = decode;

      next();
    });
  } else {
    res.status(403).json("You are not authenticated");
  }
});
const isAdmin = asyncHandler((req, res, next) => {
  const { role } = req.user;
  if (role !== "admin")
    return res.status(401).json({
      success: false,
      mes: " REQUIRE ADMIN ROLE",
    });
  next();
});

module.exports = { verifyAccessToken, isAdmin };
