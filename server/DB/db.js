const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Successfully Connected`);
  } catch (error) {
    console.log(`Error is: ${error.message}`);
    process.exit();
  }
};

module.exports = connectDB;
