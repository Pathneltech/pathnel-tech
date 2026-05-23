import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import { useCart } from '../context/CartContext';
import Toast from '../components/Toast';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState('');
  const { dispatch } = useCart();

  useEffect(() => {
    setLoading(true);
    api.product(id).then(p => { setProduct(p); setLoading(false); }).catch(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id]);

  function addToCart() {
    dispatch({ type: 'ADD', product, qty });
    setToast(`${product.name} added to cart!`);
    setTimeout(() => setToast(''), 3000);
  }

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;
  if (!product) return <div style={{padding:80, textAlign:'center'}}><h2>Product not found</h2><Link to="/shop" className="btn btn-primary" style={{marginTop:20}}>Back to Shop</Link></div>;

  const displayPrice = product.sale_price || product.price;
  const savings = product.sale_price ? ((product.price - product.sale_price) / product.price * 100).toFixed(0) : null;

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Home</a> › <a href="/shop">Shop</a> › <span>{product.name}</span>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="product-detail-grid">
            <div>
              <div className="product-img-main">
                <img src={product.image_url || 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&q=80'} alt={product.name} />
              </div>
              <div style={{display:'flex', gap:8, marginTop:12, flexWrap:'wrap'}}>
                {product.is_new ? <span className="badge badge-new" style={{padding:'6px 12px', fontSize:12}}>New Arrival</span> : null}
                {product.is_sale ? <span className="badge badge-sale" style={{padding:'6px 12px', fontSize:12}}>On Sale</span> : null}
                {product.stock_quantity <= 5 && <span className="badge" style={{background:'#fef3c7', color:'#92400e', padding:'6px 12px', fontSize:12}}>Only {product.stock_quantity} left</span>}
              </div>
            </div>

            <div className="product-info">
              <div className="product-info-category">{product.category}</div>
              <h1>{product.name}</h1>

              <div className="product-price-row">
                <span className="product-price-main">₦{displayPrice.toLocaleString('en-NG')}</span>
                {product.sale_price && <>
                  <span className="product-price-original">₦{product.price.toLocaleString('en-NG')}</span>
                  <span className="product-save">Save {savings}%</span>
                </>}
              </div>

              <p className="product-description">{product.description}</p>

              <div className="qty-row">
                <span className="qty-label">Qty:</span>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="qty-value">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock_quantity, q + 1))}>+</button>
                </div>
                <span style={{fontSize:13, color:'var(--mid)'}}>{product.stock_quantity} in stock</span>
              </div>

              <button className="btn btn-primary btn-lg btn-full" onClick={addToCart} disabled={product.stock_quantity === 0}>
                {product.stock_quantity === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
              </button>

              <Link to="/cart" className="btn btn-dark btn-lg btn-full" style={{marginTop:10}}>
                View Cart →
              </Link>

              <div className="product-specs">
                <h3>📦 Product Details</h3>
                <p>{product.description}</p>
                <div style={{marginTop:12, display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
                  <div style={{fontSize:13}}><strong>Category:</strong> {product.category}</div>
                  <div style={{fontSize:13}}><strong>Stock:</strong> {product.stock_quantity} units</div>
                  <div style={{fontSize:13}}><strong>SKU:</strong> PT-{String(product.id).padStart(4,'0')}</div>
                  <div style={{fontSize:13}}><strong>Price:</strong> ₦{displayPrice.toLocaleString('en-NG')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Toast message={toast} type="success" onClose={() => setToast('')} />
    </>
  );
}
