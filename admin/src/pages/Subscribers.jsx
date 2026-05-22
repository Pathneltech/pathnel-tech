import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useAuth, adminFetch } from '../AuthContext';

export default function Subscribers() {
  const { token } = useAuth();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminFetch('/api/subscribers', token).then(data => {
      setSubscribers(data);
      setLoading(false);
    });
  }, [token]);

  const filtered = subscribers.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Subscribers">
      <div className="card">
        <div className="card-header">
          <h3>📬 Newsletter Subscribers ({subscribers.length})</h3>
          <input
            className="form-control"
            style={{ width: 260, padding: '8px 12px', fontSize: 13 }}
            placeholder="Search by email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner"></div></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📬</div>
            <p>{search ? 'No subscribers match your search.' : 'No subscribers yet.'}</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Email Address</th>
                <th>Subscribed On</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub, i) => (
                <tr key={sub.id}>
                  <td style={{ color: 'var(--mid)', fontSize: 12 }}>{sub.id}</td>
                  <td><strong>{sub.email}</strong></td>
                  <td style={{ color: 'var(--mid)', fontSize: 13 }}>
                    {new Date(sub.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
