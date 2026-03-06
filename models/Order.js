const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
    total: {
      type: Number,
      default: 0.0,
      min: 0,
    },

  },
  { timestamps: true }
)

module.exports = mongoose.model('Order', OrderSchema)