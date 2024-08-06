const mongoose = require("mongoose");
const NotificationSchema = new mongoose.Schema({
    image: {
        thumbnailUrl: String,
        fileId: String,
        url: String,
    },
    title: {
        type: String,
    },
    message: {
        type: String,
    },
    usertype: {
        type: String,
        enum: ['Vendor', 'User'],
        default: 'Unpublish'
    },
    status: {
        type: String,
        enum: ['Publish', 'Unpublish'],
        default: 'Unpublish'
    },
})

const NotificationCollection = mongoose.model("Notification", NotificationSchema)
module.exports = NotificationCollection;