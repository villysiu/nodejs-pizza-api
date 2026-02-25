const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    price: {
      type: Number,
      default: 0.0,
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Category', CategorySchema);