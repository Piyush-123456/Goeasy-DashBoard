const mongoose = require("mongoose");

const childCategorySchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory'
    },
    childcategory: {
        type: String,
    },
    price: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    platformCharge: {
        type: Number,
    },
    servicetime: {
        type: String,
    },
    maxquantity: {
        type: Number
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
    serviceQuantity: {
        type: Number
    },
    serviceDescription: {
        type: String,
    },
    city: {
        type: String
    }

})

const childCategoryCollection = mongoose.model("ChildCategory", childCategorySchema);
module.exports = childCategoryCollection;