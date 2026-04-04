const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1, min: 1 },
  price:    { type: Number, required: true },
});

const cartSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    items:     [cartItemSchema],
  },
  { timestamps: true }
);

// Virtual: cart total
cartSchema.virtual('total').get(function () {
  return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

module.exports = mongoose.model('Cart', cartSchema);