const mongoose = require("mongoose");

const customNotificationSchema = new mongoose.Schema({
    serviceType: {
        type: String,
        enum: ['User', 'Provider'],
        default: 'User'
    },
    schedule_At: {
        type: String,
    },
    Message: {
        type: String,
    }
})

const customNotificationCollection = mongoose.model('customNotification', customNotificationSchema);
module.exports = customNotificationCollection;