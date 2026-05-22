import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useAuth, adminFetch } from '../AuthContext';

export default function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    adminFetch('/api/stats', token).then(setStats);
    adminFetch('/api/orders', token).then(orders => setRecentOrders(orders.slice(0, 5)));
  }, [token]);

  const statusColors = { Pending: '#92400e', Processing: '#1d4ed8', Shipped: '#0369a1', Delivered: '#15803d', Cancelled: '#b91c1c' };

  return (
    <AdminLayout title="Dashboard">
      <div className="stats-grid">
        {[
          { icon: '📦', label: 'Total Products', value: stats?.total_products ?? '—' },
          { icon: '🛒', label: 'Total Orders', value: stats?.total_orders ?? '—' },
          { icon: '⏳', label: 'Pending Orders', value: stats?.pending_orders ?? '—' },
          { icon: '📬', label: 'Subscribers', value: stats?.total_subscribers ?? '—' },
          { icon: '💰', label: 'Total Revenue', value: stats ? `$${stats.total_revenue.toFixed(2)}` : '—', green: true }
        ].map(s => (
          <div key={s.label} className={`stat-card${s.green ? ' green' : ''}`}>
            <div className="icon">{s.icon}</div>
            <div className="value">{s.value}</div>
            <div className="label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h3>🕐 Recent Orders</h3>
          <a href="/orders" style={{fontSize:13, color:'var(--green)'}}>View all →</a>
        </div>
        {recentOrders.length === 0 ? (
          <div className="empty-state"><div className="icon">📋</div><p>No orders yet</p></div>
        ) : (
          <table>
            <thead>
              <tr><th>Order #</th><th>Customer</th><th>Email</th><th>Total</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td><strong>#{order.id}</strong></td>
                  <td>{order.customer_name}</td>
                  <td style={{color:'var(--mid)'}}>{order.customer_email}</td>
                  <td><strong>${order.total_amount.toFixed(2)}</strong></td>
                  <td><span className={`status status-${order.status}`}>{order.status}</span></td>
                  <td style={{color:'var(--mid)', fontSize:12}}>{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
