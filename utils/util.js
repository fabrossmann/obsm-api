var jwt = require('jsonwebtoken');
const path = require('path');
const Account = require(path.join(__dirname, "../", 'models/account.js'));
const Chatroom = require(path.join(__dirname, "../", 'models/chatroom.js'))
const Chatmessage = require(path.join(__dirname, "../", 'models/chatmessage.js'))
const Diary = require(path.join(__dirname, "../", 'models/diaryEntry.js'));
const Substance = require(path.join(__dirname, "../", 'models/substance.js'));
const mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
const Email = require('email-templates');

module.exports.hasRights = function (token, role) {
  var decoded = jwt.decode(token);
  if (decoded.payload.role == role) {
    return true;
  }
  return false;
};

module.exports.obfuscateInactiveAccounts = function () {
  var year = new Date().getFullYear() - 1;
  var month = new Date().getMonth();
  var day = new Date().getDay();
  Account.updateMany({
    lastActivity: {
      $lte: new Date(year, month, day)
    },
    role: "ROLE_GUEST",
    $or: [{
        role: "ROLE_GUEST"
      },
      {
        role: "ROLE_MEMBER"
      }
    ]
  }, {
    username: "anonymous" + Math.random().toString(36).slice(-8),
    password: Math.random().toString(36).slice(-8),
    name: null,
    telephone: null,
    emergencyContact: null,
    $set: {
      "address.street": null,
      "address.house": null,
      "address.apartmentNo": null
    },
    $set: {
      school: "anonymous",
      startYear: null,
      gradYear: null
    }

  }, function (err, value) {
    if (err) {
      console.log(err);
    } else {
      console.log(value);
    }

  });
}

module.exports.updateActivity = function (_id) {
  Account.findOneAndUpdate({
    _id: _id
  }, {
    lastActivity: Date.now()
  }, function (err, value) {
    if (err)
      console.log(err);
  });
}

module.exports.getAllChatRooms = function (userId, callback) {
  Chatroom.find({
        participants: userId
      },
      '_id'
    )
    .exec(function (err, val) {
      if (err) {
        console.log(err);
        callback(null);
      } else {
        callback(val);
      }
    });
}

module.exports.isInChatRoom = function (chatroomId, token, callback) {
  Chatroom.findOne({
    _id: chatroomId,
    participants: token._id
  }).exec(function (err, val) {
    if (err) {
      console.log(err);
      callback(false);
    } else {
      if (val == null) {
        callback(false);
      } else {
        callback(true);
      }
    }
  });
}

module.exports.hasChatUnreadMessages = function (chatroomId, userId, callback) {
  Chatmessage.countDocuments({
    chatroom: new ObjectId(chatroomId),
    account: {$ne:ObjectId(userId)},
    read: false
  }).exec(function (err, count) {
    if (err) {
      console.log(err);
      callback(-1);
    }
    callback(count);
  });
}

module.exports.ownsDiary = function (diaryId, token, callback) {
  Diary.findOne({
    _id: diaryId,
    account: new ObjectId(token._id)
  }).exec(function (err, val) {
    if (err) {
      console.log(err);
      callback(false);
    } else {
      if (val == null) {
        callback(false);
      } else {
        callback(true);
      }
    }
  });
}

module.exports.ownsSubstance = function (substanceId, token, callback) {
  Substance.findOne({
    _id: substanceId,
    account: new ObjectId(token._id)
  }).exec(function (err, val) {
    if (err) {
      console.log(err);
      callback(false);
    } else {
      if (val == null) {
        callback(false);
      } else {
        callback(true);
      }
    }
  });
}

module.exports.sendMail = function (to, subject, template) {
  const email = new Email({

  });
}