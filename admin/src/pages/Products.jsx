import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useAuth, adminFetch } from '../AuthContext';

const EMPTY = { name:'', description:'', price:'', sale_price:'', category:'', image_url:'', stock_quantity:0, is_featured:false, is_new:false, is_sale:false };

export default function Products() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  async function load() {
    setLoading(true);
    const data = await adminFetch('/api/products', token);
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() { setForm(EMPTY); setModal('add'); }
  function openEdit(p) {
    setForm({ ...p, is_featured: !!p.is_featured, is_new: !!p.is_new, is_sale: !!p.is_sale, sale_price: p.sale_price || '' });
    setModal('edit');
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  async function save() {
    setSaving(true);
    const body = { ...form, price: parseFloat(form.price), sale_price: form.sale_price ? parseFloat(form.sale_price) : null, stock_quantity: parseInt(form.stock_quantity) };
    try {
      if (modal === 'add') await adminFetch('/api/products', token, { method: 'POST', body });
      else await adminFetch(`/api/products/${form.id}`, token, { method: 'PUT', body });
      await load(); setModal(null);
    } catch (e) { alert(e.message); }
    setSaving(false);
  }

  async function deleteProduct(id) {
    await adminFetch(`/api/products/${id}`, token, { method: 'DELETE' });
    setDeleteConfirm(null); await load();
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout title="Products">
      <div className="card">
        <div className="card-header">
          <h3>📦 All Products ({products.length})</h3>
          <div style={{display:'flex', gap:10}}>
            <input className="search-input" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
            <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
          </div>
        </div>
        {loading ? <div className="spinner"></div> : (
          <table>
            <thead>
              <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Tags</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td><img className="product-img-sm" src={p.image_url || 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=100&q=60'} alt={p.name} /></td>
                  <td><strong style={{fontSize:13}}>{p.name}</strong></td>
                  <td><span style={{fontSize:12, color:'var(--mid)'}}>{p.category}</span></td>
                  <td>
                    <strong>${(p.sale_price || p.price).toFixed(2)}</strong>
                    {p.sale_price && <span style={{fontSize:11, color:'var(--mid)', textDecoration:'line-through', marginLeft:6}}>${p.price.toFixed(2)}</span>}
                  </td>
                  <td><span style={{color: p.stock_quantity < 5 ? 'var(--red)' : 'inherit'}}>{p.stock_quantity}</span></td>
                  <td style={{display:'flex', gap:4, flexWrap:'wrap'}}>
                    {p.is_new ? <span className="status" style={{background:'#dcfce7', color:'#15803d', fontSize:10}}>New</span> : null}
                    {p.is_sale ? <span className="status" style={{background:'#fee2e2', color:'var(--red)', fontSize:10}}>Sale</span> : null}
                    {p.is_featured ? <span className="status" style={{background:'#fef3c7', color:'#92400e', fontSize:10}}>Featured</span> : null}
                  </td>
                  <td>
                    <div style={{display:'flex', gap:6}}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>✏️ Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(p)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal === 'add' ? '+ Add New Product' : '✏️ Edit Product'}</h3>
              <button className="close-btn" onClick={() => setModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group" style={{gridColumn:'1/-1'}}>
                  <label className="form-label">Product Name *</label>
                  <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group" style={{gridColumn:'1/-1'}}>
                  <label className="form-label">Description</label>
                  <textarea className="form-control" name="description" value={form.description} onChange={handleChange} rows={3} />
                </div>
                <div className="form-group">
                  <label className="form-label">Price ($) *</label>
                  <input className="form-control" name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Sale Price ($)</label>
                  <input className="form-control" name="sale_price" type="number" step="0.01" value={form.sale_price} onChange={handleChange} placeholder="Leave blank for no sale" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-control" name="category" value={form.category} onChange={handleChange} required>
                    <option value="">Select category...</option>
                    {['Audio','Chargers','Keyboards','Monitors','Mice','Cameras','Accessories'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input className="form-control" name="stock_quantity" type="number" value={form.stock_quantity} onChange={handleChange} min="0" />
                </div>
                <div className="form-group" style={{gridColumn:'1/-1'}}>
                  <label className="form-label">Image URL</label>
                  <input className="form-control" name="image_url" value={form.image_url} onChange={handleChange} placeholder="https://..." />
                </div>
                {form.image_url && (
                  <div style={{gridColumn:'1/-1'}}>
                    <img src={form.image_url} alt="preview" style={{width:100, height:100, objectFit:'cover', borderRadius:8, border:'1px solid var(--border)'}} />
                  </div>
                )}
                <div className="form-group" style={{gridColumn:'1/-1'}}>
                  <label className="form-label">Flags</label>
                  <div className="checkbox-row">
                    {[['is_featured','⭐ Featured'], ['is_new','🆕 New Arrival'], ['is_sale','🔥 On Sale']].map(([n, l]) => (
                      <label key={n} className="checkbox-item">
                        <input type="checkbox" name={n} checked={form[n]} onChange={handleChange} />
                        {l}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={save} disabled={saving}>
                {saving ? 'Saving...' : modal === 'add' ? 'Create Product' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" style={{maxWidth:400}} onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>⚠️ Delete Product</h3><button className="close-btn" onClick={() => setDeleteConfirm(null)}>×</button></div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => deleteProduct(deleteConfirm.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
