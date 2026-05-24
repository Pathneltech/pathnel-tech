import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useCart } from '../context/CartContext';

// Flipping Product Card
function FlipCard({ product }) {
  const [flipped, setFlipped] = useState(false);
  const { dispatch } = useCart();
  const displayPrice = product.sale_price || product.price;

  return (
    <div
      onClick={() => setFlipped(f => !f)}
      style={{
        perspective: '1000px', cursor: 'pointer',
        height: 320, borderRadius: 16, flexShrink: 0,
        width: '100%'
      }}
    >
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.6s cubic-bezier(.4,0,.2,1)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
      }}>
        {/* Front */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          borderRadius: 16, overflow: 'hidden',
          background: 'white', boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          border: '1px solid var(--border)'
        }}>
          <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
            <img src={product.image_url} alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} />
            <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
              {product.is_sale ? <span className="badge badge-sale">Sale</span> : null}
              {product.is_new ? <span className="badge badge-new">New</span> : null}
            </div>
            <div style={{
              position: 'absolute', bottom: 10, right: 10,
              background: 'rgba(0,0,0,0.6)', color: 'white',
              fontSize: 11, padding: '4px 8px', borderRadius: 20
            }}>Tap to flip 👆</div>
          </div>
          <div style={{ padding: '12px 16px' }}>
            <div style={{ fontSize: 11, color: 'var(--mid)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{product.category}</div>
            <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3, marginBottom: 8 }}>{product.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--green)' }}>₦{displayPrice.toLocaleString('en-NG')}</span>
              {product.sale_price && <span style={{ fontSize: 12, color: 'var(--mid)', textDecoration: 'line-through' }}>₦{product.price.toLocaleString('en-NG')}</span>}
            </div>
          </div>
        </div>

        {/* Back */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)', borderRadius: 16,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a2f 100%)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          padding: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.15)'
        }}>
          <img src={product.image_url} alt={product.name}
            style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 12, marginBottom: 14, border: '2px solid var(--green)' }} />
          <div style={{ color: 'white', fontWeight: 700, fontSize: 14, textAlign: 'center', marginBottom: 8 }}>{product.name}</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, textAlign: 'center', marginBottom: 16, lineHeight: 1.5 }}>
            {product.description?.slice(0, 80)}...
          </div>
          <div style={{ color: 'var(--green)', fontWeight: 800, fontSize: 18, marginBottom: 16 }}>
            ₦{displayPrice.toLocaleString('en-NG')}
          </div>
          <div style={{ display: 'flex', gap: 8, width: '100%' }}>
            <button
              onClick={e => { e.stopPropagation(); dispatch({ type: 'ADD', product, qty: 1 }); }}
              className="btn btn-primary btn-sm"
              style={{ flex: 1, fontSize: 12 }}
            >🛒 Add to Cart</button>
            <Link
              to={`/product/${product.id}`}
              onClick={e => e.stopPropagation()}
              className="btn btn-sm"
              style={{ flex: 1, fontSize: 12, background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >View →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Category Card
function CategoryCard({ name, image, count, icon }) {
  return (
    <Link to={`/shop?category=${name}`} style={{ textDecoration: 'none' }}>
      <div style={{
        position: 'relative', borderRadius: 16, overflow: 'hidden',
        height: 160, cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end', padding: 16
        }}>
          <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
          <div style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>{name}</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{count} products</div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [onSale, setOnSale] = useState([]);
  const [email, setEmail] = useState('');
  const [subMsg, setSubMsg] = useState('');
  const [heroSlide, setHeroSlide] = useState(0);

  const heroSlides = [
    {
      title: 'Top Tech Gear for',
      highlight: 'Your Lifestyle',
      sub: 'Discover premium accessories, peripherals, and gadgets built for performance.',
      img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      cta: 'Shop Audio',
      link: '/shop?category=Audio'
    },
    {
      title: 'Power Up Your',
      highlight: 'Workspace',
      sub: 'Pro-grade keyboards, monitors, and accessories for maximum productivity.',
      img: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80',
      cta: 'Shop Keyboards',
      link: '/shop?category=Keyboards'
    },
    {
      title: 'Game Stronger,',
      highlight: 'Play Smarter',
      sub: 'High-performance gaming mice, headsets, and gear designed for winners.',
      img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
      cta: 'Shop Gaming',
      link: '/shop?category=Mice'
    }
  ];

  useEffect(() => {
    api.products('?featured=1').then(setFeatured).catch(console.error);
    api.products('?sort=price_asc').then(d => setNewArrivals(d.filter(p => p.is_new).slice(0, 8))).catch(console.error);
    api.products('').then(d => setOnSale(d.filter(p => p.is_sale).slice(0, 4))).catch(console.error);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setHeroSlide(s => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  async function handleSubscribe(e) {
    e.preventDefault();
    try {
      await api.subscribe(email);
      setSubMsg('🎉 Welcome to the Pathnel Tech family!');
      setEmail('');
    } catch {
      setSubMsg('Already subscribed or invalid email.');
    }
    setTimeout(() => setSubMsg(''), 4000);
  }

  const slide = heroSlides[heroSlide];

  const categories = [
    { name: 'Audio', icon: '🎧', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80', count: 20 },
    { name: 'Keyboards', icon: '⌨️', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&q=80', count: 10 },
    { name: 'Mice', icon: '🖱️', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80', count: 10 },
    { name: 'Monitors', icon: '🖥️', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80', count: 8 },
    { name: 'Chargers', icon: '🔌', image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80', count: 10 },
    { name: 'Cameras', icon: '📷', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80', count: 8 },
    { name: 'Accessories', icon: '🛍️', image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&q=80', count: 34 },
  ];

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        position: 'relative', minHeight: '92vh',
        background: 'linear-gradient(135deg, #0a0f1e 0%, #0d2818 60%, #0a1628 100%)',
        display: 'flex', alignItems: 'center', overflow: 'hidden'
      }}>
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `url(${slide.img})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.12, transition: 'background-image 0.8s'
        }} />

        {/* Floating blobs */}
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', zIndex: 0 }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 80, paddingBottom: 80 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>

            {/* Left: Text */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)',
                color: 'var(--green)', padding: '6px 14px', borderRadius: 20, fontSize: 13,
                fontWeight: 600, marginBottom: 24
              }}>
                ✦ New Season Arrivals
              </div>

              <h1 style={{
                fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800,
                color: 'white', lineHeight: 1.1, marginBottom: 20
              }}>
                {slide.title}<br />
                <span style={{ color: 'var(--green)' }}>{slide.highlight}</span>
              </h1>

              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(15px, 1.5vw, 18px)', lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
                {slide.sub}
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
                <Link to={slide.link} className="btn btn-primary btn-lg">{slide.cta} →</Link>
                <Link to="/shop" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                  All Products
                </Link>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                {[['100+', 'Products'], ['10k+', 'Customers'], ['4.9★', 'Rating']].map(([val, label]) => (
                  <div key={label}>
                    <div style={{ color: 'white', fontWeight: 800, fontSize: 24 }}>{val}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Flip Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {featured.slice(0, 4).map(p => <FlipCard key={p.id} product={p} />)}
              {featured.length === 0 && [1,2,3,4].map(i => (
                <div key={i} style={{ height: 320, borderRadius: 16, background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          </div>

          {/* Slide dots */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 40 }}>
            {heroSlides.map((_, i) => (
              <button key={i} onClick={() => setHeroSlide(i)} style={{
                width: i === heroSlide ? 24 : 8, height: 8, borderRadius: 4,
                background: i === heroSlide ? 'var(--green)' : 'rgba(255,255,255,0.3)',
                border: 'none', cursor: 'pointer', transition: 'all 0.3s'
              }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────────── */}
      <div style={{ background: 'var(--dark)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16, padding: '18px 0' }}>
            {[
              ['🚚', 'Free Shipping', 'On orders over ₦50,000'],
              ['↩️', '30-Day Returns', 'Hassle-free guarantee'],
              ['🔒', 'Secure Payment', '100% protected'],
              ['💬', '24/7 Support', 'Always here for you'],
            ].map(([icon, title, sub]) => (
              <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>{icon}</span>
                <div>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CATEGORIES ───────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--light)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">🗂 Browse by Category</div>
            <h2>Shop by Category</h2>
            <p>Find exactly what you need across our 7 tech categories.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
            {categories.map(cat => <CategoryCard key={cat.name} {...cat} />)}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">✦ Handpicked for You</div>
            <h2>Featured Products</h2>
            <p>Our best-selling and most-loved items, curated for your tech needs.</p>
          </div>
          {featured.length === 0 ? (
            <div className="loading-center"><div className="spinner"></div></div>
          ) : (
            <div className="products-grid">
              {featured.slice(0, 8).map(p => (
                <Link key={p.id} to={`/product/${p.id}`} style={{ textDecoration: 'none' }}>
                  <div className="product-card" style={{ cursor: 'pointer' }}>
                    <div className="product-card-img">
                      <img src={p.image_url} alt={p.name} loading="lazy" />
                      <div className="product-card-badges">
                        {p.is_sale ? <span className="badge badge-sale">Sale</span> : null}
                        {p.is_new ? <span className="badge badge-new">New</span> : null}
                      </div>
                    </div>
                    <div className="product-card-body">
                      <div className="product-card-category">{p.category}</div>
                      <div className="product-card-name">{p.name}</div>
                      <div className="product-card-price">
                        <span className="price-current">₦{(p.sale_price || p.price).toLocaleString('en-NG')}</span>
                        {p.sale_price && <span className="price-original">₦{p.price.toLocaleString('en-NG')}</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link to="/shop" className="btn btn-dark btn-lg">View All 100+ Products →</Link>
          </div>
        </div>
      </section>

      {/* ── PROMO BANNER ─────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d2818 100%)', padding: '64px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <div className="section-tag" style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--green)', marginBottom: 16 }}>🔥 Limited Time Deals</div>
              <h2 style={{ color: 'white', fontSize: 'clamp(28px, 3vw, 44px)', marginBottom: 16 }}>Boost Your Productivity 🚀</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 28 }}>
                Upgrade your workspace with pro-grade peripherals. From mechanical keyboards to 4K monitors — everything your setup needs.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/shop?category=Keyboards" className="btn btn-primary btn-lg">Shop Keyboards</Link>
                <Link to="/shop?category=Monitors" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>View Monitors</Link>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { icon: '⌨️', title: 'Mechanical Keyboards', sub: 'From ₦12,000', link: '/shop?category=Keyboards' },
                { icon: '🖥️', title: '4K Monitors', sub: 'From ₦115,000', link: '/shop?category=Monitors' },
                { icon: '🖱️', title: 'Gaming Mice', sub: 'From ₦8,500', link: '/shop?category=Mice' },
                { icon: '🔌', title: 'Fast Chargers', sub: 'From ₦15,000', link: '/shop?category=Chargers' },
              ].map(item => (
                <Link key={item.title} to={item.link} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, padding: 20, transition: 'background 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,197,94,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  >
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
                    <div style={{ color: 'white', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{item.title}</div>
                    <div style={{ color: 'var(--green)', fontSize: 12, fontWeight: 600 }}>{item.sub}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ON SALE ───────────────────────────────────────────── */}
      {onSale.length > 0 && (
        <section className="section" style={{ background: 'var(--light)' }}>
          <div className="container">
            <div className="section-header">
              <div className="section-tag">🏷️ Hot Deals</div>
              <h2>On Sale Now</h2>
              <p>Limited time offers — grab them before they're gone!</p>
            </div>
            <div className="products-grid">
              {onSale.map(p => (
                <Link key={p.id} to={`/product/${p.id}`} style={{ textDecoration: 'none' }}>
                  <div className="product-card" style={{ cursor: 'pointer' }}>
                    <div className="product-card-img">
                      <img src={p.image_url} alt={p.name} loading="lazy" />
                      <div className="product-card-badges">
                        <span className="badge badge-sale">Sale</span>
                        {p.is_new ? <span className="badge badge-new">New</span> : null}
                      </div>
                    </div>
                    <div className="product-card-body">
                      <div className="product-card-category">{p.category}</div>
                      <div className="product-card-name">{p.name}</div>
                      <div className="product-card-price">
                        <span className="price-current">₦{p.sale_price.toLocaleString('en-NG')}</span>
                        <span className="price-original">₦{p.price.toLocaleString('en-NG')}</span>
                        <span style={{ fontSize: 11, background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: 10, fontWeight: 600 }}>
                          -{Math.round((1 - p.sale_price / p.price) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WHY CHOOSE US ─────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">💡 Why Pathnel Tech</div>
            <h2>Why Shop With Us?</h2>
            <p>We're not just another tech store — we're your trusted tech partner.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
            {[
              { icon: '✅', title: 'Genuine Products', desc: 'Every product is 100% authentic, sourced directly from verified manufacturers.' },
              { icon: '💰', title: 'Best Prices', desc: 'We price-match competitors so you always get the best deal on premium tech.' },
              { icon: '🚀', title: 'Fast Delivery', desc: 'Same-day dispatch on orders before 2PM. Nationwide delivery in 1–3 days.' },
              { icon: '🛡️', title: 'Warranty Support', desc: 'All products come with manufacturer warranty and our after-sales support.' },
              { icon: '📱', title: 'Easy Returns', desc: '30-day hassle-free return policy — no questions asked.' },
              { icon: '🌍', title: 'Nationwide', desc: 'We deliver to all 36 states in Nigeria including FCT Abuja.' },
            ].map(item => (
              <div key={item.title} style={{
                background: 'white', border: '1px solid var(--border)',
                borderRadius: 16, padding: 24,
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{item.title}</div>
                <div style={{ color: 'var(--mid)', fontSize: 13, lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--light)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">⭐ Customer Reviews</div>
            <h2>What Our Customers Say</h2>
            <p>Thousands of happy customers across Nigeria trust Pathnel Tech.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { name: 'Chukwuemeka A.', loc: 'Lagos', rating: 5, text: 'Got my mechanical keyboard in 2 days. Build quality is amazing and customer service was top notch. Will definitely order again!' },
              { name: 'Fatima M.', loc: 'Abuja', rating: 5, text: 'The noise-cancelling headphones I ordered are incredible. Sound quality rivals brands 3x the price. Great value for money!' },
              { name: 'Taiwo B.', loc: 'Port Harcourt', rating: 5, text: 'Fast delivery, genuine product, and great packaging. Pathnel Tech is now my go-to for all my tech needs.' },
              { name: 'Adaeze O.', loc: 'Enugu', rating: 5, text: 'Ordered the 4K webcam for my YouTube channel. Image quality is stunning. Delivery was faster than expected!' },
              { name: 'Ibrahim S.', loc: 'Kano', rating: 5, text: 'Best prices I could find anywhere in Nigeria. The gaming mouse is perfect and arrived well packaged.' },
              { name: 'Ngozi K.', loc: 'Ibadan', rating: 5, text: 'Returned an item and got a replacement within 3 days no stress. Their customer service is genuinely excellent.' },
            ].map((r, i) => (
              <div key={i} style={{
                background: 'white', borderRadius: 16, padding: 24,
                border: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
              }}>
                <div style={{ color: '#f59e0b', fontSize: 16, marginBottom: 12 }}>{'★'.repeat(r.rating)}</div>
                <p style={{ color: 'var(--dark)', fontSize: 14, lineHeight: 1.7, marginBottom: 16, fontStyle: 'italic' }}>"{r.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</div>
                    <div style={{ color: 'var(--mid)', fontSize: 12 }}>{r.loc}, Nigeria</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d2818 100%)', padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
            <div className="section-tag" style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--green)', display: 'inline-block', marginBottom: 16 }}>📬 Newsletter</div>
            <h2 style={{ color: 'white', fontSize: 'clamp(28px, 3vw, 40px)', marginBottom: 16 }}>Get Exclusive Deals</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 32, lineHeight: 1.7 }}>
              Join 10,000+ tech enthusiasts. Get early access to sales, new arrivals, and tech tips — zero spam.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 12, maxWidth: 440, margin: '0 auto', flexWrap: 'wrap' }}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ flex: 1, minWidth: 200, padding: '14px 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: 14, outline: 'none' }}
              />
              <button type="submit" className="btn btn-primary btn-lg">Subscribe →</button>
            </form>
            {subMsg && <p style={{ marginTop: 16, color: 'var(--green)', fontSize: 14 }}>{subMsg}</p>}
          </div>
        </div>
      </section>
    </>
  );
}
