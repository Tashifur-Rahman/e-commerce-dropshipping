const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    items: [
      {
        product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name:     String,
        quantity: Number,
        price:    Number,
      },
    ],
    total:    { type: Number, required: true },
    customer: {
      name:    String,
      email:   String,
      address: String,
      city:    String,
      zip:     String,
    },
    status:   { type: String, default: 'pending', enum: ['pending', 'processing', 'shipped', 'delivered'] },
    paymentMethod: { type: String, default: 'cod' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);