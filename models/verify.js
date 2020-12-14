const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    users: {
        type: Object,
        required: true
    },
    type: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Data = mongoose.model('Verify', dataSchema);
module.exports = Data;