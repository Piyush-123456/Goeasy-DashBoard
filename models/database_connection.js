const mongoose = require("mongoose")

exports.connectDB = async () => {
    try {
        // const conn = await mongoose.connect('mongodb://localhost:27017/GoeasyDashboard')
        const conn = await mongoose.connect('mongodb+srv://Piyush:Piyush_123@cluster0.tjfpn.mongodb.net/Goeasy')
        console.log("DB Connected!");
    }
    catch (err) {
        console.log(err.message);
    }
}