const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`connection sucessfull ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error in MongoDB ${error}`);
  }
};

module.exports = connectDB;