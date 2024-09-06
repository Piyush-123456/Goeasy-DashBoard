const mongoose = require("mongoose");

const creditSchema = mongoose.Schema({
    creditAmount: {
        type: Number
    },
    Amount: {
        type: Number
    }
})

const creditCollection = mongoose.model("Credit_Package", creditSchema);
module.exports = creditCollection;

