const mongoose = require('mongoose');

const MenuitemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },

    active: {
      type: Boolean,
      default: true,
    },

    imageUrl: {
      type: String,
      trim: true,
      default: ''
    },
      // default ingredients
    ingredientIds: {
      type: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ingredient",
        required: true
      }
      ],
      default: []
    }

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Menuitem', MenuitemSchema);
