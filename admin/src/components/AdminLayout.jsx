import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const navItems = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/products', icon: '📦', label: 'Products' },
  { to: '/orders', icon: '🛒', label: 'Orders' },
  { to: '/subscribers', icon: '📬', label: 'Subscribers' }
];

export default function AdminLayout({ title, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() { logout(); navigate('/login'); }

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="brand">Pathnel<span>Tech</span></div>
          <div className="tag">Admin Panel</div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-label">Main</div>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              <span className="icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn btn-ghost" style={{width:'100%', justifyContent:'flex-start', color:'rgba(255,255,255,0.4)'}}>
            🚪 Sign Out
          </button>
        </div>
      </aside>
      <div className="main">
        <div className="topbar">
          <div className="topbar-title">{title}</div>
          <div className="topbar-right">
            <span className="admin-badge">Admin</span>
            <span style={{fontSize:14, color:'var(--mid)'}}>{user}</span>
            <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
          </div>
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
