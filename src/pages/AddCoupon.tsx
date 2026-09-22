import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

export const AddCoupon: React.FC = () => {
  const navigate = useNavigate();
  const [couponcode, setCouponcode] = useState('');
  const [type, setType] = useState('percentage');
  const [value, setValue] = useState('');
  const [minorder, setMinorder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!couponcode || !value || !minorder || !expiry) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        couponcode,
        type,
        value: Number(value),
        minorder: Number(minorder),
        expiry
      };

      await authService.createCoupon(payload);
      navigate('/admin/coupons');
    } catch (error) {
      console.error("Failed to add coupon", error);
      alert("Failed to add coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/admin/coupons')}
          className="p-2 text-dark-brown-500 hover:text-dark-brown-900 bg-white border border-dark-brown-200 rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-heading font-bold text-dark-brown-900">Create New Coupon</h1>
      </div>

      <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-[0_4px_20px_rgba(58,43,37,0.04)] p-6 md:p-8">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-dark-brown-700">Coupon Code</label>
              <input 
                type="text" 
                placeholder="e.g. DIWALI26"
                value={couponcode}
                onChange={(e) => setCouponcode(e.target.value)}
                className="w-full border border-dark-brown-200 rounded-md px-4 py-2 text-dark-brown-900 placeholder-dark-brown-400 focus:outline-none focus:ring-1 focus:ring-temple-gold-500 focus:border-temple-gold-500 uppercase"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-dark-brown-700">Discount Type</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-dark-brown-200 rounded-md px-4 py-2 text-dark-brown-900 bg-white focus:outline-none focus:ring-1 focus:ring-temple-gold-500 focus:border-temple-gold-500"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Fixed Amount (₹)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-dark-brown-700">Discount Value</label>
              <input 
                type="number" 
                placeholder="e.g. 20"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full border border-dark-brown-200 rounded-md px-4 py-2 text-dark-brown-900 placeholder-dark-brown-400 focus:outline-none focus:ring-1 focus:ring-temple-gold-500 focus:border-temple-gold-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-dark-brown-700">Minimum Order Value (₹)</label>
              <input 
                type="number" 
                placeholder="e.g. 2000"
                value={minorder}
                onChange={(e) => setMinorder(e.target.value)}
                className="w-full border border-dark-brown-200 rounded-md px-4 py-2 text-dark-brown-900 placeholder-dark-brown-400 focus:outline-none focus:ring-1 focus:ring-temple-gold-500 focus:border-temple-gold-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-dark-brown-700">Expiry Date</label>
              <input 
                type="date"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full border border-dark-brown-200 rounded-md px-4 py-2 text-dark-brown-900 focus:outline-none focus:ring-1 focus:ring-temple-gold-500 focus:border-temple-gold-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-dark-brown-100 flex justify-end gap-3">
            <button 
              type="button"
              onClick={() => navigate('/admin/coupons')}
              className="px-6 py-2 border border-dark-brown-200 text-dark-brown-700 rounded-md hover:bg-ivory-50 hover:border-dark-brown-300 transition-all font-medium"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-saffron-600 to-saffron-500 hover:from-saffron-700 hover:to-saffron-600 text-white px-6 py-2 rounded-md font-medium flex items-center transition-all shadow-md hover:shadow-lg disabled:opacity-70"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
