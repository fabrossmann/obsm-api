const mongoose = require('mongoose');
const path = require('path');
const async = require('async');
const Model = require(path.join(__dirname, "../../", 'models/chatroom'));
const Util = require(path.join(__dirname, "../../", 'utils/util'));

module.exports.getChatrooms = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.userID) {
    Model.find({
      participants: req.params.userID
    }, function (err, value) {
      if (err)
        res.status(500).send(err);
      res.json(value);
    });
  } else {
    res.status(401).send('No Permission');
  }
};

module.exports.getAllChatrooms = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER') {
    Model.find({}, function (err, value) {
      if (err)
        res.status(500).send(err);
      res.json(value);
    });
  } else {
    res.status(401).send('No Permission');
  }
};

module.exports.createChatroom = function (req, res) {
  console.log(req.body.creator);
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER') {
    var newModel = new Model({
      roomName: req.body.roomname,
      participants: req.body.creator
    });

    newModel.save(function (err, value) {
      if (err) {
        res.status(500).send(err);
      }
      res.json({
        success: true,
        msg: value
      });
    });
  } else {
    res.status(401).send('No Permission');
  }
};

module.exports.addParticipant = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER') {
    Model.findOneAndUpdate({
      _id: req.params.chatroomID
    }, {
      $push: {
        participants: req.body.participant
      }
    }, {
      new: true
    }, function (err, value) {
      if (err)
        res.status(500).send(err);
      res.json(value);
    });
  } else {
    res.status(401).send('No Permission');
  }
};

module.exports.replaceParticipants = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER') {
    Model.findOneAndUpdate({
      _id: req.params.chatroomID
    }, {
      participants: req.body.participants
    }, {
      new: true
    }, function (err, value) {
      if (err)
        res.status(500).send(err);
      res.json(value);
    });
  } else {
    res.status(401).send('No Permission');
  }
};

module.exports.setCategory = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER') {
    Model.findOneAndUpdate({
      _id: req.params.chatroomID
    }, {
      category: req.body.category
    }, function (err, value) {
      if (err)
        res.status(500).send(err);
      res.json(value);
    });
  } else {
    res.status(401).send('No Permission');
  }
}

module.exports.hasUnreadMessages = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.accountId) {
    Util.getAllChatRooms(req.params.accountId, function (chatrooms) {
      var unread = 0;
      if (chatrooms != null) {
        async.forEach(chatrooms, function (value, callback) {
          Util.hasChatUnreadMessages(value._id, req.params.accountId, function (count) {
            unread += count;
            callback();
          });
        },function(err){
          res.json(unread);
        });
      }
    });
  } else {
    res.status(401).send('No Permission');
  }
}

module.exports.channelHasUnreadMessages = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.accountId) {
    Util.hasChatUnreadMessages(req.body._id, req.params.accountId, function (count) {
      res.json(count);
    });
  } else {
    res.status(401).send('No Permission');
  }
}

/* Depricated
module.exports.getChatprotocol = function (req, res) {

  Model.findById(req.params.chatprotocollId, function (err, value) {
    if (err)
      res.status(500).send(err);
    res.json(value);
  });

};

module.exports.updateChatprotocol = function (req, res) {

  Model.findOneAndUpdate({
      _id: req.params.chatprotocollId
    },
    req.body, {
      new: true
    },
    function (err, value) {
      if (err)
        res.status(500).send(err);
      res.json(value);
    }
  );

};

module.exports.deleteChatprotocol = function (req, res) {

  Model.remove({
    _id: req.params.chatroomId
  }, function (err, value) {
    if (err)
      res.status(500).send(err);
    res.json(value);
  });

};*/