var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ObjectId = mongoose.Schema.Types.ObjectId;

var chatroomSchema = new Schema({
    roomName: String,
    participants: [{
        type: ObjectId,
        ref: 'Account',
        require: false
    }],
    category: {
        type: String,
        default: 'No Category'
    }
});

module.exports = mongoose.model('Chatroom', chatroomSchema);