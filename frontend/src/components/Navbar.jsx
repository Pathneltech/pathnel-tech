import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

export default function Navbar() {
  const { count } = useCart();
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/');
    setOpen(false);
  }

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
            {user ? (
              <div style={{display:'flex', alignItems:'center', gap:8}}>
                <Link
                  to="/account"
                  style={{display:'flex', alignItems:'center', gap:6, color:'white', fontSize:13, fontWeight:600, textDecoration:'none', background:'rgba(255,255,255,0.1)', padding:'6px 12px', borderRadius:20}}
                >
                  <span style={{width:24, height:24, borderRadius:'50%', background:'var(--green)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700}}>
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </span>
                  {user.first_name}
                </Link>
              </div>
            ) : (
              <div style={{display:'flex', gap:8}}>
                <Link to="/login" style={{color:'rgba(255,255,255,0.8)', fontSize:13, fontWeight:500, textDecoration:'none', padding:'6px 12px'}}>
                  Sign In
                </Link>
                <Link to="/register" style={{color:'white', fontSize:13, fontWeight:600, textDecoration:'none', background:'var(--green)', padding:'6px 14px', borderRadius:20}}>
                  Register
                </Link>
              </div>
            )}
            <Link to="/cart" className="cart-btn">
              🛒
              {count > 0 && <span className="cart-badge">{count > 9 ? '9+' : count}</span>}
            </Link>
            <button className="mobile-menu-btn" onClick={() => setOpen(!open)}>☰</button>
          </div>
        </div>
      </div>

      {open && (
        <div style={{background:'var(--dark-2)', padding:'12px 0', borderTop:'1px solid rgba(255,255,255,0.08)'}}>
          <div className="container" style={{display:'flex', flexDirection:'column', gap:'4px'}}>
            {[['/', 'Home'], ['/shop', 'Shop'], ['/about', 'About'], ['/contact', 'Contact']].map(([to, label]) => (
              <NavLink key={to} to={to} end={to==='/'} onClick={() => setOpen(false)}
                style={{color:'rgba(255,255,255,0.75)', padding:'10px 12px', borderRadius:'6px', fontSize:'15px'}}>
                {label}
              </NavLink>
            ))}
            {user ? (
              <>
                <NavLink to="/account" onClick={() => setOpen(false)}
                  style={{color:'rgba(255,255,255,0.75)', padding:'10px 12px', borderRadius:'6px', fontSize:'15px'}}>
                  👤 My Account ({user.first_name})
                </NavLink>
                <button onClick={handleLogout}
                  style={{color:'#f87171', padding:'10px 12px', borderRadius:'6px', fontSize:'15px', background:'none', border:'none', textAlign:'left', cursor:'pointer'}}>
                  🚪 Sign Out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={() => setOpen(false)}
                  style={{color:'rgba(255,255,255,0.75)', padding:'10px 12px', borderRadius:'6px', fontSize:'15px'}}>
                  🔐 Sign In
                </NavLink>
                <NavLink to="/register" onClick={() => setOpen(false)}
                  style={{color:'rgba(255,255,255,0.75)', padding:'10px 12px', borderRadius:'6px', fontSize:'15px'}}>
                  📝 Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
