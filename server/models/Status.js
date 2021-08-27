const mongoose = require('mongoose');

const usersstatuschema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    payment: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const status = mongoose.model('status', usersstatuschema)
module.exports = status