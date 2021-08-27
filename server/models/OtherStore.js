const mongoose = require('mongoose');

const usersotherstoreSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: false
    },
    disc: {
        type: Number,
        required: false
    },
    discPrice: {
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
    productfor: {
        type: String,
        required: false
    },
    product: {
        type: Object,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const otherstore = mongoose.model('otherstore', usersotherstoreSchema)
module.exports = otherstore