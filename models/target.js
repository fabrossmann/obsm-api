var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var targetSchema = new Schema({
    account: {
        type: ObjectId,
        ref: 'Account',
        require: true
    },
    maxAmount: {
        type: Number
    },
    substance: {
        type: ObjectId,
        ref: 'Substance',
        require: true
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    }
});


module.exports = mongoose.model('Target', targetSchema);