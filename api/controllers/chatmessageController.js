const mongoose = require('mongoose');
const path = require('path');
const Model = require(path.join(__dirname, "../../", 'models/chatmessage'));
const Util = require(path.join(__dirname, "../../", 'utils/util'));
var ObjectId = mongoose.Types.ObjectId;

module.exports.createChatMessage = function (req, res) {
  console.log('servus');
  Util.isInChatRoom(req.body.chatroom, req.decoded, function (val) {
    if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || ((req.decoded._id == req.body.account) && val)) {
      var newModel = new Model({
        account: req.body.account,
        name: req.body.name,
        chatroom: req.body.chatroom,
        message: req.body.message
      });
      newModel.save(function (err, value) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json(value);
        }
      });
    } else {
      res.status(401).send('No Permission');
    }
  });
};

module.exports.getAllChatroomMessages = function (req, res) {
  Util.isInChatRoom(req.params.chatroomID, req.decoded, function (val) {
    if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || val) {
      Model.find({
        chatroom: req.params.chatroomID
      }, function (err, value) {
        if (err)
          res.status(500).send(err);
        res.json(value);
      });
    } else {
      res.status(401).send('No Permission');
    }
  });
};



module.exports.readAllMessages = function (req, res) {
  Util.isInChatRoom(req.params.chatroomID, req.decoded, function (val) {
    if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || val) {
      Model.updateMany({
        chatroom: req.params.chatroomID,
        account: {
          $ne: new ObjectId(req.decoded._id)
        },
      }, {
        read: true
      }, function (err, value) {
        if (err)
          res.status(500).send(err);
        res.json(value);
      });
    } else {
      res.status(401).send('No Permission');
    }
  });
}