import { ArrowLeft, User, Phone, Mail, MapPin, Home, Calendar, Clock } from 'lucide-react';
import { useState } from 'react';

interface GetStartedCustomerProps {
  onBack: () => void;
  selectedLocation: string | null;
}

export function GetStartedCustomer({ onBack, selectedLocation }: GetStartedCustomerProps) {
  const [selectedService, setSelectedService] = useState('');

  const serviceCategories = [
    'Home Repair & Maintenance',
    'Cleaning & Hygiene Services',
    'Appliance Repair & Installation',
    'Painting, Renovation & Construction',
    'Outdoor & Utility Services',
    'Care & Support Services',
    'Interior & Design Services',
    'Event & Special Services',
    'Custom Contractor Services'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[#2563EB] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="mb-2">Book Your Service</h2>
          <p className="text-gray-600 mb-8">Tell us what you need, and we'll connect you with the right professional</p>

          <div className="space-y-6">
            {/* Service Selection */}
            <div>
              <label className="block text-sm mb-2">What service do you need? *</label>
              <select 
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
              >
                <option value="">Select a service</option>
                {serviceCategories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Specific Service */}
            <div>
              <label className="block text-sm mb-2">Describe your requirement *</label>
              <textarea 
                placeholder="E.g., Need plumber to fix leaking bathroom tap"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none resize-none"
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2">Your Name *</label>
                <div className="relative">
                  <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2">Phone Number *</label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="tel" 
                    placeholder="+91 1234567890"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" 
                  placeholder="your.email@example.com (optional)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Service Location */}
            <div>
              <label className="block text-sm mb-2">Service Address *</label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <textarea 
                  placeholder="Enter complete address where service is required"
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2">City *</label>
                <input 
                  type="text" 
                  placeholder="Enter city"
                  defaultValue={selectedLocation || ''}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Pincode *</label>
                <input 
                  type="text" 
                  placeholder="Enter pincode"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Scheduling */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2">Preferred Date *</label>
                <div className="relative">
                  <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="date" 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2">Preferred Time *</label>
                <div className="relative">
                  <Clock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none">
                    <option value="">Select time slot</option>
                    <option value="morning">Morning (8 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                    <option value="evening">Evening (4 PM - 8 PM)</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm mb-2">Additional Notes</label>
              <textarea 
                placeholder="Any specific instructions or requirements? (Optional)"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <button className="w-full px-8 py-4 bg-[#2563EB] text-white rounded-lg hover:bg-[#2563EB] transition-colors">
              Submit Request
            </button>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-amber-50 rounded-xl p-6 border border-blue-100">
          <h3 className="mb-4">What Happens Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="mb-1">We Review Your Request</h4>
                <p className="text-sm text-gray-600">Our team matches you with the best local professionals</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="mb-1">Professional Contacts You</h4>
                <p className="text-sm text-gray-600">You'll receive a call within 2 hours to confirm details</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="mb-1">Service Delivered</h4>
                <p className="text-sm text-gray-600">Quality service at your doorstep, on time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}