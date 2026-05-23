import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const displayPrice = product.sale_price || product.price;

  function addToCart(e) {
    e.stopPropagation();
    dispatch({ type: 'ADD', product, qty: 1 });
  }

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="product-card-img">
        <img src={product.image_url || 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&q=80'} alt={product.name} loading="lazy" />
        <div className="product-card-badges">
          {product.is_sale ? <span className="badge badge-sale">Sale</span> : null}
          {product.is_new ? <span className="badge badge-new">New</span> : null}
        </div>
      </div>
      <div className="product-card-body">
        <div className="product-card-category">{product.category}</div>
        <div className="product-card-name">{product.name}</div>
        <div className="product-card-price">
          <span className="price-current">₦{displayPrice.toLocaleString('en-NG')}</span>
{product.sale_price && <span className="price-original">₦{product.price.toLocaleString('en-NG')}</span>}
        </div>
      </div>
      <div className="product-card-footer">
        <button className="btn btn-primary btn-full btn-sm" onClick={addToCart}>Add to Cart</button>
      </div>
    </div>
  );
}
