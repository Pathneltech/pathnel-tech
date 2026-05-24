import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { apiFetch } from '../api';

export default function Account() {
  const { user, token, logout } = useUser();
  const navigate = useNavigate();
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm_password: '' });

  useEffect(() => {
    if (!user || !token) { navigate('/login'); return; }
    fetchData();
  }, [user, token]);

  async function fetchData() {
    setLoading(true);
    try {
      const [prof, ords] = await Promise.all([
        apiFetch('/api/user/profile', { headers: { Authorization: `Bearer ${token}` } }),
        apiFetch('/api/user/orders', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setProfile(prof);
      setOrders(ords);
    } catch (e) {
      if (e.message === 'Please login') { logout(); navigate('/login'); }
    }
    setLoading(false);
  }

  async function saveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setMessage(''); setError('');
    try {
      await apiFetch('/api/user/profile', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: profile
      });
      setMessage('Profile updated successfully!');
    } catch (err) { setError(err.message); }
    setSaving(false);
  }

  async function changePassword(e) {
    e.preventDefault();
    if (pwForm.new_password !== pwForm.confirm_password) {
      setError('New passwords do not match'); return;
    }
    setSaving(true); setMessage(''); setError('');
    try {
      await apiFetch('/api/user/password', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: { current_password: pwForm.current_password, new_password: pwForm.new_password }
      });
      setMessage('Password changed successfully!');
      setPwForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) { setError(err.message); }
    setSaving(false);
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  const statusColor = {
    Pending: '#f59e0b', Processing: '#3b82f6',
    Shipped: '#8b5cf6', Delivered: '#10b981', Cancelled: '#ef4444'
  };

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><a href="/">Home</a> › <span>My Account</span></div>
          <h1>My Account</h1>
          <p>Welcome back, {user?.first_name}! 👋</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{display:'grid', gridTemplateColumns:'240px 1fr', gap:28, alignItems:'start'}}>

            {/* Sidebar */}
            <div className="card" style={{padding:20}}>
              <div style={{textAlign:'center', marginBottom:20, paddingBottom:20, borderBottom:'1px solid var(--border)'}}>
                <div style={{width:64, height:64, borderRadius:'50%', background:'var(--green)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:700, margin:'0 auto 10px'}}>
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
                <div style={{fontWeight:700}}>{user?.first_name} {user?.last_name}</div>
                <div style={{fontSize:12, color:'var(--mid)', marginTop:4}}>{user?.email}</div>
              </div>

              {[
                { key: 'orders', label: '📦 My Orders' },
                { key: 'profile', label: '👤 Edit Profile' },
                { key: 'address', label: '🏠 My Address' },
                { key: 'password', label: '🔒 Change Password' },
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => { setTab(item.key); setMessage(''); setError(''); }}
                  style={{
                    display:'block', width:'100%', textAlign:'left', padding:'10px 14px',
                    borderRadius:8, border:'none', cursor:'pointer', fontSize:14, fontWeight: tab === item.key ? 600 : 400,
                    background: tab === item.key ? 'var(--green-light)' : 'transparent',
                    color: tab === item.key ? 'var(--green-dark)' : 'var(--dark)',
                    marginBottom:4
                  }}
                >
                  {item.label}
                </button>
              ))}

              <button
                onClick={handleLogout}
                style={{display:'block', width:'100%', textAlign:'left', padding:'10px 14px', borderRadius:8, border:'none', cursor:'pointer', fontSize:14, color:'#ef4444', background:'transparent', marginTop:8}}
              >
                🚪 Sign Out
              </button>
            </div>

            {/* Main Content */}
            <div>
              {message && <div style={{background:'#d1fae5', color:'#065f46', padding:'12px 16px', borderRadius:8, marginBottom:16, fontSize:14}}>{message}</div>}
              {error && <div style={{background:'#fee2e2', color:'#991b1b', padding:'12px 16px', borderRadius:8, marginBottom:16, fontSize:14}}>{error}</div>}

              {/* Orders Tab */}
              {tab === 'orders' && (
                <div className="card" style={{padding:24}}>
                  <h3 style={{marginBottom:20}}>My Orders ({orders.length})</h3>
                  {orders.length === 0 ? (
                    <div style={{textAlign:'center', padding:40}}>
                      <div style={{fontSize:48, marginBottom:12}}>📦</div>
                      <p style={{color:'var(--mid)'}}>No orders yet.</p>
                      <Link to="/shop" className="btn btn-primary" style={{marginTop:16}}>Start Shopping</Link>
                    </div>
                  ) : (
                    <div style={{display:'flex', flexDirection:'column', gap:12}}>
                      {orders.map(order => (
                        <div key={order.id} style={{border:'1px solid var(--border)', borderRadius:12, padding:16}}>
                          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8}}>
                            <div>
                              <div style={{fontWeight:700, fontSize:15}}>Order #{order.id}</div>
                              <div style={{fontSize:12, color:'var(--mid)', marginTop:2}}>
                                {new Date(order.created_at).toLocaleDateString('en-NG', { year:'numeric', month:'long', day:'numeric' })}
                              </div>
                            </div>
                            <div style={{display:'flex', alignItems:'center', gap:12}}>
                              <span style={{background: statusColor[order.status] + '20', color: statusColor[order.status], padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:600}}>
                                {order.status}
                              </span>
                              <div style={{fontWeight:700, fontSize:15}}>₦{order.total_amount.toLocaleString('en-NG')}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Profile Tab */}
              {tab === 'profile' && profile && (
                <div className="card" style={{padding:24}}>
                  <h3 style={{marginBottom:20}}>Edit Profile</h3>
                  <form onSubmit={saveProfile}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">First Name *</label>
                        <input className="form-input" value={profile.first_name || ''} onChange={e => setProfile(p => ({...p, first_name: e.target.value}))} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Last Name *</label>
                        <input className="form-input" value={profile.last_name || ''} onChange={e => setProfile(p => ({...p, last_name: e.target.value}))} required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input className="form-input" value={profile.email || ''} disabled style={{opacity:0.6}} />
                      <small style={{color:'var(--mid)', fontSize:12}}>Email cannot be changed</small>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input className="form-input" value={profile.phone || ''} onChange={e => setProfile(p => ({...p, phone: e.target.value}))} placeholder="08012345678" />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>
              )}

              {/* Address Tab */}
              {tab === 'address' && profile && (
                <div className="card" style={{padding:24}}>
                  <h3 style={{marginBottom:20}}>My Address</h3>
                  <form onSubmit={saveProfile}>
                    <div className="form-group">
                      <label className="form-label">Street Address</label>
                      <input className="form-input" value={profile.address || ''} onChange={e => setProfile(p => ({...p, address: e.target.value}))} placeholder="123 Main Street" />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">City</label>
                        <input className="form-input" value={profile.city || ''} onChange={e => setProfile(p => ({...p, city: e.target.value}))} placeholder="Lagos" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">State</label>
                        <select className="form-input" value={profile.state || ''} onChange={e => setProfile(p => ({...p, state: e.target.value}))}>
                          <option value="">Select State</option>
                          {['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT Abuja','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara'].map(s => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Address'}
                    </button>
                  </form>
                </div>
              )}

              {/* Password Tab */}
              {tab === 'password' && (
                <div className="card" style={{padding:24}}>
                  <h3 style={{marginBottom:20}}>Change Password</h3>
                  <form onSubmit={changePassword} style={{maxWidth:400}}>
                    <div className="form-group">
                      <label className="form-label">Current Password *</label>
                      <input className="form-input" type="password" value={pwForm.current_password} onChange={e => setPwForm(p => ({...p, current_password: e.target.value}))} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">New Password *</label>
                      <input className="form-input" type="password" value={pwForm.new_password} onChange={e => setPwForm(p => ({...p, new_password: e.target.value}))} placeholder="Min 6 characters" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirm New Password *</label>
                      <input className="form-input" type="password" value={pwForm.confirm_password} onChange={e => setPwForm(p => ({...p, confirm_password: e.target.value}))} required />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
