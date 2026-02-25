const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['VEGETABLES', 'MEATS', 'OTHERS'],
      default: 'OTHERS'
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

module.exports = mongoose.model('Ingredient', IngreditenSchema);