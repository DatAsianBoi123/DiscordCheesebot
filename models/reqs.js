const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSchema = new Schema({
  reqs: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Data = mongoose.model('Requirements', dataSchema);
module.exports = Data;
