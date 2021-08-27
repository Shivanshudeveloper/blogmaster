const mongoose = require('mongoose');

const usersProductsSchema = new mongoose.Schema({
    Sku: {
        type: String,
        required: false
    },
    Brand: {
        type: String,
        required: false
    },
    Category: {
        type: String,
        required: false
    },
    Color: {
        type: String,
        required: false
    },
    Condition: {
        type: String,
        required: false
    },
    CreatedDatetimeUtc: {
        type: String,
        required: false
    },
    Description: {
        type: String,
        required: false
    },
    Gender: {
        type: String,
        required: false
    },
    Images: {
        type: Array,
        required: false
    },
    LastUpdatedDatetimeUtc: {
        type: String,
        required: false
    },
    ListPrice: {
        type: Number,
        required: false
    },
    MadeIn: {
        type: String,
        required: false
    },
    Material: {
        type: String,
        required: false
    },
    ParentCategory: {
        type: String,
        required: false
    },
    Title: {
        type: String,
        required: false
    },
    Variants: {
        type: Array,
        required: false
    }
})
const products = mongoose.model('products2', usersProductsSchema)
module.exports = products