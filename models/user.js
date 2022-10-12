const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: true,
    },

    email: {
        type: String,
        unique: true,
        validate: {
            validator: (v) => isEmail(v),
            message: 'Неккоректный формат почты',
        },
        required: true,
    },

    password: {
        type: String,
        // select: false, // comment for debug
        required: true,
    },

}, {
    versionKey: false,
    toObject: { useProjection: true },
    toJSON: { useProjection: true },
});

module.exports = mongoose.model('user', userSchema);
