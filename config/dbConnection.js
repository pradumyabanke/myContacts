const mongoose = require("mongoose")

const connectDb = async () => {
    try {
        const connect = await mongoose.connect("mongodb+srv://pradum:CScYphBKeaLQZpW3@cluster0.dz5mfy2.mongodb.net/test", {
            useNewUrlParser: "true",
       });
        console.log(
            "Database connected successfully"
        );
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = connectDb;