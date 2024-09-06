// List Partner
// -ID 
// - Name with image
// - Email
// - Phone Number
// - Waller Balance
// -  Wallet Credit
// - Document Status 
// - Status
// - Actions

const mongoose = require("mongoose");

const partnerSchema = mongoose.Schema({
    Image: {
        thumbnailUrl: String,
        url: String,
    },
    email: {
        type: String
    },
    contact: {
        type: Number
    },
    walletBalance: {
        type: Number
    },
    walletCredit: {
        type: Number
    },
    status: {
        type: String,
        enum: ['Publish', 'Unpublish'],
        default: 'Unpublish'
    },
    actions: {
        type: String,
        enum: ['Make Approved', 'Make Deactive']
    }

})

const partnerCollection = mongoose.model("Partner", partnerSchema);

module.exports = partnerCollection;
