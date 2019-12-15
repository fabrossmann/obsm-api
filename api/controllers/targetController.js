const mongoose = require('mongoose');
const path = require('path');
const Model = require(path.join(__dirname, "../../", 'models/target'));
const Util = require(path.join(__dirname, "../../", 'utils/util'));

module.exports.addTarget = function (req, res) {
    if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.accountId) {
        var target = new Model({
            account: req.params.accountId,
            maxAmount: req.body.maxAmount,
            substance: req.body.substance,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        });
        target.save(function (err, val) {
            if (err)
                res.status(500).send(err);
            res.json(val);
        });
    } else {
        res.status(401).send('No Permission');
    }
};

module.exports.deleteTarget = function (req, res) {
    if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.accountId) {
        Model.remove({
            _id: req.params.targetId,
            account: req.params.accountId
        }, function (err, value) {
            if (err)
                res.status(500).send(err);
            res.json(value);
        });
    } else {
        res.status(401).send('No Permission');
    }
};

module.exports.updateTarget = function (req, res) {
    if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.accountId) {
        Model.findOneAndUpdate({
            _id: req.params.targetId,
            account: req.params.accountId

        }, {
            maxAmount: req.body.maxAmount,
            substance: req.body.substance
        }, {
            new: true,
            upsert: true
        }, function (err, value) {
            if (err)
                res.status(500).send(err);
            res.json(value);
        });
    } else {
        res.status(401).send('No Permission');
    }
};

module.exports.getTarget = function (req, res) {
    if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.accountId) {
        Model.find({
            account: req.params.accountId
        }, function (err, value) {
            if (err) {
                res.status(500).send(err);
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

module.exports.getIntervalTargets = function (req, res) {
    if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.accountId) {
        Model.find({
            account: req.params.accountId,
            substance: req.params.substance,
            startDate: {
                $gte: new Date(req.body.date1)
            },
            endDate: {
                $lte: new Date(req.body.date2)
            }
        }, function (err, val) {
            if (err)
                res.status(500).send(err);
            res.json(val);
        });
    } else {
        res.status(401).send('No Permission');
    }
};