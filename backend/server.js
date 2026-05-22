const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'pathnel-secret-2024';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'pathnel123';

app.use(cors());
app.use(express.json());

// ─── Auth Middleware ──────────────────────────────────────────────
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ─── Admin Auth ───────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, username });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// ─── Products ────────────────────────────────────────────────────
app.get('/api/products', (req, res) => {
  const { category, min_price, max_price, sort, featured } = req.query;
  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (category) { query += ' AND category = ?'; params.push(category); }
  if (min_price) { query += ' AND price >= ?'; params.push(parseFloat(min_price)); }
  if (max_price) { query += ' AND price <= ?'; params.push(parseFloat(max_price)); }
  if (featured === '1') { query += ' AND is_featured = 1'; }

  if (sort === 'price_asc') query += ' ORDER BY COALESCE(sale_price, price) ASC';
  else if (sort === 'price_desc') query += ' ORDER BY COALESCE(sale_price, price) DESC';
  else if (sort === 'name_asc') query += ' ORDER BY name ASC';
  else if (sort === 'name_desc') query += ' ORDER BY name DESC';
  else query += ' ORDER BY created_at DESC';

  res.json(db.prepare(query).all(...params));
});

app.get('/api/products/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.post('/api/products', requireAuth, (req, res) => {
  const { name, description, price, sale_price, category, image_url, stock_quantity, is_featured, is_new, is_sale } = req.body;
  if (!name || !price || !category) return res.status(400).json({ error: 'name, price, category required' });
  const result = db.prepare(`
    INSERT INTO products (name, description, price, sale_price, category, image_url, stock_quantity, is_featured, is_new, is_sale)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(name, description, price, sale_price || null, category, image_url, stock_quantity || 0, is_featured ? 1 : 0, is_new ? 1 : 0, is_sale ? 1 : 0);
  res.status(201).json(db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid));
});

app.put('/api/products/:id', requireAuth, (req, res) => {
  const { name, description, price, sale_price, category, image_url, stock_quantity, is_featured, is_new, is_sale } = req.body;
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  db.prepare(`
    UPDATE products SET name=?, description=?, price=?, sale_price=?, category=?, image_url=?, stock_quantity=?, is_featured=?, is_new=?, is_sale=?
    WHERE id=?
  `).run(name, description, price, sale_price || null, category, image_url, stock_quantity, is_featured ? 1 : 0, is_new ? 1 : 0, is_sale ? 1 : 0, req.params.id);
  res.json(db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id));
});

app.delete('/api/products/:id', requireAuth, (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ message: 'Product deleted' });
});

// ─── Orders ──────────────────────────────────────────────────────
app.post('/api/orders', (req, res) => {
  const { customer_name, customer_email, shipping_address, items } = req.body;
  if (!customer_name || !customer_email || !shipping_address || !items?.length)
    return res.status(400).json({ error: 'Missing required fields' });

  let total = 0;
  const resolvedItems = [];
  for (const item of items) {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.product_id);
    if (!product) return res.status(400).json({ error: `Product ${item.product_id} not found` });
    const price = product.sale_price || product.price;
    total += price * item.quantity;
    resolvedItems.push({ product_id: item.product_id, quantity: item.quantity, price_at_time: price });
  }

  const order = db.prepare(`
    INSERT INTO orders (customer_name, customer_email, shipping_address, total_amount, status)
    VALUES (?, ?, ?, ?, 'Pending')
  `).run(customer_name, customer_email, JSON.stringify(shipping_address), total);

  const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES (?, ?, ?, ?)
  `);
  for (const item of resolvedItems) {
    insertItem.run(order.lastInsertRowid, item.product_id, item.quantity, item.price_at_time);
  }

  res.status(201).json({ id: order.lastInsertRowid, total_amount: total, status: 'Pending' });
});

app.get('/api/orders', requireAuth, (req, res) => {
  res.json(db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all());
});

app.get('/api/orders/:id', requireAuth, (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  const items = db.prepare(`
    SELECT oi.*, p.name, p.image_url FROM order_items oi
    LEFT JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?
  `).all(req.params.id);
  res.json({ ...order, items });
});

app.patch('/api/orders/:id/status', requireAuth, (req, res) => {
  const { status } = req.body;
  const valid = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ id: req.params.id, status });
});

// ─── Subscribers ─────────────────────────────────────────────────
app.post('/api/subscribers', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  try {
    db.prepare('INSERT INTO subscribers (email) VALUES (?)').run(email);
    res.status(201).json({ message: 'Subscribed!' });
  } catch {
    res.status(409).json({ error: 'Already subscribed' });
  }
});

app.get('/api/subscribers', requireAuth, (req, res) => {
  res.json(db.prepare('SELECT * FROM subscribers ORDER BY created_at DESC').all());
});

// ─── Stats ───────────────────────────────────────────────────────
app.get('/api/stats', requireAuth, (req, res) => {
  res.json({
    total_products: db.prepare('SELECT COUNT(*) as c FROM products').get().c,
    total_orders: db.prepare('SELECT COUNT(*) as c FROM orders').get().c,
    total_subscribers: db.prepare('SELECT COUNT(*) as c FROM subscribers').get().c,
    total_revenue: db.prepare("SELECT COALESCE(SUM(total_amount),0) as r FROM orders WHERE status != 'Cancelled'").get().r,
    pending_orders: db.prepare("SELECT COUNT(*) as c FROM orders WHERE status = 'Pending'").get().c
  });
});

// ─── Categories ──────────────────────────────────────────────────
app.get('/api/categories', (req, res) => {
  res.json(db.prepare('SELECT DISTINCT category FROM products ORDER BY category').all().map(r => r.category));
});

app.listen(PORT, () => console.log(`🚀 Pathnel Tech API running on http://localhost:${PORT}`));
