const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    wallet: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Active', 'Deactive', 'Temporary Deactive'],
        default: 'Active'
    }
}, {
    timestamps: true
});

const CustomerListCollection = mongoose.model('CustomerList', UserSchema);
module.exports = CustomerListCollection;
