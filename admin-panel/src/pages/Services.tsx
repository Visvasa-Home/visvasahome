import React, { useState, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  imageUrl: string;
  sortOrder: number;
}

interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
  badge?: string;
  sortOrder: number;
}

interface Service {
  id: string;
  categoryId: string;
  subCategoryId: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  durationMinutes: number;
  description: string;
  imageUrl?: string;
  groupName?: string;
}

const API_BASE = import.meta.env.VITE_API_URL || 'https://visvasahomebackend.onrender.com';

// ─── API Helpers ─────────────────────────────────────────────────────────────

async function fetchCategories(): Promise<Category[]> {
  const r = await fetch(`${API_BASE}/categories`);
  const data = await r.json();
  return data.categories || [];
}

async function fetchServices(categoryId?: string): Promise<Service[]> {
  const url = categoryId
    ? `${API_BASE}/services?categoryId=${categoryId}`
    : `${API_BASE}/services`;
  const r = await fetch(url);
  const data = await r.json();
  return data.services || [];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Badge({ text, color = '#2563EB' }: { text: string; color?: string }) {
  if (!text) return null;
  return (
    <span style={{
      background: color,
      color: '#fff',
      fontSize: '10px',
      fontWeight: 700,
      padding: '2px 8px',
      borderRadius: '999px',
      letterSpacing: '0.05em',
    }}>
      {text}
    </span>
  );
}

function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '20px 24px',
      border: '1px solid #E5E7EB',
      minWidth: '140px',
    }}>
      <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '6px' }}>{label}</div>
      <div style={{ fontSize: '28px', fontWeight: 800, color }}>{value}</div>
    </div>
  );
}

// ─── Main Services Component ──────────────────────────────────────────────────

