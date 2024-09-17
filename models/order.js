const mongoose = require("mongoose");
const uuid = require("uuid");
const OrderCollection = new mongoose.Schema({
    orderid: {
        type: Number
    },
    service_partner_name: {
        type: String,
    },
    current_status: {

    }
})
