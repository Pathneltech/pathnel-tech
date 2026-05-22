import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('');

  useEffect(() => { api.categories().then(setCategories); }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (minPrice) params.set('min_price', minPrice);
    if (maxPrice) params.set('max_price', maxPrice);
    if (sort) params.set('sort', sort);

    api.products('?' + params).then(data => {
      setProducts(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [selectedCategory, minPrice, maxPrice, sort]);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><a href="/">Home</a> › <span>Shop</span></div>
          <h1>Shop All Products</h1>
          <p>Find the perfect tech gear for your setup</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="shop-layout">
            {/* Filters */}
            <aside className="filters-panel">
              <h3>🔧 Filters</h3>

              <div className="filter-group">
                <h4>Category</h4>
                <label className="filter-option">
                  <input type="radio" name="cat" checked={selectedCategory === ''} onChange={() => setSelectedCategory('')} />
                  All Categories
                </label>
                {categories.map(cat => (
                  <label key={cat} className="filter-option">
                    <input type="radio" name="cat" checked={selectedCategory === cat} onChange={() => setSelectedCategory(cat)} />
                    {cat}
                  </label>
                ))}
              </div>

              <div className="filter-group">
                <h4>Price Range</h4>
                <div className="price-inputs">
                  <input className="price-input" type="number" placeholder="Min $" value={minPrice} onChange={e => setMinPrice(e.target.value)} min="0" />
                  <input className="price-input" type="number" placeholder="Max $" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} min="0" />
                </div>
              </div>

              <button className="btn btn-outline btn-full btn-sm" onClick={() => { setSelectedCategory(''); setMinPrice(''); setMaxPrice(''); setSort(''); }}>
                Clear Filters
              </button>
            </aside>

            {/* Products */}
            <div>
              <div className="sort-bar">
                <span>{loading ? 'Loading...' : `${products.length} products`}</span>
                <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
                  <option value="">Sort: Default</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A–Z</option>
                  <option value="name_desc">Name: Z–A</option>
                </select>
              </div>

              {loading ? (
                <div className="loading-center"><div className="spinner"></div></div>
              ) : products.length === 0 ? (
                <div style={{textAlign:'center', padding:'80px 0'}}>
                  <div style={{fontSize:48, marginBottom:16}}>🔍</div>
                  <h3>No products found</h3>
                  <p style={{color:'var(--mid)'}}>Try adjusting your filters</p>
                </div>
              ) : (
                <div className="products-grid">
                  {products.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
