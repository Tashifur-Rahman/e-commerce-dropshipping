const express = require('express');
const router  = express.Router();
const Cart    = require('../models/Cart');
const Product = require('../models/Product');

async function getCart(sessionId) {
  let cart = await Cart.findOne({ sessionId }).populate('items.product');
  if (!cart) cart = new Cart({ sessionId, items: [] });
  return cart;
}

function formatCart(cart) {
  if (!cart) return { items: [], total: 0, count: 0 };
  const items = cart.items.map(item => ({
    productId: (item.product._id || item.product).toString(),
    name:      item.product.name || 'Unknown',
    image:     item.product.image || '',
    price:     item.price,
    quantity:  item.quantity,
    subtotal:  +(item.price * item.quantity).toFixed(2),
  }));
  const total = +items.reduce((s, i) => s + i.subtotal, 0).toFixed(2);
  const count =  items.reduce((s, i) => s + i.quantity, 0);
  return { items, total, count };
}

router.get('/:sessionId', async (req, res) => {
  try {
    const cart = await getCart(req.params.sessionId);
    res.json(formatCart(cart));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/:sessionId/add', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const cart  = await getCart(req.params.sessionId);
    const index = cart.items.findIndex(i =>
      (i.product._id || i.product).toString() === productId
    );
    if (index > -1) {
      cart.items[index].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, price: product.price });
    }
    await cart.save();
    const populated = await Cart.findOne({ sessionId: req.params.sessionId }).populate('items.product');
    res.json(formatCart(populated));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:sessionId/update', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart  = await getCart(req.params.sessionId);
    const index = cart.items.findIndex(i =>
      (i.product._id || i.product).toString() === productId
    );
    if (index === -1) return res.status(404).json({ message: 'Item not in cart' });
    if (quantity <= 0) { cart.items.splice(index, 1); }
    else               { cart.items[index].quantity = quantity; }
    await cart.save();
    const populated = await Cart.findOne({ sessionId: req.params.sessionId }).populate('items.product');
    res.json(formatCart(populated));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:sessionId/remove/:productId', async (req, res) => {
  try {
    const cart = await getCart(req.params.sessionId);
    cart.items  = cart.items.filter(i =>
      (i.product._id || i.product).toString() !== req.params.productId
    );
    await cart.save();
    const populated = await Cart.findOne({ sessionId: req.params.sessionId }).populate('items.product');
    res.json(formatCart(populated));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:sessionId/clear', async (req, res) => {
  try {
    await Cart.findOneAndDelete({ sessionId: req.params.sessionId });
    res.json({ items: [], total: 0, count: 0 });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;