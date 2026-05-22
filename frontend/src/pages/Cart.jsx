import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, dispatch, total, count } = useCart();

  if (count === 0) return (
    <div className="empty-cart section">
      <div className="container">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="btn btn-primary btn-lg">Start Shopping</Link>
      </div>
    </div>
  );

  const shipping = total >= 50 ? 0 : 7.99;

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><a href="/">Home</a> › <span>Cart</span></div>
          <h1>Shopping Cart</h1>
          <p>{count} item{count !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="cart-layout">
            <div>
              <div className="cart-items">
                {cart.map(item => {
                  const price = item.sale_price || item.price;
                  return (
                    <div key={item.id} className="cart-item">
                      <img className="cart-item-img" src={item.image_url || 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=200&q=80'} alt={item.name} />
                      <div>
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-price">${price.toFixed(2)} each</div>
                        <div className="cart-item-controls" style={{marginTop:10}}>
                          <div className="qty-control">
                            <button className="qty-btn" onClick={() => dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.qty - 1 })}>−</button>
                            <span className="qty-value">{item.qty}</span>
                            <button className="qty-btn" onClick={() => dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.qty + 1 })}>+</button>
                          </div>
                          <button className="cart-remove" onClick={() => dispatch({ type: 'REMOVE', id: item.id })}>🗑 Remove</button>
                        </div>
                      </div>
                      <div style={{fontWeight:700, fontSize:17, whiteSpace:'nowrap'}}>
                        ${(price * item.qty).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              {cart.map(item => {
                const price = item.sale_price || item.price;
                return (
                  <div key={item.id} className="summary-row">
                    <span>{item.name} × {item.qty}</span>
                    <span>${(price * item.qty).toFixed(2)}</span>
                  </div>
                );
              })}
              <div className="summary-row">
                <span>Shipping</span>
                <span style={{color: shipping === 0 ? 'var(--green)' : 'inherit'}}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping > 0 && <p style={{fontSize:12, color:'var(--mid)', marginBottom:8}}>Add ${(50 - total).toFixed(2)} for free shipping</p>}
              <div className="summary-total">
                <span>Total</span>
                <span>${(total + shipping).toFixed(2)}</span>
              </div>
              <Link to="/checkout" className="btn btn-primary btn-full btn-lg" style={{marginTop:20}}>
                Proceed to Checkout →
              </Link>
              <Link to="/shop" className="btn btn-outline btn-full" style={{marginTop:10}}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
