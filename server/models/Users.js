const mongoose = require('mongoose');

const usersDataSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    profileDownloadUrl: {
        type: String,
        required: false
    },
    about: {
        type: String,
        required: false
    },
    assets: {
        type: String,
        required: false
    },
    bodyType: {
        type: String,
        required: false
    },
    dob: {
        type: String,
        required: false
    },
    eyes: {
        type: String,
        required: false
    },
    hair: {
        type: String,
        required: false
    },
    height: {
        type: String,
        required: false
    },
    kids: {
        type: String,
        required: false
    },
    place: {
        type: String,
        required: false
    },
    smoker: {
        type: String,
        required: false
    },
    vip: {
        type: Boolean,
        required: false
    },
    username: {
        type: String,
        required: false
    },
    yearlyIncome: {
        type: String,
        required: false
    },
    contactArr: {
        type: Array,
        required: false
    },
    langArr: {
        type: Array,
        required: false
    },
    leisureArr: {
        type: Array,
        required: false
    },
    sportArr: {
        type: Array,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    region: {
        type: String,
        required: false
    },
    likes: {
        type: Number,
        required: false
    },
    credits: {
        type: Number,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const users = mongoose.model('users', usersDataSchema)
module.exports = users