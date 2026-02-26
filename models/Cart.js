const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },

    menuitemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menuitem',
      required: [true, 'Menuitem required'],
    },

    sizeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Size',
      required: [true, 'Size required'],

    },

    ingredients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ingredient",
        required: true
      }
    ],

    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    unitPrice: {
      type: Number,
      default: 0.0,
      min: 0,
    },
  },
  {
    timestamps: true,
});

module.exports = mongoose.model('Cart', CartSchema);