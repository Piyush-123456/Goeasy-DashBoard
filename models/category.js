const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    subtitle: {
        type: String
    },
    image: {
        fileId: String,
        url: String,
        thumbnailUrl: String
    },
    status: {
        type: String,
        enum: ['Publish', 'Unpublish'],
        default: 'Unpublish'
    },
    subcategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory'
    }],
   
});

const CategoryCollection = mongoose.model("Category", categorySchema);
module.exports = CategoryCollection;
