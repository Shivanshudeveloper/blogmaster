const mongoose = require('mongoose');

const usersFavoriteSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    favoriteUserId: {
        type: String,
        required: true
    },
    favoriteUserEmail: {
        type: String,
        required: true
    },
    favoriteUserName: {
        type: String,
        required: true
    },
    favoriteUserProfile: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const favorites = mongoose.model('favorite', usersFavoriteSchema)
module.exports = favorites