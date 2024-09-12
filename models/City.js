const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema({
    city_name: {
        type: String
    },
    status: {
        type: String,
        enum: ['Publish', 'Unpublish'],
        default: 'Unpublish'
    },
})

const CityCollection = mongoose.model("City", CitySchema);

module.exports = CityCollection;