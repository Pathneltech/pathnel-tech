import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { apiFetch } from '../api';

export default function Register() {
  const { login } = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', password: '', confirm_password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const data = await apiFetch('/api/user/register', {
        method: 'POST',
        body: {
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
          password: form.password
        }
      });
      login(data.user, data.token);
      navigate('/account');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
    setLoading(false);
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><a href="/">Home</a> › <span>Register</span></div>
          <h1>Create Account</h1>
          <p>Join Pathnel Tech and start shopping</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{maxWidth:520, margin:'0 auto'}}>
            <div className="card" style={{padding:36}}>
              <h2 style={{marginBottom:24, textAlign:'center'}}>Create Your Account</h2>

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name *</label>
                    <input
                      className="form-input"
                      name="first_name"
                      value={form.first_name}
                      onChange={handleChange}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name *</label>
                    <input
                      className="form-input"
                      name="last_name"
                      value={form.last_name}
                      onChange={handleChange}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

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
                  <label className="form-label">Phone Number</label>
                  <input
                    className="form-input"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="08012345678"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Password *</label>
                    <input
                      className="form-input"
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Min 6 characters"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password *</label>
                    <input
                      className="form-input"
                      type="password"
                      name="confirm_password"
                      value={form.confirm_password}
                      onChange={handleChange}
                      placeholder="Repeat password"
                      required
                    />
                  </div>
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
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <p style={{textAlign:'center', marginTop:20, fontSize:14, color:'var(--mid)'}}>
                Already have an account?{' '}
                <Link to="/login" style={{color:'var(--green)', fontWeight:600}}>Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
