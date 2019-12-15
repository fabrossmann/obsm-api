var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ObjectId = mongoose.Schema.Types.ObjectId;

var ChatmessageSchema = new Schema({
    account: {
        type: ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    chatroom: {
        type: ObjectId,
        ref: 'Chatroom',
        require: true
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false,
        required: true
    }
});
module.exports = mongoose.model('Chatmessage', ChatmessageSchema);