const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGGO_URL, {
      useNewUrlParser: true,
    });
    if (conn.connection.readyState === 1) {
      console.log("DB connect");
    } else {
      console.log("ohhh no");
    }
  } catch (error) {
    console.log("loi");
  }
};

module.exports = dbConnect;
