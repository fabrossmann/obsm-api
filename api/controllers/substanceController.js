const mongoose = require('mongoose');
const path = require('path');
const Model = require(path.join(__dirname, "../../", 'models/substance'));
const Util = require(path.join(__dirname, "../../", 'utils/util'));

module.exports.createSubstance = function (req, res) {
    if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.body.account) {
        const newModel = new Model({
            substance: req.body.substance,
            unit: req.body.unit,
            account: req.body.account
        });

        newModel.save(function (err, val) {
            if (err) {
                res.status(500).send(err);
            }
            res.json(val);
        });

    } else {
        res.status(401).send('No Permission');
    }
}

module.exports.deleteSubstance = function (req, res) {
    Util.ownsSubstance(req.params.substanceId, req.decoded, function (val) {
        if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || val) {
            Model.deleteOne({
                _id: req.params.substanceId
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

module.exports.updateSubstance = function (req, res) {
    if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.body.account) {
        Model.updateOne({
            _id: req.params.substanceId
        }, {
            substance: req.body.substance,
            unit: req.body.unit,
            account: req.body.account
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
}

module.exports.getSubstanceById = function (req, res) {
    if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.body.account) {
        Model.findById(req.params.substanceId, function (err, value) {
            if (err)
                res.status(500).send(err);
            res.json(value);
        });
    } else {
        res.status(401).send('No Permission');
    }
}

module.exports.getSubstances = function (req, res) {
    if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.accountId) {
        Model.find({
            account: req.params.accountId
        }, function (err, value) {
            if (err)
                res.status(500).send(err);
            res.json(value);
        });
    }
}