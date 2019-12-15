const mongoose = require('mongoose');
const path = require('path');
const Model = require(path.join(__dirname, "../../", 'models/account'));
const Util = require(path.join(__dirname, "../../", 'utils/util'));
const crypto = require("crypto");
const async = require("async");
var jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

//Uncomment if used on local machine
require('dotenv').config();

var transporter = nodemailer.createTransport({
  host: process.env.host,
  port: 25,
  auth: {
      user: process.env.user,
      pass: process.env.password
  },
  tls:{
      rejectUnauthorized: false
  }
});

transporter.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

module.exports.getAccounts = function (req, res) {
  if ((req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER')) {
    Model.find({}, function (err, value) {
      if (err) {
        res.status(500).send(err);
      }
      res.json(value);
    });
  } else {
    res.status(401).send('No Permission');
  }
};

module.exports.getAccount = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.accountId) {
    Model.findById(req.params.accountId, function (err, value) {
      if (err)
        res.status(500).send(err);
      res.json(value);
    });
  } else {
    res.status(401).send('No Permission');
  }
};


module.exports.getClients = function (req, res) {
  if (req.decoded._id == req.params.supervisorId || req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER') {
    Model.find({
      supervisorID: req.params.supervisorId
    }, function (err, value) {
      if (err)
        res.status(500).send(err);
      res.json(value);
    });
  } else {
    res.status(401).send('No Permission');
  }
};

module.exports.getUnassigned = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER') {
    Model.find({
      supervisorID: null,
      role: "ROLE_GUEST"
    }, function (err, value) {
      if (err)
        res.status(500).send(err);
      res.json(value);
    });
  } else {
    res.status(401).send('No Permission');
  }
};

module.exports.getRoles = function (req, res) {
  Model.find({
    role: req.params.type
  }, function (err, value) {
    if (err)
      res.status(500).send(err);
    res.json(value);
  });
};

module.exports.getRole = function (req, res) {
  if (req.decoded._id == req.params.accountId || req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER') {
    Model.find({
      _id: req.params.accountId
    }, function (err, value) {
      if (err)
        res.status(500).send(err);
      res.json(value);
    });
  } else {
    res.status(401).send('No Permission');
  }
};

module.exports.setRole = function (req, res) {
  if ((req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER') && req.body.role != 'ROLE_ADMIN') {
    Model.findOneAndUpdate({
      _id: req.params.accountId
    }, {
      role: req.body.role
    }, {
      new: true
    }, function (err, value) {
      if (err) {
        res.status(500).send(err);
      }
      res.json(value);
    });
  } else {
    res.status(401).send('No Permission');
  }
};

module.exports.getRoles = function (req, res) {

  Model.find({
    role: req.params.type
  }, function (err, value) {
    if (err)
      res.status(500).send(err);
    res.json(value);
  });
};

module.exports.updatePassword = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.accountId) {
    Model.findOneAndUpdate({
        _id: req.params.accountId
      }, {
        password: req.body.password
      }, {
        new: true
      },
      function (err, value) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json(value);
        }

      }
    );
  } else {
    res.status(401).send('No Permission');
  }
};

module.exports.setUsername = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.accountId) {
    Model.findOneAndUpdate({
      _id: req.params.accountId
    }, {
      username: req.body.username
    }, function (err, value) {
      if (err)
        res.status(500).send(err);
      res.json(value);
    });
  }
};

module.exports.setEmail = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.accountId) {
    Model.findOneAndUpdate({
      _id: req.params.accountId
    }, {
      email: req.body.email
    }, {
      upsert: true,
      new: true
    }, function (err, value) {
      if (err)
        res.status(500).send(err);
      res.json(value);
    })
  } else {
    res.status(401).send('No Permission');
  }
};

