import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">Pathnel<span>Tech</span></Link>
          <div className="navbar-links">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/shop">Shop</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </div>
          <div className="navbar-right">
            <Link to="/cart" className="cart-btn">
              🛒
              {count > 0 && <span className="cart-badge">{count > 9 ? '9+' : count}</span>}
            </Link>
            <button className="mobile-menu-btn" onClick={() => setOpen(!open)}>☰</button>
          </div>
        </div>
      </div>
      {open && (
        <div style={{ background: 'var(--dark-2)', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[['/', 'Home'], ['/shop', 'Shop'], ['/about', 'About'], ['/contact', 'Contact']].map(([to, label]) => (
              <NavLink key={to} to={to} end={to==='/'} onClick={() => setOpen(false)}
                style={{ color: 'rgba(255,255,255,0.75)', padding: '10px 12px', borderRadius: '6px', fontSize: '15px' }}>
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
