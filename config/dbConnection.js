const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connectionString =
      process.env.CONNECTION_STRING ||
      "mongodb+srv://pradum:CScYphBKeaLQZpW3@cluster0.dz5mfy2.mongodb.net/test";

    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
    });

    console.log("Database connected successfully");
  } catch (err) {
    console.log("Database connection failed. Running in degraded mode.");
    console.log(err.message);
  }
};

module.exports = connectDb;
