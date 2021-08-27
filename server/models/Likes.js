const mongoose = require('mongoose');

const usersLikeSchema = new mongoose.Schema({
    userprofile: {
        type: String,
        required: true
    },
    likedby: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const likes = mongoose.model('likes', usersLikeSchema)
module.exports = likes