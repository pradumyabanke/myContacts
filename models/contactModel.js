const mongoose = require("mongoose")

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Please add the contact Name"]
    },
    phone: {
        type: String,
        require: [true, "Please add the contact Phone Number"]
    },
    email: {
        type: String,
        require: [true, "Please add the email"]
    }

},
    {
        timestamps: true
    });

module.exports = mongoose.model("Contact", contactSchema);