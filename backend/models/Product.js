const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name:        { type: String,  required: true, trim: true },
    description: { type: String,  required: true },
    price:       { type: Number,  required: true, min: 0 },
    image:       { type: String,  default: 'https://placehold.co/400x300?text=Product' },
    category:    { type: String,  required: true },
    stock:       { type: Number,  default: 100, min: 0 },
    rating:      { type: Number,  default: 4.0, min: 0, max: 5 },
    reviews:     { type: Number,  default: 0 },
    featured:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);