const mongoose = require('mongoose');

const usersUnlockRequestSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    unlockforuserid: {
        type: String,
        required: true
    },
    unlockforuseremail: {
        type: String,
        required: true
    },
    senderprofileurl: {
        type: String,
        required: true
    },
    senderfullname: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const unlockrequests = mongoose.model('unlockrequest', usersUnlockRequestSchema)
module.exports = unlockrequests