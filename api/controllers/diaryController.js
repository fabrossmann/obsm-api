const mongoose = require('mongoose');
const path = require('path');
const Model = require(path.join(__dirname, "../../", 'models/diaryEntry'));
var Util = require(path.join(__dirname, "../../", 'utils/util'));
var ObjectId = mongoose.Types.ObjectId;

module.exports.createDiaryEntry = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.body.account) {
    var newModel = new Model({
      account: req.body.account,
      date: req.body.date,
      substance: req.body.substance,
      amount: req.body.amount,
      comment: req.body.comment
    });
    newModel.save(function (err, value) {
      if (err) {
        res.status(500).send({
          success: false,
          msg: err
        });
      } else {
        res.json({
          success: true,
          msg: value
        });
      }
    });
  } else {
    res.status(401).send('No Permission');
  }
};

module.exports.getDiaryEntry = function (req, res) {
  Util.ownsDiary(req.params.diaryID, req.decoded, function (oD) {
    if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER'|| oD) {
      Model.findById(req.params.diaryID, function (err, value) {
        if (err)
          res.status(500).send(err);
        res.json(value);
      });
    } else {
      res.status(401).send('No Permission');
    }
  });
};

module.exports.updateDiaryEntry = function (req, res) {
  Util.ownsDiary(req.params.diaryID, req.decoded, function (oD) {
    if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || oD) {
      Model.findOneAndUpdate({
          _id: req.params.diaryID
        }, {
          account: req.body.account,
          date: req.body.date,
          substance: req.body.substance,
          amount: req.body.amount,
          comment: req.body.comment
        }, {
          new: true
        },
        function (err, value) {
          if (err)
            res.status(500).send(err);
          res.json(value);
        }
      );
    } else {
      res.status(401).send('No Permission');
    }
  });
};

module.exports.deleteDiaryEntry = function (req, res) {
  Util.ownsDiary(req.params.diaryID, req.decoded, function (oD) {
    if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER'|| oD) {
      Model.remove({
        _id: req.params.diaryID
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

module.exports.getDiaryEntries = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.userID) {
    Model.find({
      account: ObjectId(req.params.userID)
    }, function (err, value) {
      if (err) {
        res.status(500).send({
          success: false,
          msg: err
        });
      } else {
        res.json({
          success: true,
          msg: value
        });
      }
    });
  } else {
    res.status(401).send('No Permission');
  }
};

module.exports.deleteDiaryEntries = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.userId) {
    Model.remove({
      account: req.params.userId
    }, function (err, value) {
      if (err)
        res.status(500).send(err);
      res.json(value);
    });
  } else {
    res.status(401).send('No Permission');
  }
};

module.exports.getIntervalEntries = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.userID) {
    Model.find({
      account: ObjectId(req.params.userID),
      substance: req.params.substance,
      date: {
        $gte: req.body.date1,
        $lt: req.body.date2
      }
    }, function (err, value) {
      if (err)
        res.status(500).send(err);
      res.json(value);
    })
  } else {
    res.status(401).send('No Permission');
  }
}