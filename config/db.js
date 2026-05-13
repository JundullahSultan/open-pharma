const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb://modasseresrar1401_db_user:LpaRpnod1CksFuSM@ac-v4opydo-shard-00-00.nzzk1rh.mongodb.net:27017,ac-v4opydo-shard-00-01.nzzk1rh.mongodb.net:27017,ac-v4opydo-shard-00-02.nzzk1rh.mongodb.net:27017/bayyinah_db?ssl=true&replicaSet=atlas-pbtbkp-shard-0&authSource=admin&appName=Cluster0",
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
