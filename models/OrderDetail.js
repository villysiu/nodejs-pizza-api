const mongoose = require('mongoose');

const OrderDetailsSchema = new mongoose.Schema(
  {

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order required'],
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

module.exports = mongoose.model('OrderDetails', OrderDetailsSchema);
