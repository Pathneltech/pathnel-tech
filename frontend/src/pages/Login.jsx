import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { apiFetch } from '../api';

export default function Login() {
  const { login } = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/api/user/login', {
        method: 'POST',
        body: form
      });
      login(data.user, data.token);
      navigate('/account');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><a href="/">Home</a> › <span>Login</span></div>
          <h1>Welcome Back</h1>
          <p>Sign in to your Pathnel Tech account</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{maxWidth:460, margin:'0 auto'}}>
            <div className="card" style={{padding:36}}>
              <h2 style={{marginBottom:24, textAlign:'center'}}>Sign In</h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    className="form-input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input
                    className="form-input"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {error && (
                  <div style={{background:'#fee2e2', color:'#991b1b', padding:'10px 14px', borderRadius:8, fontSize:13, marginBottom:16}}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary btn-full btn-lg"
                  disabled={loading}
                  style={{marginTop:8}}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <p style={{textAlign:'center', marginTop:20, fontSize:14, color:'var(--mid)'}}>
                Don't have an account?{' '}
                <Link to="/register" style={{color:'var(--green)', fontWeight:600}}>Create one</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
