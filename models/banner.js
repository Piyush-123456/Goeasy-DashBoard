const mongoose = require("mongoose");
const bannerSchema = mongoose.Schema({
    image: {
        fileId: String,
        url: String,
        thumbnailUrl: String
    },
    category: {
        type: String
    },
    subcategory: {
        type: String
    },
    status: {
        type: String,
        enum: ['Publish', 'Unpublish'],
        default: 'Unpublish'
    },
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: "Admin" }]

})

const BannerCollection = mongoose.model("Banner", bannerSchema);
module.exports = BannerCollection