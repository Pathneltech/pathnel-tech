import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useCart } from '../context/CartContext';

// Hook to detect mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

// Flipping Product Card
function FlipCard({ product }) {
  const [flipped, setFlipped] = useState(false);
  const { dispatch } = useCart();
  const displayPrice = product.sale_price || product.price;

  return (
    <div
      onClick={() => setFlipped(f => !f)}
      style={{ perspective: '1000px', cursor: 'pointer', height: 300, borderRadius: 16, width: '100%' }}
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
          <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
            <img src={product.image_url} alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4 }}>
              {product.is_sale ? <span className="badge badge-sale">Sale</span> : null}
              {product.is_new ? <span className="badge badge-new">New</span> : null}
            </div>
            <div style={{
              position: 'absolute', bottom: 8, right: 8,
              background: 'rgba(0,0,0,0.6)', color: 'white',
              fontSize: 10, padding: '3px 7px', borderRadius: 20
            }}>Tap to flip 👆</div>
          </div>
          <div style={{ padding: '10px 14px' }}>
            <div style={{ fontSize: 10, color: 'var(--mid)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 1 }}>{product.category}</div>
            <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.3, marginBottom: 6 }}>{product.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--green)' }}>₦{displayPrice.toLocaleString('en-NG')}</span>
              {product.sale_price && <span style={{ fontSize: 11, color: 'var(--mid)', textDecoration: 'line-through' }}>₦{product.price.toLocaleString('en-NG')}</span>}
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
          padding: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.15)'
        }}>
          <img src={product.image_url} alt={product.name}
            style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 10, marginBottom: 10, border: '2px solid var(--green)' }} />
          <div style={{ color: 'white', fontWeight: 700, fontSize: 13, textAlign: 'center', marginBottom: 6 }}>{product.name}</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, textAlign: 'center', marginBottom: 12, lineHeight: 1.5 }}>
            {product.description?.slice(0, 70)}...
          </div>
          <div style={{ color: 'var(--green)', fontWeight: 800, fontSize: 16, marginBottom: 12 }}>
            ₦{displayPrice.toLocaleString('en-NG')}
          </div>
          <div style={{ display: 'flex', gap: 6, width: '100%' }}>
            <button
              onClick={e => { e.stopPropagation(); dispatch({ type: 'ADD', product, qty: 1 }); }}
              className="btn btn-primary btn-sm"
              style={{ flex: 1, fontSize: 11 }}
            >🛒 Add</button>
            <Link
              to={`/product/${product.id}`}
              onClick={e => e.stopPropagation()}
              className="btn btn-sm"
              style={{ flex: 1, fontSize: 11, background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
        position: 'relative', borderRadius: 14, overflow: 'hidden',
        height: 140, cursor: 'pointer',
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
          justifyContent: 'flex-end', padding: 12
        }}>
          <div style={{ fontSize: 18, marginBottom: 2 }}>{icon}</div>
          <div style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>{name}</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>{count} products</div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const isMobile = useIsMobile();
  const [featured, setFeatured] = useState([]);
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
      cta: 'Shop Audio', link: '/shop?category=Audio'
    },
    {
      title: 'Power Up Your',
      highlight: 'Workspace',
      sub: 'Pro-grade keyboards, monitors, and accessories for maximum productivity.',
      img: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80',
      cta: 'Shop Keyboards', link: '/shop?category=Keyboards'
    },
    {
      title: 'Game Stronger,',
      highlight: 'Play Smarter',
      sub: 'High-performance gaming mice, headsets, and gear designed for winners.',
      img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
      cta: 'Shop Gaming', link: '/shop?category=Mice'
    }
  ];

  useEffect(() => {
    api.products('?featured=1').then(setFeatured).catch(console.error);
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
    } catch { setSubMsg('Already subscribed or invalid email.'); }
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
        position: 'relative',
        background: 'linear-gradient(135deg, #0a0f1e 0%, #0d2818 60%, #0a1628 100%)',
        overflow: 'hidden', paddingTop: isMobile ? 48 : 80, paddingBottom: isMobile ? 48 : 80
      }}>
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `url(${slide.img})`,
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.1
        }} />
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', zIndex: 0 }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? 32 : 48,
            alignItems: 'center'
          }}>
            {/* Left: Text */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)',
                color: 'var(--green)', padding: '6px 14px', borderRadius: 20,
                fontSize: 12, fontWeight: 600, marginBottom: 20
              }}>✦ New Season Arrivals</div>

              <h1 style={{
                fontSize: isMobile ? 'clamp(32px, 9vw, 48px)' : 'clamp(36px, 4vw, 60px)',
                fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: 16
              }}>
                {slide.title}<br />
                <span style={{ color: 'var(--green)' }}>{slide.highlight}</span>
              </h1>

              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: isMobile ? 14 : 16, lineHeight: 1.7, marginBottom: 28, maxWidth: 480 }}>
                {slide.sub}
              </p>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
                <Link to={slide.link} className="btn btn-primary" style={{ fontSize: isMobile ? 14 : 16, padding: isMobile ? '12px 20px' : '14px 28px' }}>
                  {slide.cta} →
                </Link>
                <Link to="/shop" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', fontSize: isMobile ? 14 : 16, padding: isMobile ? '12px 20px' : '14px 28px' }}>
                  All Products
                </Link>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: isMobile ? 24 : 32 }}>
                {[['100+', 'Products'], ['10k+', 'Customers'], ['4.9★', 'Rating']].map(([val, label]) => (
                  <div key={label}>
                    <div style={{ color: 'white', fontWeight: 800, fontSize: isMobile ? 20 : 24 }}>{val}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Flip Cards — hidden on mobile, shown on desktop */}
            {!isMobile && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {featured.slice(0, 4).map(p => <FlipCard key={p.id} product={p} />)}
                {featured.length === 0 && [1,2,3,4].map(i => (
                  <div key={i} style={{ height: 300, borderRadius: 16, background: 'rgba(255,255,255,0.05)' }} />
                ))}
              </div>
            )}
          </div>

          {/* Mobile: horizontal scroll cards */}
          {isMobile && featured.length > 0 && (
            <div style={{ marginTop: 32 }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 12, fontWeight: 600 }}>
                ✦ Featured Products — tap to flip
              </div>
              <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
                {featured.slice(0, 6).map(p => (
                  <div key={p.id} style={{ minWidth: 180, flexShrink: 0 }}>
                    <FlipCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Slide dots */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 32 }}>
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
      <div style={{ background: 'var(--dark-2)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container">
          <div style={{
            display: 'flex', justifyContent: isMobile ? 'flex-start' : 'space-around',
            flexWrap: isMobile ? 'nowrap' : 'wrap',
            gap: 16, padding: '14px 0',
            overflowX: isMobile ? 'auto' : 'visible',
            scrollbarWidth: 'none'
          }}>
            {[
              ['🚚', 'Free Shipping', 'Orders over ₦50,000'],
              ['↩️', '30-Day Returns', 'Hassle-free'],
              ['🔒', 'Secure Payment', '100% protected'],
              ['💬', '24/7 Support', 'Always here'],
            ].map(([icon, title, sub]) => (
              <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 20 }}>{icon}</span>
                <div>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: 12 }}>{title}</div>
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
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
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
                  <div className="product-card">
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
      <section style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d2818 100%)', padding: isMobile ? '48px 0' : '64px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 32 : 48, alignItems: 'center' }}>
            <div>
              <div className="section-tag" style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--green)', marginBottom: 16 }}>🔥 Limited Time Deals</div>
              <h2 style={{ color: 'white', fontSize: 'clamp(24px, 3vw, 40px)', marginBottom: 16 }}>Boost Your Productivity 🚀</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 24, fontSize: isMobile ? 14 : 16 }}>
                Upgrade your workspace with pro-grade peripherals. From mechanical keyboards to 4K monitors — everything your setup needs.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link to="/shop?category=Keyboards" className="btn btn-primary">Shop Keyboards</Link>
                <Link to="/shop?category=Monitors" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>View Monitors</Link>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { icon: '⌨️', title: 'Mechanical Keyboards', sub: 'From ₦12,000', link: '/shop?category=Keyboards' },
                { icon: '🖥️', title: '4K Monitors', sub: 'From ₦115,000', link: '/shop?category=Monitors' },
                { icon: '🖱️', title: 'Gaming Mice', sub: 'From ₦8,500', link: '/shop?category=Mice' },
                { icon: '🔌', title: 'Fast Chargers', sub: 'From ₦15,000', link: '/shop?category=Chargers' },
              ].map(item => (
                <Link key={item.title} to={item.link} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, padding: isMobile ? 14 : 20, transition: 'background 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,197,94,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  >
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
                    <div style={{ color: 'white', fontWeight: 600, fontSize: 12, marginBottom: 3 }}>{item.title}</div>
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
                  <div className="product-card">
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
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(200px, 1fr))', gap: isMobile ? 12 : 24 }}>
            {[
              { icon: '✅', title: 'Genuine Products', desc: '100% authentic products from verified manufacturers.' },
              { icon: '💰', title: 'Best Prices', desc: 'Price-matched so you always get the best deal.' },
              { icon: '🚀', title: 'Fast Delivery', desc: 'Same-day dispatch. Nationwide in 1–3 days.' },
              { icon: '🛡️', title: 'Warranty', desc: 'Full manufacturer warranty on all products.' },
              { icon: '📱', title: 'Easy Returns', desc: '30-day hassle-free return policy.' },
              { icon: '🌍', title: 'Nationwide', desc: 'Deliver to all 36 states + FCT Abuja.' },
            ].map(item => (
              <div key={item.title} style={{
                background: 'white', border: '1px solid var(--border)',
                borderRadius: 14, padding: isMobile ? 16 : 24,
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              }}>
                <div style={{ fontSize: isMobile ? 24 : 32, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: isMobile ? 13 : 15, marginBottom: 6 }}>{item.title}</div>
                <div style={{ color: 'var(--mid)', fontSize: isMobile ? 12 : 13, lineHeight: 1.5 }}>{item.desc}</div>
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
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: isMobile ? 12 : 24 }}>
            {[
              { name: 'Chukwuemeka A.', loc: 'Lagos', rating: 5, text: 'Got my mechanical keyboard in 2 days. Build quality is amazing and customer service was top notch!' },
              { name: 'Fatima M.', loc: 'Abuja', rating: 5, text: 'The noise-cancelling headphones are incredible. Sound quality rivals brands 3x the price.' },
              { name: 'Taiwo B.', loc: 'Port Harcourt', rating: 5, text: 'Fast delivery, genuine product, and great packaging. Pathnel Tech is now my go-to store.' },
              { name: 'Adaeze O.', loc: 'Enugu', rating: 5, text: 'Ordered the 4K webcam for my YouTube channel. Image quality is stunning!' },
              { name: 'Ibrahim S.', loc: 'Kano', rating: 5, text: 'Best prices I could find anywhere in Nigeria. The gaming mouse is perfect.' },
              { name: 'Ngozi K.', loc: 'Ibadan', rating: 5, text: 'Returned an item and got a replacement within 3 days no stress. Excellent service!' },
            ].map((r, i) => (
              <div key={i} style={{
                background: 'white', borderRadius: 14, padding: isMobile ? 16 : 24,
                border: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
              }}>
                <div style={{ color: '#f59e0b', fontSize: 14, marginBottom: 10 }}>{'★'.repeat(r.rating)}</div>
                <p style={{ color: 'var(--dark)', fontSize: 13, lineHeight: 1.7, marginBottom: 14, fontStyle: 'italic' }}>"{r.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{r.name}</div>
                    <div style={{ color: 'var(--mid)', fontSize: 12 }}>{r.loc}, Nigeria</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d2818 100%)', padding: isMobile ? '56px 0' : '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto', padding: '0 16px' }}>
            <div className="section-tag" style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--green)', display: 'inline-block', marginBottom: 16 }}>📬 Newsletter</div>
            <h2 style={{ color: 'white', fontSize: 'clamp(24px, 3vw, 38px)', marginBottom: 14 }}>Get Exclusive Deals</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 28, lineHeight: 1.7, fontSize: isMobile ? 14 : 16 }}>
              Join 10,000+ tech enthusiasts. Early access to sales, new arrivals, and zero spam.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 10, maxWidth: 440, margin: '0 auto', flexDirection: isMobile ? 'column' : 'row' }}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ flex: 1, padding: '13px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: 14, outline: 'none' }}
              />
              <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>Subscribe →</button>
            </form>
            {subMsg && <p style={{ marginTop: 14, color: 'var(--green)', fontSize: 14 }}>{subMsg}</p>}
          </div>
        </div>
      </section>
    </>
  );
}