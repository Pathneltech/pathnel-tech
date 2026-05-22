import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  async function subscribe(e) {
    e.preventDefault();
    if (!email) return;
    try {
      await api.subscribe(email);
      setMsg('🎉 Thanks for subscribing!');
      setEmail('');
    } catch {
      setMsg('Already subscribed or invalid email.');
    }
    setTimeout(() => setMsg(''), 4000);
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="navbar-logo">Pathnel<span style={{color:'var(--green)'}}>Tech</span></div>
            <p style={{marginTop:12}}>Premium tech accessories for every lifestyle. From workspace to adventure — we've got your gear.</p>
            <div className="social-links" style={{marginTop:20}}>
              <a href="#tw" aria-label="Twitter">𝕏</a>
              <a href="#ig" aria-label="Instagram">📸</a>
              <a href="#fb" aria-label="Facebook">f</a>
              <a href="#yt" aria-label="YouTube">▶</a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/shop">Shop All</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-col">
            <h4>Customer Service</h4>
            <a href="#faq">FAQ</a>
            <a href="#shipping">Shipping Policy</a>
            <a href="#returns">Returns</a>
            <a href="#track">Track Order</a>
          </div>
          <div className="footer-col">
            <h4>Stay Updated</h4>
            <p style={{color:'rgba(255,255,255,0.45)', fontSize:13, marginBottom:14, lineHeight:1.6}}>
              Subscribe for deals, new arrivals, and tech news.
            </p>
            <form onSubmit={subscribe} style={{display:'flex', flexDirection:'column', gap:10}}>
              <input
                className="form-input"
                style={{background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', color:'white'}}
                type="email" placeholder="Your email" value={email}
                onChange={e => setEmail(e.target.value)} />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
            {msg && <p style={{marginTop:8, fontSize:13, color:'var(--green)'}}>{msg}</p>}
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Pathnel Tech. All rights reserved.</p>
          <p style={{fontSize:13, color:'rgba(255,255,255,0.3)'}}>
            <a href="#privacy" style={{color:'rgba(255,255,255,0.35)'}}>Privacy</a> · <a href="#terms" style={{color:'rgba(255,255,255,0.35)'}}>Terms</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
