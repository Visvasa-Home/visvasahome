import React, { useState } from 'react';
import { X, Calendar, MapPin, User, CheckCircle } from 'lucide-react';
import { AdminApi } from '../api/client';

export function CreateBookingModal({ onClose, onCreated }: { onClose: () => void, onCreated: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    service_id: '',
    service_name: '',
    pincode: '',
    address: '',
    scheduled_time: '',
    amount: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        customer_id: 'manual_admin',
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        service_id: formData.service_id || 'manual_service',
        service_name: formData.service_name,
        address: {
          full_address: formData.address,
          pincode: formData.pincode,
          lat: 0.0,
          lng: 0.0
        },
        type: formData.scheduled_time ? 'SCHEDULED' : 'INSTANT',
        scheduled_time: formData.scheduled_time || new Date().toISOString(),
        estimated_amount: parseFloat(formData.amount) || 0
      };
      
      const res = await AdminApi.createBooking(payload);
      if (res.data?.success) {
        onCreated();
      } else {
        alert('Failed to create booking');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating booking');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Create Manual Booking</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5"><User className="w-4 h-4" /> Customer Name</label>
              <input required value={formData.customer_name} onChange={e => setFormData({...formData, customer_name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none" placeholder="e.g. Rahul Sharma" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Customer Phone</label>
              <input required value={formData.customer_phone} onChange={e => setFormData({...formData, customer_phone: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none" placeholder="+91..." />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Service Name</label>
              <input required value={formData.service_name} onChange={e => setFormData({...formData, service_name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none" placeholder="e.g. AC Repair" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Amount (₹)</label>
              <input required type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none" placeholder="500" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Full Address</label>
            <textarea required rows={2} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none resize-none" placeholder="Flat, Building, Street..." />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Pincode</label>
              <input required value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none" placeholder="110001" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Scheduled Time (Optional)</label>
              <input type="datetime-local" value={formData.scheduled_time} onChange={e => setFormData({...formData, scheduled_time: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none" />
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">Cancel</button>
            <button disabled={loading} type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl disabled:opacity-50 transition-colors">
              {loading ? <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <><CheckCircle className="w-4 h-4" /> Create Booking</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
