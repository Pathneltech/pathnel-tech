import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../api';

export default function Checkout() {
  const { cart, total, count, dispatch } = useCart();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zip: '', country: 'Nigeria' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  const shipping = total >= 50000 ? 0 : 2500;

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
            Order <strong>#{success.id}</strong> · Total: <strong>₦{(success.total_amount + shipping).toLocaleString('en-NG')}</strong>
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
                  <select className="form-input" name="state" value={form.state} onChange={handleChange} required>
                    <option value="">Select State</option>
                    <option>Abia</option><option>Adamawa</option><option>Akwa Ibom</option>
                    <option>Anambra</option><option>Bauchi</option><option>Bayelsa</option>
                    <option>Benue</option><option>Borno</option><option>Cross River</option>
                    <option>Delta</option><option>Ebonyi</option><option>Edo</option>
                    <option>Ekiti</option><option>Enugu</option><option>FCT Abuja</option>
                    <option>Gombe</option><option>Imo</option><option>Jigawa</option>
                    <option>Kaduna</option><option>Kano</option><option>Katsina</option>
                    <option>Kebbi</option><option>Kogi</option><option>Kwara</option>
                    <option>Lagos</option><option>Nasarawa</option><option>Niger</option>
                    <option>Ogun</option><option>Ondo</option><option>Osun</option>
                    <option>Oyo</option><option>Plateau</option><option>Rivers</option>
                    <option>Sokoto</option><option>Taraba</option><option>Yobe</option>
                    <option>Zamfara</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">ZIP / Postal Code</label>
                  <input className="form-input" name="zip" value={form.zip} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <select className="form-input" name="country" value={form.country} onChange={handleChange}>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Kenya">Kenya</option>
                    <option value="South Africa">South Africa</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
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
                    <div style={{fontWeight:600, fontSize:14}}>₦{(price * item.qty).toLocaleString('en-NG')}</div>
                  </div>
                );
              })}
              <div style={{borderTop:'1px solid var(--border)', paddingTop:16, marginTop:8}}>
                <div className="summary-row"><span>Subtotal</span><span>₦{total.toLocaleString('en-NG')}</span></div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span style={{color: shipping === 0 ? 'var(--green)' : 'inherit'}}>
                    {shipping === 0 ? 'FREE' : `₦${shipping.toLocaleString('en-NG')}`}
                  </span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <span>₦{(total + shipping).toLocaleString('en-NG')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
