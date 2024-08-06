const mongoose = require("mongoose");
const plm = require("passport-local-mongoose")
const adminSchema = mongoose.Schema({
    username: String,
    fullname: String,
    contact: Number,
    password: String,
    banner: [{ type: mongoose.Schema.Types.ObjectId, ref: "Banner" }],
    adsections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Adsection" }],
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification'
    }]
})

adminSchema.plugin(plm)

const AdminCollection = mongoose.model("Admin", adminSchema);
module.exports = AdminCollection;
