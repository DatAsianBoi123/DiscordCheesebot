const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    user: {
        type: Object,
        required: true
    }
});
const dataSchema = new Schema({
    users: {
        type: Object,
        child: userSchema,
        required: true,
    },
    type: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Data = mongoose.model('Object', dataSchema);
module.exports = Data;