const mongoose = require("mongoose");
// /name, comments, status, actions - update or delete
const TestinomialsSchema = new mongoose.Schema({

    name: {
        type: String
    },
    comments: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Publish', 'Unpublish'],
        default: 'Unpublish'
    }

})

const TestinomialsCollection = mongoose.model('Testinomials', TestinomialsSchema);
module.exports = TestinomialsCollection;