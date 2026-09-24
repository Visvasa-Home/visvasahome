import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Ban } from 'lucide-react';

const API_URL = 'http://localhost:8000';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_URL}/bookings`);
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.patch(`${API_URL}/bookings/${id}/cancel`);
        fetchBookings();
      } catch (error) {
        console.error('Failed to cancel booking', error);
        alert('Failed to cancel booking');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'CONFIRMED': return <span className="badge badge-success">Confirmed</span>;
      case 'CANCELLED': return <span className="badge badge-danger">Cancelled</span>;
      default: return <span className="badge badge-warning">{status}</span>;
    }
  };

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Bookings</h2>
        <p>Manage all customer bookings</p>
      </div>
      
      <div className="glass-card">
        {bookings.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No bookings found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Service</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.serviceName}</td>
                  <td>{b.categoryName}</td>
                  <td>₹{b.price}</td>
                  <td>{getStatusBadge(b.status)}</td>
                  <td>
                    {b.status !== 'CANCELLED' && (
                      <button className="btn btn-danger" onClick={() => handleCancel(b.id)} title="Cancel Booking">
                        <Ban size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
