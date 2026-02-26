const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      unique: true
    },
    category: {
      type: String,
      enum: ['VEGETABLES', 'MEATS', 'OTHERS'],
      default: 'OTHERS'
    },
    price: {
      type: Number,
      default: 0.0,
      min: [0, 'Price cannot be negative']
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Ingredient', IngredientSchema);