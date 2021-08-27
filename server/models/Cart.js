const mongoose = require("mongoose");

const userscartschema = new mongoose.Schema({
  userId: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  qty: {
    type: Number,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
  product: {
    type: Object,
    required: false,
  },
  completed: {
    type: Boolean,
    required: false,
  },
  payment: {
    type: Boolean,
    required: false,
  },
  inCart: {
    type: Boolean,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  orderId: {
    type: String,
    required: false,
    default: null,
  },
});
const carts = mongoose.model("carts", userscartschema);
module.exports = carts;
