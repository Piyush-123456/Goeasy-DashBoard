const mongoose = require("mongoose");

const subcategorySchema = mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subcategory: {
        type: String,
        required: true
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
    childCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChildCategory'
    }]
});

const SubcategoryCollection = mongoose.model("SubCategory", subcategorySchema);
module.exports = SubcategoryCollection;
