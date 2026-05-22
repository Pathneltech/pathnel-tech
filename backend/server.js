const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'pathnel-secret-2024';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'pathnel123';

const db = new sqlite3.Database(path.join(__dirname, 'pathnel.db'));

db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, description TEXT, price REAL NOT NULL,
    sale_price REAL, category TEXT NOT NULL, image_url TEXT,
    stock_quantity INTEGER DEFAULT 0, is_featured INTEGER DEFAULT 0,
    is_new INTEGER DEFAULT 0, is_sale INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')))`);
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL, customer_email TEXT NOT NULL,
    shipping_address TEXT NOT NULL, total_amount REAL NOT NULL,
    status TEXT DEFAULT 'Pending', created_at TEXT DEFAULT (datetime('now')))`);
  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL, product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL, price_at_time REAL NOT NULL)`);
  db.run(`CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL, created_at TEXT DEFAULT (datetime('now')))`);
});

app.use(cors());
app.use(express.json());

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

const dbAll = (sql, params = []) => new Promise((resolve, reject) =>
  db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows)));
const dbGet = (sql, params = []) => new Promise((resolve, reject) =>
  db.get(sql, params, (err, row) => err ? reject(err) : resolve(row)));
const dbRun = (sql, params = []) => new Promise((resolve, reject) =>
  db.run(sql, params, function(err) { err ? reject(err) : resolve(this); }));

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, username });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
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
    res.json(await dbAll(query, params));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await dbGet('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/products', requireAuth, async (req, res) => {
  try {
    const { name, description, price, sale_price, category, image_url, stock_quantity, is_featured, is_new, is_sale } = req.body;
    if (!name || !price || !category) return res.status(400).json({ error: 'name, price, category required' });
    const result = await dbRun(
      `INSERT INTO products (name, description, price, sale_price, category, image_url, stock_quantity, is_featured, is_new, is_sale) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, price, sale_price || null, category, image_url, stock_quantity || 0, is_featured ? 1 : 0, is_new ? 1 : 0, is_sale ? 1 : 0]
    );
    res.status(201).json(await dbGet('SELECT * FROM products WHERE id = ?', [result.lastID]));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/products/:id', requireAuth, async (req, res) => {
  try {
    const { name, description, price, sale_price, category, image_url, stock_quantity, is_featured, is_new, is_sale } = req.body;
    const product = await dbGet('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await dbRun(
      `UPDATE products SET name=?, description=?, price=?, sale_price=?, category=?, image_url=?, stock_quantity=?, is_featured=?, is_new=?, is_sale=? WHERE id=?`,
      [name, description, price, sale_price || null, category, image_url, stock_quantity, is_featured ? 1 : 0, is_new ? 1 : 0, is_sale ? 1 : 0, req.params.id]
    );
    res.json(await dbGet('SELECT * FROM products WHERE id = ?', [req.params.id]));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/products/:id', requireAuth, async (req, res) => {
  try {
    const product = await dbGet('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await dbRun('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { customer_name, customer_email, shipping_address, items } = req.body;
    if (!customer_name || !customer_email || !shipping_address || !items?.length)
      return res.status(400).json({ error: 'Missing required fields' });
    let total = 0;
    const resolvedItems = [];
    for (const item of items) {
      const product = await dbGet('SELECT * FROM products WHERE id = ?', [item.product_id]);
      if (!product) return res.status(400).json({ error: `Product ${item.product_id} not found` });
      const price = product.sale_price || product.price;
      total += price * item.quantity;
      resolvedItems.push({ product_id: item.product_id, quantity: item.quantity, price_at_time: price });
    }
    const order = await dbRun(
      `INSERT INTO orders (customer_name, customer_email, shipping_address, total_amount, status) VALUES (?, ?, ?, ?, 'Pending')`,
      [customer_name, customer_email, JSON.stringify(shipping_address), total]
    );
    for (const item of resolvedItems) {
      await dbRun(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES (?, ?, ?, ?)`,
        [order.lastID, item.product_id, item.quantity, item.price_at_time]
      );
    }
    res.status(201).json({ id: order.lastID, total_amount: total, status: 'Pending' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/orders', requireAuth, async (req, res) => {
  try { res.json(await dbAll('SELECT * FROM orders ORDER BY created_at DESC')); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/orders/:id', requireAuth, async (req, res) => {
  try {
    const order = await dbGet('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const items = await dbAll(
      `SELECT oi.*, p.name, p.image_url FROM order_items oi LEFT JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?`,
      [req.params.id]
    );
    res.json({ ...order, items });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/orders/:id/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    await dbRun('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ id: req.params.id, status });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/subscribers', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    await dbRun('INSERT INTO subscribers (email) VALUES (?)', [email]);
    res.status(201).json({ message: 'Subscribed!' });
  } catch (e) { res.status(409).json({ error: 'Already subscribed' }); }
});

app.get('/api/subscribers', requireAuth, async (req, res) => {
  try { res.json(await dbAll('SELECT * FROM subscribers ORDER BY created_at DESC')); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/stats', requireAuth, async (req, res) => {
  try {
    const [p, o, s, r, pending] = await Promise.all([
      dbGet('SELECT COUNT(*) as c FROM products'),
      dbGet('SELECT COUNT(*) as c FROM orders'),
      dbGet('SELECT COUNT(*) as c FROM subscribers'),
      dbGet("SELECT COALESCE(SUM(total_amount),0) as r FROM orders WHERE status != 'Cancelled'"),
      dbGet("SELECT COUNT(*) as c FROM orders WHERE status = 'Pending'")
    ]);
    res.json({ total_products: p.c, total_orders: o.c, total_subscribers: s.c, total_revenue: r.r, pending_orders: pending.c });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/categories', async (req, res) => {
  try {
    const rows = await dbAll('SELECT DISTINCT category FROM products ORDER BY category');
    res.json(rows.map(r => r.category));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(PORT, () => console.log(`Pathnel Tech API running on port ${PORT}`));
