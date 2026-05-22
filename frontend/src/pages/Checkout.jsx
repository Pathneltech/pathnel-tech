import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../api';

export default function Checkout() {
  const { cart, total, count, dispatch } = useCart();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zip: '', country: 'US' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  const shipping = total >= 50 ? 0 : 7.99;

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function placeOrder(e) {
    e.preventDefault();
    if (count === 0) return;
    setLoading(true);
    setError('');
    try {
      const orderData = {
        customer_name: `${form.firstName} ${form.lastName}`,
        customer_email: form.email,
        shipping_address: `${form.address}, ${form.city}, ${form.state} ${form.zip}, ${form.country}`,
        items: cart.map(i => ({ product_id: i.id, quantity: i.qty }))
      };
      const result = await api.createOrder(orderData);
      setSuccess(result);
      dispatch({ type: 'CLEAR' });
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    }
    setLoading(false);
  }

  if (success) return (
    <section className="section">
      <div className="container">
        <div className="order-success">
          <div className="success-icon">🎉</div>
          <h1>Order Placed!</h1>
          <p style={{color:'var(--mid)', marginTop:12, marginBottom:8}}>
            Thank you for shopping with Pathnel Tech.
          </p>
          <p style={{marginBottom:32, color:'var(--mid)'}}>
            Order <strong>#{success.id}</strong> · Total: <strong>${(success.total_amount + shipping).toFixed(2)}</strong>
          </p>
          <p style={{padding:20, background:'var(--green-light)', borderRadius:12, marginBottom:28, color:'var(--green-dark)', fontSize:14}}>
            Your order is <strong>Pending</strong> and will be processed shortly. You'll receive updates at {form.email}.
          </p>
          <Link to="/" className="btn btn-primary btn-lg">Back to Home</Link>
        </div>
      </div>
    </section>
  );

  if (count === 0) return (
    <section className="section">
      <div className="container" style={{textAlign:'center'}}>
        <h2>Your cart is empty</h2>
        <Link to="/shop" className="btn btn-primary" style={{marginTop:20}}>Shop Now</Link>
      </div>
    </section>
  );

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><a href="/">Home</a> › <a href="/cart">Cart</a> › <span>Checkout</span></div>
          <h1>Checkout</h1>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="checkout-layout">
            <form className="checkout-form" onSubmit={placeOrder}>
              <h2>Shipping Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input className="form-input" name="firstName" value={form.firstName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input className="form-input" name="lastName" value={form.lastName} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" type="tel" name="phone" value={form.phone} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Street Address *</label>
                <input className="form-input" name="address" value={form.address} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input className="form-input" name="city" value={form.city} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">State *</label>
                  <input className="form-input" name="state" value={form.state} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">ZIP Code *</label>
                  <input className="form-input" name="zip" value={form.zip} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <select className="form-input" name="country" value={form.country} onChange={handleChange}>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
              </div>
              {error && <p style={{color:'var(--red)', fontSize:14, marginBottom:12}}>{error}</p>}
              <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
                {loading ? 'Placing Order...' : '✓ Place Order (No Payment Required)'}
              </button>
              <p style={{fontSize:12, color:'var(--mid)', textAlign:'center', marginTop:12}}>
                This is a demo store. No real payment is processed.
              </p>
            </form>

            <div className="cart-summary" style={{position:'sticky', top:88}}>
              <h3>Order Summary</h3>
              {cart.map(item => {
                const price = item.sale_price || item.price;
                return (
                  <div key={item.id} style={{display:'flex', gap:12, marginBottom:16, alignItems:'center'}}>
                    <img src={item.image_url} alt={item.name} style={{width:52, height:52, borderRadius:8, objectFit:'cover', background:'var(--light)', flexShrink:0}} />
                    <div style={{flex:1}}>
                      <div style={{fontSize:13, fontWeight:600, lineHeight:1.3}}>{item.name}</div>
                      <div style={{fontSize:12, color:'var(--mid)'}}>Qty: {item.qty}</div>
                    </div>
                    <div style={{fontWeight:600, fontSize:14}}>${(price * item.qty).toFixed(2)}</div>
                  </div>
                );
              })}
              <div style={{borderTop:'1px solid var(--border)', paddingTop:16, marginTop:8}}>
                <div className="summary-row"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span style={{color: shipping === 0 ? 'var(--green)' : 'inherit'}}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <span>${(total + shipping).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
