const mongoose = require('mongoose');

const universitiesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    visa: {
        type: String,
        required: true
    },
    conditionaloffer: {
        type: String,
        required: true
    },
    campusaccomodation: {
        type: String,
        required: true
    },
    workwhilestudy: {
        type: String,
        required: true
    },
    websiteurl: {
        type: String,
        required: true
    },
    dicipline: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    coverphoto: {
        type: String,
        required: true
    },
    programs: {
        type: Array,
        required: false
    },
    about: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const universities = mongoose.model('universities', universitiesSchema)
module.exports = universities