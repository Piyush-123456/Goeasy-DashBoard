const mongoose = require("mongoose");

const AdsectionSchema = new mongoose.Schema({
    category: {
        type: String,
    },
    title: {
        type: String,
    },
    price: {
        type: Number,
    },
    image: {
        fileId: String,
        thumbnailUrl: String,
        url: String,
    },
    status: {
        type: String,
        enum: ['Publish', 'Unpublish'],
        default: 'Unpublish'
    },
})

const AdsectionCollection = mongoose.model("Adsection", AdsectionSchema)
module.exports = AdsectionCollection;