var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
const ObjectId = mongoose.Schema.Types.ObjectId;

var accountSchema = new Schema({
    username: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: false,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: false,
        unique: true
    },
    role: {
        type: String,
        default: "ROLE_GUEST",
        required: true
    },
    supervisorID: {
        type: ObjectId,
        ref: 'Account',
        default: null
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now
    },

    name: {
        firstName: {
            type: String,
            default: ""
        },
        lastName: {
            type: String,
            default: ""
        }
    },
    gender: {
        type: String,
        default: ""
    },
    telephone: {
        type: String,
        default: ""
    },
    birthday: {
        type: Date,
        default: null
    },
    address: {
        federalState: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            default: ""
        },
        postalCode: {
            type:Number,
            default: null
        },
        street: {
            type: String,
            default: ""
        },
        house: {
            type:Number,
            default: null
        },
        apartmentNo: {
            type:Number,
            default: null
        }
    },
    statisticData: {
        type: Boolean,
        default: false,
        required: true
    },
    graduations: [{
        school: {
            type: String,
            default: ""
        },
        graduation: {
            type: String,
            default: ""
        },
        startYear: Date,
        gradYear: Date
    }],
    emergencyContact: {
        firstName: {
            type: String,
            default: ""
        },
        lastName: {
            type: String,
            default: ""
        },
        telephone: {
            type: String,
            default: ""
        }
    },

    diaryConfig: {
        supervisorHasAccess: {
            type: Boolean,
            default: false,
            required: true
        }
    },
    lastActivity: {
        type: Date,
        required: true,
        default: Date.now
    },
    reset_password_token: {
        type: String
    },
    reset_password_expires: {
        type: Date
    }
});


accountSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});


accountSchema.pre('findOneAndUpdate', function (next) {
    var user = this;
    if (user.getUpdate().password) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.getUpdate().password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.getUpdate().password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

accountSchema.pre('updateMany', function (next) {
    var user = this;
    if (user.getUpdate().password) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.getUpdate().password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.getUpdate().password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

accountSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Account', accountSchema);