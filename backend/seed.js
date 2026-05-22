const db = require('./db');

const products = [
  {
    name: 'ProSound Elite Wireless Headphones',
    description: 'Experience studio-quality audio with 40-hour battery life, active noise cancellation, and premium leather ear cushions. The ProSound Elite delivers exceptional clarity across all frequencies.',
    price: 129.99,
    sale_price: 99.99,
    category: 'Audio',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    stock_quantity: 45,
    is_featured: 1,
    is_new: 0,
    is_sale: 1
  },
  {
    name: 'TurboCharge 100W GaN Adapter',
    description: 'Ultra-compact 100W GaN charger with 3 ports (2x USB-C, 1x USB-A). Charges your laptop, phone, and tablet simultaneously. Foldable design fits in any pocket.',
    price: 59.99,
    sale_price: null,
    category: 'Chargers',
    image_url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80',
    stock_quantity: 80,
    is_featured: 1,
    is_new: 1,
    is_sale: 0
  },
  {
    name: 'SlimEdge Mechanical Keyboard',
    description: 'Low-profile mechanical keyboard with custom tactile switches, per-key RGB lighting, and aircraft-grade aluminum chassis. Compatible with Windows and macOS.',
    price: 149.99,
    sale_price: null,
    category: 'Keyboards',
    image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
    stock_quantity: 30,
    is_featured: 1,
    is_new: 1,
    is_sale: 0
  },
  {
    name: 'ViewMax 4K USB-C Monitor 27"',
    description: '27-inch 4K IPS display with 99% sRGB coverage, USB-C 90W power delivery, and a sleek borderless design. Perfect for creative professionals and power users.',
    price: 399.99,
    sale_price: 349.99,
    category: 'Monitors',
    image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80',
    stock_quantity: 15,
    is_featured: 1,
    is_new: 0,
    is_sale: 1
  },
  {
    name: 'SwiftTrack Pro Wireless Mouse',
    description: 'Ultra-precision wireless mouse with 26,000 DPI optical sensor, 70-hour battery, and silent click technology. Works on any surface with tri-mode connectivity.',
    price: 79.99,
    sale_price: null,
    category: 'Mice',
    image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80',
    stock_quantity: 60,
    is_featured: 0,
    is_new: 1,
    is_sale: 0
  },
  {
    name: 'NanoHub 7-in-1 USB-C Hub',
    description: 'Expand your connectivity with 4K HDMI, 2x USB-A 3.0, USB-C PD 100W, SD/microSD card readers. Slim aluminum body with braided cable.',
    price: 44.99,
    sale_price: 34.99,
    category: 'Accessories',
    image_url: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&q=80',
    stock_quantity: 100,
    is_featured: 0,
    is_new: 0,
    is_sale: 1
  },
  {
    name: 'ClearVision Webcam 4K',
    description: 'Professional 4K webcam with auto-focus, built-in stereo microphone, and HDR support. Privacy shutter included. Plug-and-play with all major platforms.',
    price: 89.99,
    sale_price: null,
    category: 'Cameras',
    image_url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80',
    stock_quantity: 40,
    is_featured: 0,
    is_new: 1,
    is_sale: 0
  },
  {
    name: 'AirPods-Style True Wireless Earbuds',
    description: 'Crystal-clear sound with 8mm custom drivers, IPX5 water resistance, and 32-hour total battery life. Active noise cancellation and transparency mode.',
    price: 69.99,
    sale_price: 54.99,
    category: 'Audio',
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
    stock_quantity: 55,
    is_featured: 0,
    is_new: 0,
    is_sale: 1
  },
  {
    name: 'DeskPad Pro XL Mouse Mat',
    description: 'Extra-large 90x40cm desk mat with stitched edges, non-slip rubber base, and smooth micro-texture surface. Compatible with all mouse sensitivities.',
    price: 29.99,
    sale_price: null,
    category: 'Accessories',
    image_url: 'https://images.unsplash.com/photo-1612870710292-fc9acb9e4a36?w=600&q=80',
    stock_quantity: 120,
    is_featured: 0,
    is_new: 0,
    is_sale: 0
  },
  {
    name: 'StandUp Pro Laptop Stand',
    description: 'Ergonomic aluminum laptop stand with 6 height adjustments and 360° rotation. Folds flat for travel. Supports laptops 10–17 inches. Improves posture and airflow.',
    price: 49.99,
    sale_price: null,
    category: 'Accessories',
    image_url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
    stock_quantity: 70,
    is_featured: 0,
    is_new: 1,
    is_sale: 0
  },
  {
    name: 'StreamDeck Mini Controller',
    description: '6-key programmable controller for streamers and creators. Launch apps, switch scenes, control audio — all with custom icons and one-touch macros.',
    price: 79.99,
    sale_price: 64.99,
    category: 'Accessories',
    image_url: 'https://images.unsplash.com/photo-1606318005054-1c1e2e03eb5e?w=600&q=80',
    stock_quantity: 25,
    is_featured: 0,
    is_new: 0,
    is_sale: 1
  },
  {
    name: 'BassBoost Portable Speaker',
    description: 'Compact 360° speaker with powerful 20W output, 24-hour battery, IPX7 waterproof rating, and built-in power bank for charging your devices.',
    price: 59.99,
    sale_price: null,
    category: 'Audio',
    image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
    stock_quantity: 50,
    is_featured: 0,
    is_new: 1,
    is_sale: 0
  }
];

// Clear and re-seed
db.exec('DELETE FROM order_items; DELETE FROM orders; DELETE FROM subscribers; DELETE FROM products;');

const insert = db.prepare(`
  INSERT INTO products (name, description, price, sale_price, category, image_url, stock_quantity, is_featured, is_new, is_sale)
  VALUES (@name, @description, @price, @sale_price, @category, @image_url, @stock_quantity, @is_featured, @is_new, @is_sale)
`);

const insertMany = db.transaction((items) => {
  for (const item of items) insert.run(item);
});

insertMany(products);

// Sample order
const order = db.prepare(`
  INSERT INTO orders (customer_name, customer_email, shipping_address, total_amount, status)
  VALUES (?, ?, ?, ?, ?)
`).run('Jane Smith', 'jane@example.com', '123 Tech Ave, San Francisco, CA 94102', 229.98, 'Processing');

db.prepare(`
  INSERT INTO order_items (order_id, product_id, quantity, price_at_time)
  VALUES (?, ?, ?, ?)
`).run(order.lastInsertRowid, 1, 1, 99.99);
db.prepare(`
  INSERT INTO order_items (order_id, product_id, quantity, price_at_time)
  VALUES (?, ?, ?, ?)
`).run(order.lastInsertRowid, 3, 1, 149.99);

db.prepare(`INSERT INTO subscribers (email) VALUES (?)`).run('techfan@example.com');
db.prepare(`INSERT INTO subscribers (email) VALUES (?)`).run('gadgetlover@example.com');

console.log(`✅ Seeded ${products.length} products, 1 order, 2 subscribers`);
