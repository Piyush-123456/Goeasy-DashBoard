const mongoose = require("mongoose");

const DisputeSchema = new mongoose.Schema({
    dispute: {
        type: String,
    },
    disputetypefor: {
        type: String,
        enum: ['User', 'Vendor'],
        default: 'User'
    },
    Status: {
        type: String,
        enum: ['Publish', 'Unpublish'],
        default: 'Publish'
    }
})

const DisputeCollection = mongoose.model('Dispute', DisputeSchema);
module.exports = DisputeCollection;