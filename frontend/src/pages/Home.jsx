import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [email, setEmail] = useState('');
  const [subMsg, setSubMsg] = useState('');

  useEffect(() => {
    api.products('?featured=1').then(setFeatured).catch(console.error);
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

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-eyebrow">✦ New Season Arrivals</div>
            <h1>Top Tech Gear for<br /><span>Your Lifestyle</span></h1>
            <p>Discover premium accessories, peripherals, and gadgets built for performance and designed to impress.</p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-primary btn-lg">Shop Now →</Link>
              <Link to="/about" className="btn btn-outline btn-lg" style={{color:'rgba(255,255,255,0.8)', borderColor:'rgba(255,255,255,0.2)'}}>Our Story</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="trust-bar">
        <div className="trust-bar-inner">
          <div className="trust-item"><span className="icon">🚚</span> Free Shipping on Orders Over $50</div>
          <div className="trust-item"><span className="icon">↩️</span> 30-Day Money Back Guarantee</div>
          <div className="trust-item"><span className="icon">💬</span> 24/7 Customer Support</div>
        </div>
      </div>

      {/* Featured Products */}
      <section className="section" style={{background:'var(--light)'}}>
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
              {featured.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
          <div style={{textAlign:'center', marginTop:36}}>
            <Link to="/shop" className="btn btn-dark btn-lg">View All Products</Link>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="section-sm">
        <div className="container">
          <div className="promo-banner">
            <h2>Boost Your Productivity 🚀</h2>
            <p>Upgrade your workspace with pro-grade peripherals that deliver real performance gains. From keyboards to monitors — we have it all.</p>
            <Link to="/shop?category=Keyboards" className="btn btn-primary btn-lg">Browse Now</Link>
          </div>
        </div>
      </section>

      {/* Category Highlights */}
      <section className="section">
        <div className="container">
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, marginBottom:48}}>
            {/* New Arrivals */}
            <div>
              <div className="section-tag">✦ Just Landed</div>
              <h2 style={{fontSize:'clamp(24px, 2.5vw, 32px)', marginBottom:8}}>New Arrivals</h2>
              <p style={{color:'var(--mid)', marginBottom:24}}>The latest drops, fresh in stock.</p>
              <div className="category-card" onClick={() => window.location.href='/shop?filter=new'} style={{cursor:'pointer'}}>
                <img src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80" alt="New Arrivals" />
                <div className="category-card-overlay">
                  <h3>Latest Tech</h3>
                  <Link to="/shop?filter=new" className="btn btn-primary btn-sm">Shop New Arrivals →</Link>
                </div>
              </div>
            </div>
            {/* Best Sellers */}
            <div>
              <div className="section-tag">🔥 Most Popular</div>
              <h2 style={{fontSize:'clamp(24px, 2.5vw, 32px)', marginBottom:8}}>Best Sellers</h2>
              <p style={{color:'var(--mid)', marginBottom:24}}>What everyone's buying right now.</p>
              <div className="category-card" onClick={() => window.location.href='/shop?filter=sale'} style={{cursor:'pointer'}}>
                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80" alt="Best Sellers" />
                <div className="category-card-overlay">
                  <h3>Top Picks</h3>
                  <Link to="/shop" className="btn btn-primary btn-sm">Shop Best Sellers →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-inner">
            <div className="section-tag" style={{background:'rgba(34,197,94,0.15)', color:'var(--green)'}}>📬 Stay in the Loop</div>
            <h2 style={{marginTop:12}}>Get Deals Delivered</h2>
            <p>Join 10,000+ tech enthusiasts. Exclusive deals, early access, and zero spam.</p>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input type="email" placeholder="Enter your email address" value={email} onChange={e => setEmail(e.target.value)} required />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
            {subMsg && <p style={{marginTop:12, color:'var(--green)', fontSize:14}}>{subMsg}</p>}
          </div>
        </div>
      </section>
    </>
  );
}