export default function Services() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  // Sort
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [cats, svcs] = await Promise.all([fetchCategories(), fetchServices()]);
      setCategories(cats);
      setServices(svcs);
      setFilteredServices(svcs);
    } catch (e) {
      setError('Failed to load services from backend. Make sure the homeservices-service is running on port 3006.');
    } finally {
      setLoading(false);
    }
  }

  // Filter & search
  useEffect(() => {
    let result = [...services];
    if (selectedCategory) result = result.filter(s => s.categoryId === selectedCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.groupName?.toLowerCase().includes(q)
      );
    }
    // Sort
    result.sort((a, b) => {
      let va: any = a[sortBy], vb: any = b[sortBy];
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredServices(result);
  }, [services, selectedCategory, searchQuery, sortBy, sortDir]);

  function openAdd() {
    setEditingService({ categoryId: categories[0]?.id || '', price: 0, rating: 4.5, reviewCount: 0, durationMinutes: 60 });
    setModalMode('add');
    setShowModal(true);
  }

  function openEdit(s: Service) {
    setEditingService({ ...s });
    setModalMode('edit');
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingService(null);
  }

  function handleSave() {
    if (!editingService?.name || !editingService?.categoryId) return;
    if (modalMode === 'add') {
      const newSvc: Service = {
        id: `custom_${Date.now()}`,
        name: editingService.name || '',
        categoryId: editingService.categoryId || '',
        subCategoryId: editingService.subCategoryId || '',
        price: editingService.price || 0,
        rating: editingService.rating || 4.5,
        reviewCount: editingService.reviewCount || 0,
        durationMinutes: editingService.durationMinutes || 60,
        description: editingService.description || '',
        imageUrl: editingService.imageUrl,
        groupName: editingService.groupName,
      };
      setServices(prev => [newSvc, ...prev]);
    } else {
      setServices(prev => prev.map(s => s.id === editingService?.id ? { ...s, ...editingService } as Service : s));
    }
    closeModal();
  }

  function handleDelete(id: string) {
    if (confirm('Are you sure you want to remove this service from the local list?')) {
      setServices(prev => prev.filter(s => s.id !== id));
    }
  }

  function toggleSort(field: typeof sortBy) {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('asc'); }
  }

  const stats = {
    total: services.length,
    categories: categories.length,
    avgPrice: services.length ? Math.round(services.reduce((s, v) => s + v.price, 0) / services.length) : 0,
    avgRating: services.length ? (services.reduce((s, v) => s + v.rating, 0) / services.length).toFixed(1) : '0',
  };

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || id;

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'Inter, -apple-system, sans-serif', background: '#F9FAFB', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#111827', margin: 0 }}>Service Catalog</h1>
          <p style={{ color: '#6B7280', marginTop: '4px', fontSize: '14px' }}>
            Manage all services, pricing, and categories across VisvasaHome
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{ background: '#2563EB', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          ＋ Add Service
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <StatCard label="Total Services" value={stats.total} color="#2563EB" />
        <StatCard label="Categories" value={stats.categories} color="#7C3AED" />
        <StatCard label="Avg. Price (₹)" value={`₹${stats.avgPrice}`} color="#059669" />
        <StatCard label="Avg. Rating" value={`${stats.avgRating}⭐`} color="#D97706" />
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '10px', padding: '14px 18px', color: '#991B1B', marginBottom: '20px', fontSize: '14px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Filters */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="🔍 Search services..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ border: '1px solid #D1D5DB', borderRadius: '8px', padding: '8px 14px', fontSize: '14px', minWidth: '220px', outline: 'none' }}
        />
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          style={{ border: '1px solid #D1D5DB', borderRadius: '8px', padding: '8px 14px', fontSize: '14px', cursor: 'pointer', outline: 'none' }}
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <span style={{ color: '#6B7280', fontSize: '13px', marginLeft: 'auto' }}>
          Showing <strong>{filteredServices.length}</strong> of <strong>{services.length}</strong> services
        </span>
        <button
          onClick={loadData}
          style={{ background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', cursor: 'pointer', fontWeight: 600, color: '#374151' }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>Loading services...</div>
        ) : filteredServices.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#9CA3AF' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔧</div>
            No services found. {selectedCategory || searchQuery ? 'Try clearing filters.' : 'Add your first service.'}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Image</th>
                <th
                  style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}
                  onClick={() => toggleSort('name')}
                >
                  Service Name {sortBy === 'name' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
                <th
                  style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}
                  onClick={() => toggleSort('price')}
                >
                  Price {sortBy === 'price' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th
                  style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}
                  onClick={() => toggleSort('rating')}
                >
                  Rating {sortBy === 'rating' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duration</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((s, i) => (
                <tr
                  key={s.id}
                  style={{ borderBottom: '1px solid #F3F4F6', background: i % 2 === 0 ? '#fff' : '#FAFAFA', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#EFF6FF')}
                  onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#FAFAFA')}
                >
                  <td style={{ padding: '12px 16px' }}>
                    {s.imageUrl ? (
                      <img src={s.imageUrl} alt="" style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E5E7EB' }} />
                    ) : (
                      <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🔧</div>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#111827', fontSize: '14px', marginBottom: '2px' }}>{s.name}</div>
                    {s.groupName && <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{s.groupName}</div>}
                    <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.description}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: '#EFF6FF', color: '#1D4ED8', fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '999px' }}>
                      {getCategoryName(s.categoryId)}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#059669', fontSize: '15px' }}>
                    ₹{s.price.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{ color: '#D97706', fontWeight: 600, fontSize: '13px' }}>⭐ {s.rating}</span>
                    <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{s.reviewCount.toLocaleString()}</div>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>
                    {s.durationMinutes === 0 ? 'Custom' : `${s.durationMinutes} min`}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => openEdit(s)}
                      style={{ background: '#EFF6FF', color: '#2563EB', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', marginRight: '6px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      style={{ background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && editingService && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '540px', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginTop: 0, marginBottom: '24px', color: '#111827' }}>
              {modalMode === 'add' ? '＋ Add New Service' : '✏️ Edit Service'}
            </h2>

            <div style={{ display: 'grid', gap: '16px' }}>
              {[
                { label: 'Service Name *', field: 'name', type: 'text' },
                { label: 'Group Name', field: 'groupName', type: 'text' },
                { label: 'Price (₹) *', field: 'price', type: 'number' },
                { label: 'Duration (minutes)', field: 'durationMinutes', type: 'number' },
                { label: 'Rating (1-5)', field: 'rating', type: 'number' },
                { label: 'Review Count', field: 'reviewCount', type: 'number' },
                { label: 'Image URL', field: 'imageUrl', type: 'text' },
              ].map(({ label, field, type }) => (
                <div key={field}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>{label}</label>
                  <input
                    type={type}
                    value={(editingService as any)[field] || ''}
                    onChange={e => setEditingService(prev => ({ ...prev, [field]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Category *</label>
                <select
                  value={editingService.categoryId || ''}
                  onChange={e => setEditingService(prev => ({ ...prev, categoryId: e.target.value }))}
                  style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '14px', outline: 'none' }}
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Description</label>
                <textarea
                  value={editingService.description || ''}
                  onChange={e => setEditingService(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button
                onClick={closeModal}
                style={{ background: '#F3F4F6', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#374151' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{ background: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
              >
                {modalMode === 'add' ? 'Add Service' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
