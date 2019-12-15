var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var DiaryEntrySchema = new Schema({
  account: {
    type: ObjectId,
    ref: 'Account',
    require: true
  },
  date: {
    type: Date,
    require: true
  },
  substance: {
    type: ObjectId,
    ref: 'Substance',
    require: true
  },
  amount: {
    type: Number,
    require: true
  },
  comment: {
    type: String
  }
});

module.exports = mongoose.model('DiaryEntry', DiaryEntrySchema);