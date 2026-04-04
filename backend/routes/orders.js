const express = require('express');
const router  = express.Router();
const Order   = require('../models/Order');
const Cart    = require('../models/Cart');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', async (req, res) => {
  try {
    const { sessionId, customer, paymentMethod } = req.body;
    const cart = await Cart.findOne({ sessionId }).populate('items.product');
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: 'Cart is empty' });
    const items = cart.items.map(item => ({
      product:  item.product._id,
      name:     item.product.name,
      quantity: item.quantity,
      price:    item.price,
    }));
    const total = +items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2);
    const order = await Order.create({ sessionId, items, total, customer, paymentMethod });
    await Cart.findOneAndDelete({ sessionId });
    res.status(201).json({ message: 'Order placed successfully!', orderId: order._id, total });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    );
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;