const mongoose = require("mongoose");

const geoFenceSchema = new mongoose.Schema({
    city: {
        type: String,
    }
})

const geoFenceCollection = mongoose.model('geofence', geoFenceSchema);
module.exports = geoFenceCollection;