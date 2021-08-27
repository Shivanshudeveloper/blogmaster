const mongoose = require('mongoose');

const usersKissSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    sendToEmail: {
        type: String,
        required: true
    },
    kiss: {
        type: Number,
        required: true
    },
    profilePic: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    reply: {
        type: String,
        required: false
    },
    profileId: {
        type: String,
        required: false
    },
    senderprofilePic: {
        type: String,
        required: true
    },
    senderusername: {
        type: String,
        required: true
    },
    senderuserid: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const kiss = mongoose.model('kiss', usersKissSchema)
module.exports = kiss