const express = require('express');
const router  = express.Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { search, category, featured } = req.query;
    const filter = {};
    if (search)   filter.name     = { $regex: search, $options: 'i' };
    if (category) filter.category = category;
    if (featured) filter.featured = true;
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/seed/demo', async (req, res) => {
  try {
    await Product.deleteMany({});
    const sample = [
      { name: 'Wireless Noise-Cancelling Headphones', description: 'Premium over-ear headphones with 30-hour battery life, deep bass, and crystal-clear audio.', price: 79.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', category: 'Electronics', stock: 50, rating: 4.7, reviews: 312, featured: true },
      { name: 'Minimalist Leather Watch', description: 'Slim stainless steel case with genuine leather strap. Water-resistant up to 50m.', price: 129.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop', category: 'Fashion', stock: 30, rating: 4.5, reviews: 189, featured: true },
      { name: 'Portable Bluetooth Speaker', description: '360-degree sound, IPX7 waterproof, 20-hour playtime.', price: 49.99, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop', category: 'Electronics', stock: 75, rating: 4.6, reviews: 428 },
      { name: 'Ergonomic Office Chair', description: 'Lumbar support, adjustable armrests, breathable mesh back.', price: 249.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', category: 'Home & Office', stock: 20, rating: 4.4, reviews: 95, featured: true },
      { name: 'Stainless Steel Water Bottle', description: 'Double-wall vacuum insulated. Keeps drinks cold 24h or hot 12h. BPA-free, 32oz.', price: 34.99, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop', category: 'Sports', stock: 120, rating: 4.8, reviews: 654 },
      { name: 'Smart LED Desk Lamp', description: 'Touch dimmer, 5 colour temperatures, USB charging port.', price: 44.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop', category: 'Home & Office', stock: 60, rating: 4.3, reviews: 201 },
      { name: 'Running Shoes', description: 'Lightweight foam midsole, breathable upper, anti-slip rubber outsole.', price: 89.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', category: 'Sports', stock: 45, rating: 4.6, reviews: 378 },
      { name: 'Mechanical Keyboard', description: 'TKL layout, RGB backlit, tactile blue switches.', price: 109.99, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop', category: 'Electronics', stock: 35, rating: 4.7, reviews: 512, featured: true },
      { name: 'Canvas Tote Bag', description: 'Durable 12oz canvas, reinforced handles, inner zip pocket.', price: 24.99, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=300&fit=crop', category: 'Fashion', stock: 90, rating: 4.2, reviews: 143 },
      { name: 'Yoga Mat', description: 'Extra-thick 6mm non-slip mat with alignment lines. Includes carry strap.', price: 39.99, image: 'https://images.unsplash.com/photo-1601925228606-4f0a97e5a601?w=400&h=300&fit=crop', category: 'Sports', stock: 80, rating: 4.5, reviews: 267 },
    ];
    const created = await Product.insertMany(sample);
    res.status(201).json({ message: `${created.length} products seeded`, products: created });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;