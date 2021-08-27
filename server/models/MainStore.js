const mongoose = require('mongoose');

const usersMainStoreSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    title2: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: false
    },
    displayImage: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    madein: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    product: {
        type: Object,
        required: false
    },
    recommended: {
        type: Boolean,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const mainStore = mongoose.model('mainstore', usersMainStoreSchema)
module.exports = mainStore