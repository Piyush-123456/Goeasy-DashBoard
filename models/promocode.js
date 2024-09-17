const mongoose = require("mongoose");

const promocodeSchema = new mongoose.Schema({
    promocodes: {
        type: String,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    maximumAmount: {
        type: Number,
        required: true
    },
    description: {
        type: String  // No 'required' here if you want it optional
    },
    expiryDate: {
        type: Date  // No 'required' here if you want it optional
    },
    status: {
        type: String,
        enum: ['Publish', 'Unpublish'],
        default: 'Unpublish'
    }
});

const promocodesCollection = mongoose.model('Promocode', promocodeSchema);

module.exports = promocodesCollection;
