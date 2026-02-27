const mongoose = require('mongoose');

const SizeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Size is required'],
      unique: true,
    },
    price: {
      type: Number,
      default: 0.0,
      min: 0
    },
    perTopping: {
      type: Number,
      default: 0.0,
      min: 0
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Size', SizeSchema);