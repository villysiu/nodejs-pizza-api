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

    ingredientDetails: [
      {
        ingredientId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ingredient",
          required: true
        },
        qty: {
          type: Number,
          default: 1,
          min: 0, max: 2
        }
      }
    ],

    quantity: {
      type: Number,
      default: 1,
      min: 1, max: 6
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