const mongoose = require("mongoose")

exports.connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://localhost:27017/GoeasyDashboard')
        console.log("DB Connected!");
    }
    catch (err) {
        console.log(err.message);
    }
}