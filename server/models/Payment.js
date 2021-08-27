const mongoose = require("mongoose");

const usersPaymentSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: false,
  },
  userId: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  fullName: {
    type: String,
    required: false,
  },
  phoneno: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  zipcode: {
    type: String,
    required: false,
  },
  amount: {
    type: String,
    required: false,
  },
  note: {
    type: String,
    required: false,
  },
  completed: {
    type: Boolean,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  payment: {
    type: Boolean,
    required: false,
  },
  totalItems: {
    type: Number,
    required: false,
  },
  companyAddress: {
    type: String,
    required: false,
  },
});
const payments = mongoose.model("payments", usersPaymentSchema);
module.exports = payments;