module.exports.setSupervisor = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER') {
    Model.findOneAndUpdate({
      _id: req.params.accountId
    }, {
      supervisorID: req.body.supervisorID
    }, {
      upsert: true,
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

module.exports.setName = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.accountId) {
    Model.findOneAndUpdate({
      _id: req.params.accountId
    }, {
      $set: {
        "name.firstName": req.body.firstName,
        "name.lastName": req.body.firstName
      }
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

module.exports.setGender = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.accountId) {
    Model.findOneAndUpdate({
      _id: req.params.accountId
    }, {
      gender: req.body.gender
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

module.exports.setTelephone = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.accountId) {
    Model.findOneAndUpdate({
      _id: req.params.accountId
    }, {
      telephone: req.body.telephone
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

module.exports.setBirthday = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.accountId) {
    Model.findOneAndUpdate({
      _id: req.params.accountId
    }, {
      birthday: req.body.birthday
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

module.exports.setAddress = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.accountId) {
    Model.findOneAndUpdate({
      _id: req.params.accountId
    }, {
      $set: {
        "address.city": req.body.city,
        "address.postalCode": req.body.postalCode,
        "address.street": req.body.street,
        "address.house": req.body.house,
        "address.apartmentNo": req.body.apartmentNo,
        "address.federalState": req.body.federalState
      }
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

module.exports.addGraduation = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.accountId) {
    Model.findOneAndUpdate({
      _id: req.params.accountId
    }, {
      $push: {
        school: req.body.school,
        graduation: req.body.graduation,
        startYear: req.body.startYear,
        gradYear: req.body.gradYear
      }
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

module.exports.setEmergencyContact = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.accountId) {
    Model.findOneAndUpdate({
      _id: req.params.accountId
    }, {
      $set: {
        "emergencyContact.firstName": req.body.emergencyFirstName,
        "emergencyContact.lastName": req.body.emergencyLastName,
        "emergencyContact.telephone": req.body.emergencyTelephone
      }
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
/* Depricated
module.exports.addSubstance = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.accountId) {
    Model.findOneAndUpdate({
      _id: req.params.accountId
    }, {
      $push: {
        "diaryConfig.substances": req.body.substances,
      }
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

module.exports.getSubstances = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.accountId) {
    Model.findById(req.params.accountId, 'diaryConfig.substances', function (err, value) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(value);
      }
    });
  } else {
    res.status(401).send('No Permission');
  }
};

module.exports.deleteSubstance = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.accountId) {
    Model.findByIdAndUpdate(req.params.accountId, {
      $pull: {
        "diaryconfig.substances": req.body.substances
      }
    }, function (err, value) {
      if (err)
        res.status(500).send(err);
      res.json(value);
    });
  } else {
    res.status(401).send('No Permission');
  }
};
*/
module.exports.setSupervisorAccess = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.accountId) {
    Model.findOneAndUpdate({
      _id: req.params.accountId
    }, {
      $set: {
        "diaryConfig.supervisorHasAccess": req.body.supervisorHasAccess
      }
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

module.exports.verify = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.accountId) {
    Model.findOneAndUpdate({
        _id: req.params.accountId
      }, {
        email: req.body.email,
        supervisorID: req.body.supervisorID,
        $set: {
          "name.firstName": req.body.firstName,
          "name.lastName": req.body.firstName
        },
        gender: req.body.gender,
        telephone: req.body.telephone,
        birthday: req.body.birthday,
        $set: {
          "address.city": req.body.city,
          "address.postalCode": req.body.postalCode,
          "address.street": req.body.street,
          "address.house": req.body.house,
          "address.apartmentNo": req.body.apartmentNo
        },
        $set: {
          "emergencyContact.firstName": req.body.emergencyFirstName,
          "emergencyContact.lastName": req.body.emergencyLastName,
          "emergencyContact.telephone": req.body.emergencyTelephone
        }
      },
      function (err, value) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json({
            success: true,
            msg: value
          });
        }
      }
    )
  } else {
    res.status(401).send('No Permission');
  }
};

module.exports.deleteAccount = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.accountId) {
    Model.remove({
      _id: req.params.accountId
    }, function (err, value) {
      if (err)
        res.status(500).send(err);
      res.json(value);
    });
  } else {
    res.status(401).send('No Permission');
  }
};

module.exports.signup = function (req, res) {
  /*
  if (!req.body.email) {
    var newUser = new Model({
      username: req.body.username,
      password: req.body.password,
    });
  } else {
    var newUser = new Model({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    });
  }
  */
  var newUser = new Model({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    "address.federalState": req.body.federalState,
    birthday: req.body.birthDate,
    gender: req.body.gender,
    statisticData: req.body.statisticData
  });
  // save the user
  newUser.save(function (err, value) {
    if (err) {
      return res.status(400).send({
        success: false,
        msg: 'Username already exists.'
      });
    }
    res.json({
      success: true,
      msg: value
    });
  });

};

module.exports.signin = function (req, res) {
  Model.findOne({
    username: req.body.username
  }, function (err, value) {
    if (err || value == null) {
      res.status(400).send({
        success: false,
        msg: 'Authentication failed. User not found.'
      });
    } else {
      value.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          Util.updateActivity(value.toObject()._id);
          var payload = {
            _id: value._id,
            role: value.role
          }
          var token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '7d',
            issuer: 'obsm-api'
          });
          res.json({
            success: true,
            token: 'JWT ' + token
          });
        } else {
          res.status(403).send({
            success: false,
            msg: 'Authentication failed. Wrong password.'
          });
        }
      });
    }

  });
};

module.exports.getRole = function (req, res) {
  if (req.decoded.role == 'ROLE_ADMIN' || req.decoded.role == 'ROLE_SUPERVISOR' || req.decoded.role == 'ROLE_ASSIGNER' || req.decoded._id == req.params.accountId) {
    Model.findOne({
        username: req.params.accountId
      },
      function (err, value) {
        if (err)
          res.status(500).send(err);
        res.json(value.role);
      });
  } else {
    res.status(401).send('No Permission');
  }
};



module.exports.forgot_password = function (req, res) {
  async.waterfall([
    function (done) {
      Model.findOne({
        email: req.body.email
      }).exec(function (err, user) {
        if (user) {
          done(err, user);
        } else {
          done('User not found.');
        }
      });
    },
    function (user, done) {
      // create the random token
      crypto.randomBytes(20, function (err, buffer) {
        var token = buffer.toString('hex');
        done(err, user, token);
      });
    },
    function (user, token, done) {
      Model.findByIdAndUpdate({
        _id: user._id
      }, {
        reset_password_token: token,
        reset_password_expires: Date.now() + 86400000
      }, {
        upsert: true,
        new: true
      }).exec(function (err, new_user) {
        done(err, token, new_user);
      });
    },
    function (token, user, done) {
      var message = {
        from: process.env.email,
        to: req.body.email,
        subject: "[OBSM] Passwort Reset",
        text: "Ihr Passwort wurde zurückgesetzt: Link für neues Passwort: " + req.body.domain+"/auth/reset/reset_password?token=" + token,
        html: "<p>Ihr Passwort wurde zurückgesetzt: Link für neues Passwort: </p>" + "<a href=\""+ req.body.domain +"/auth/reset/reset_password?token=" + token + "\">Klick</a>"
      };

      transporter.sendMail(
        message,
        function (err, info) {
          if (!err) {
            return res.json({
              message: 'Dir wurde eine Email mit den Reset-Link zugesendet.'
            });
          } else {
            return done(err);
          }
        });
    }
  ], function (err) {
    return res.status(402).json({
      message: err
    });
  });
};

module.exports.reset_password = function (req, res, next) {
  Model.findOne({
    reset_password_token: req.body.token,
    reset_password_expires: {
      $gt: Date.now()
    }
  }).exec(function (err, user) {
    if (!err && user) {
      if (req.body.newPassword) {
        Model.findOneAndUpdate({
            _id: user._id
          }, {
            password: req.body.newPassword,
            reset_password_token: undefined,
            reset_password_expires: undefined
          })
          .exec(function (err, val) {
            if (err) {
              res.status(500).send(err);
            }
            res.send('Passwort geändert!');
          });
      } else {
        return res.status(422).send({
          message: 'Passwords do not match'
        });
      }
    } else {
      return res.status(400).send({
        message: 'Password reset token is invalid or has expired.'
      });
    }
  });
};