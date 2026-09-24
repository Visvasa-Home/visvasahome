import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_URL}/services`);
      setServices(response.data.services || []);
    } catch (error) {
      console.error('Failed to fetch services', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) return <div className="loading">Loading services...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Services Catalog</h2>
        <p>View all {services.length} active services on the platform</p>
      </div>

      <div className="services-grid">
        {services.map((s) => (
          <div key={s.id} className="glass-card service-card">
            <img src={s.imageUrl} alt={s.name} className="service-image" />
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{s.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                {s.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="service-price">₹{s.price}</span>
                <span className="badge badge-success">★ {s.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
