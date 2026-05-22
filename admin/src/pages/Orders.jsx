import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useAuth, adminFetch } from '../AuthContext';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  async function load() {
    setLoading(true);
    const data = await adminFetch('/api/orders', token);
    setOrders(data); setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function viewOrder(id) {
    const detail = await adminFetch(`/api/orders/${id}`, token);
    setOrderDetail(detail); setSelected(id);
  }

  async function updateStatus(id, status) {
    await adminFetch(`/api/orders/${id}/status`, token, { method: 'PATCH', body: { status } });
    await load();
    if (selected === id) viewOrder(id);
  }

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.customer_name.toLowerCase().includes(search.toLowerCase()) || o.customer_email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = !filter || o.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <AdminLayout title="Orders">
      <div className="card">
        <div className="card-header">
          <h3>🛒 All Orders ({orders.length})</h3>
          <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
            <input className="search-input" placeholder="Search customer..." value={search} onChange={e => setSearch(e.target.value)} />
            <select className="form-control" style={{width:'auto', padding:'8px 12px'}} value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="">All Statuses</option>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        {loading ? <div className="spinner"></div> : filtered.length === 0 ? (
          <div className="empty-state"><div className="icon">📋</div><p>No orders found</p></div>
        ) : (
          <table>
            <thead>
              <tr><th>Order #</th><th>Customer</th><th>Email</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id}>
                  <td><strong>#{order.id}</strong></td>
                  <td>{order.customer_name}</td>
                  <td style={{color:'var(--mid)', fontSize:13}}>{order.customer_email}</td>
                  <td><strong>${order.total_amount.toFixed(2)}</strong></td>
                  <td>
                    <select
                      className={`status status-${order.status}`}
                      style={{border:'none', background:'inherit', cursor:'pointer', fontWeight:700, fontSize:11}}
                      value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value)}>
                      {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{color:'var(--mid)', fontSize:12}}>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td><button className="btn btn-secondary btn-sm" onClick={() => viewOrder(order.id)}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Detail Modal */}
      {orderDetail && (
        <div className="modal-overlay" onClick={() => { setOrderDetail(null); setSelected(null); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order #{orderDetail.id}</h3>
              <button className="close-btn" onClick={() => { setOrderDetail(null); setSelected(null); }}>×</button>
            </div>
            <div className="modal-body">
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20}}>
                <div>
                  <div className="form-label">Customer</div>
                  <strong>{orderDetail.customer_name}</strong>
                </div>
                <div>
                  <div className="form-label">Email</div>
                  <span>{orderDetail.customer_email}</span>
                </div>
                <div style={{gridColumn:'1/-1'}}>
                  <div className="form-label">Shipping Address</div>
                  <span>{orderDetail.shipping_address}</span>
                </div>
                <div>
                  <div className="form-label">Order Date</div>
                  <span>{new Date(orderDetail.created_at).toLocaleString()}</span>
                </div>
                <div>
                  <div className="form-label">Status</div>
                  <select
                    className={`status status-${orderDetail.status}`}
                    style={{border:'none', background:'inherit', cursor:'pointer', fontWeight:700}}
                    value={orderDetail.status}
                    onChange={e => updateStatus(orderDetail.id, e.target.value)}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-label" style={{marginBottom:10}}>Items Ordered</div>
              {orderDetail.items?.map(item => (
                <div key={item.id} style={{display:'flex', gap:12, alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--border)'}}>
                  <img src={item.image_url} alt={item.name} style={{width:44, height:44, borderRadius:8, objectFit:'cover', background:'var(--light)'}} />
                  <div style={{flex:1}}>
                    <div style={{fontSize:13, fontWeight:600}}>{item.name}</div>
                    <div style={{fontSize:12, color:'var(--mid)'}}>Qty: {item.quantity} × ${item.price_at_time.toFixed(2)}</div>
                  </div>
                  <strong>${(item.quantity * item.price_at_time).toFixed(2)}</strong>
                </div>
              ))}

              <div style={{display:'flex', justifyContent:'space-between', marginTop:16, fontWeight:700, fontSize:16}}>
                <span>Total</span>
                <span>${orderDetail.total_amount.toFixed(2)}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => { setOrderDetail(null); setSelected(null); }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
