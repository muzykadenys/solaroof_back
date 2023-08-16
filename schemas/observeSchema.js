const mongoose = require("mongoose");

const observeElSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  DNI: {
    type: Number,
    required: true,
  },
  DHI: {
    type: Number,
    required: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  power: {
    type: Number,
    required: true,
  },
  volt: {
    type: Number,
    required: true,
  },
  amp: {
    type: Number,
    required: true,
  },
});
const observeSchema = new mongoose.Schema({
  data: {
    type: [observeElSchema],
    required: true,
  },
});

module.exports = mongoose.model("Observe", observeSchema);
