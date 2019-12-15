var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var substanceSchema = new Schema({
    substance: {
        type: String,
        required: true
    },
    unit:{
        type: String,
        required: true
    },
    account: {
        type: ObjectId,
        ref: 'Account',
        require: true
      },
});

module.exports = mongoose.model('Substance', substanceSchema);