const mongoose = require('mongoose');
const path = require('path');
const Model = require(path.join(__dirname, "../../", 'models/quote'));

module.exports.getQuoteOfTheDay = function (req, res) {
    Model.countDocuments()
        .exec(function (countErr, count) {
            if (countErr) {
                res.send(countErr);
            }
            var random = Math.floor(Math.random() * count);
            Model.findOne()
                .skip(random)
                .exec(function (err, val) {
                    if (err) {
                        res.status(500).send(err);
                    }

                    res.send(val);
                });
        });
}

module.exports.addQuote = function (req, res) {
    if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER') {
        const newModel = new Model({
            quote: req.body.quote
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

module.exports.getQuote = function (req, res) {
    Model.findById(req.params.quoteId, function (err, value) {
        if (err)
            res.status(500).send(err);
        res.json(value);
    });
}

module.exports.getQuotes = function (req, res) {
    Model.find({}, function (err, value) {
        if (err)
            res.status(500).send(err);
        res.json(value);
    });
}

module.exports.deleteQuote = function (req, res) {
    if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER') {
            Model.deleteOne({
                _id: req.params.quoteId
            }, function (err, value) {
                if (err)
                    res.status(500).send(err);
                res.json(value);
            });
        
    } else {
        res.status(401).send('No Permission');
    }
}


module.exports.updateQuote = function (req, res) {
    if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER') {
        Model.updateOne({
            _id: req.params.quoteId
        }, {
            quote: req.body.quote
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
