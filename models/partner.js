const mongoose = require("mongoose");
// List Partner
// -ID 
// - Name with image
// - Email
// - Phone Number
// - Waller Balance
// -  Wallet Credit
// - Document Status 
// - Status
// - Actions

const partnerSchema = mongoose.Schema({
    
})

const partnerCollection = mongoose.model("Partner", partnerSchema)
module.exports = partnerCollection;