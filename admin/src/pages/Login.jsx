import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch {
      setError('Invalid username or password.');
    }
    setLoading(false);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo">Pathnel<span>Tech</span></div>
        <div className="sub">Admin Panel · Sign In</div>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} placeholder="admin" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%', padding:'12px', marginTop:8, fontSize:15, justifyContent:'center'}} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>
        <p style={{marginTop:20, textAlign:'center', fontSize:12, color:'var(--mid)'}}>
          Default: admin / pathnel123
        </p>
      </div>
    </div>
  );
}
