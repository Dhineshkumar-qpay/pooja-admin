import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, AlertTriangle, ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../components/DataTable';
import type { Column } from '../components/DataTable';
import { authService } from '../services/api';

interface Coupon {
  couponid: string;
  couponcode: string;
  type: string;
  value: string;
  minorder: string;
  expiry: string;
  createdAt: string;
  updatedAt: string;
}

export const Coupons: React.FC = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [deleteItem, setDeleteItem] = useState<Coupon | null>(null);
  const [editItem, setEditItem] = useState<Coupon | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [editCode, setEditCode] = useState('');
  const [editType, setEditType] = useState('percentage');
  const [editValue, setEditValue] = useState('');
  const [editMin, setEditMin] = useState('');
  const [editExpiry, setEditExpiry] = useState('');

  const fetchCoupons = async () => {
    try {
      const res = await authService.getCoupons();
      if (res.data) {
        setCoupons(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch coupons", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openEdit = (row: Coupon) => {
    setEditItem(row);
    setEditCode(row.couponcode);
    setEditType(row.type);
    setEditValue(String(row.value));
    setEditMin(String(row.minorder));
    // extract yyyy-mm-dd from ISO
    setEditExpiry(row.expiry.split('T')[0]);
  };

  const saveEdit = async () => {
    if (!editItem) return;
    try {
      const payload = {
        couponcode: editCode,
        type: editType,
        value: Number(editValue),
        minorder: Number(editMin),
        expiry: editExpiry
      };
      await authService.updateCoupon(editItem.couponid, payload);
      await fetchCoupons();
      setEditItem(null);
    } catch (error) {
      console.error("Failed to update coupon", error);
      alert("Failed to update coupon");
    }
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await authService.deleteCoupon(deleteItem.couponid);
      setCoupons(prev => prev.filter(c => c.couponid !== deleteItem.couponid));
    } catch (error) {
      console.error("Failed to delete coupon", error);
      alert("Failed to delete coupon");
    } finally {
      setDeleteItem(null);
    }
  };

  const inputCls = "w-full border border-dark-brown-200 rounded-md px-4 py-2 text-dark-brown-900 placeholder-dark-brown-400 focus:outline-none focus:ring-1 focus:ring-temple-gold-500 focus:border-temple-gold-500 bg-white";

  const columns: Column<Coupon>[] = [
    { key: 'couponcode', header: 'Coupon Code', render: (row) => <span className="font-medium text-saffron-600">{row.couponcode}</span> },
    { key: 'type', header: 'Type', render: (row) => <span className="capitalize">{row.type}</span> },
    { key: 'value', header: 'Value', render: (row) => row.type === 'percentage' ? `${row.value}%` : `₹${row.value}` },
    { key: 'minorder', header: 'Min Order', render: (row) => `₹${row.minorder}` },
    { key: 'expiry', header: 'Expiry', render: (row) => new Date(row.expiry).toLocaleDateString() },
    { key: 'actions', header: 'Actions', render: (row) => (
      <div className="flex gap-3">
        <button onClick={() => openEdit(row)} className="text-dark-brown-400 hover:text-temple-gold-600 transition-colors"><Edit className="h-4 w-4" /></button>
        <button onClick={() => setDeleteItem(row)} className="text-dark-brown-400 hover:text-saffron-700 transition-colors"><Trash2 className="h-4 w-4" /></button>
      </div>
    ) },
  ];

  // ── Edit full-page form ──
  if (editItem) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-4">
          <button onClick={() => setEditItem(null)} className="p-2 text-dark-brown-500 hover:text-dark-brown-900 bg-white border border-dark-brown-200 rounded-lg shadow-[0_4px_20px_rgba(58,43,37,0.04)] hover:shadow-md transition-all">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-heading font-bold text-dark-brown-900">Edit Coupon</h1>
        </div>

        <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-[0_4px_20px_rgba(58,43,37,0.04)] p-6 md:p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-dark-brown-700">Coupon Code</label>
                <input type="text" value={editCode} onChange={e => setEditCode(e.target.value)} placeholder="e.g. DIWALI26" className={inputCls + " uppercase"} />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-dark-brown-700">Discount Type</label>
                <select value={editType} onChange={e => setEditType(e.target.value)} className={inputCls}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Fixed Amount (₹)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-dark-brown-700">Discount Value</label>
                <input type="number" value={editValue} onChange={e => setEditValue(e.target.value)} placeholder="e.g. 20" className={inputCls} />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-dark-brown-700">Minimum Order Value (₹)</label>
                <input type="number" value={editMin} onChange={e => setEditMin(e.target.value)} placeholder="e.g. 2000" className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-dark-brown-700">Expiry Date</label>
                <input type="date" value={editExpiry} onChange={e => setEditExpiry(e.target.value)} className={inputCls} />
              </div>
            </div>
            <div className="pt-4 border-t border-dark-brown-100 flex justify-end gap-3">
              <button type="button" onClick={() => setEditItem(null)} className="px-6 py-2 border border-dark-brown-200 text-dark-brown-700 rounded-md hover:bg-ivory-50 hover:border-dark-brown-300 transition-all font-medium">Cancel</button>
              <button type="button" onClick={saveEdit} className="bg-gradient-to-r from-saffron-600 to-saffron-500 hover:from-saffron-700 hover:to-saffron-600 text-white px-6 py-2 rounded-md font-medium flex items-center transition-all shadow-md hover:shadow-lg">
                <Save className="h-4 w-4 mr-2" /> Save Coupon
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main list view ──
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold text-dark-brown-900">Coupons & Offers</h1>
        <button onClick={() => navigate('/admin/coupons/add')} className="bg-gradient-to-r from-saffron-600 to-saffron-500 hover:from-saffron-700 hover:to-saffron-600 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center transition-all shadow-[0_4px_20px_rgba(58,43,37,0.08)] hover:shadow-lg">
          <Plus className="h-4 w-4 mr-2" /> Create Coupon
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-[0_4px_20px_rgba(58,43,37,0.04)] transition-all duration-300 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-dark-brown-500">Loading coupons...</div>
        ) : (
          <DataTable columns={columns} data={coupons} keyExtractor={(item) => item.couponid} />
        )}
      </div>

      {/* Delete Dialog */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-brown-900/40 backdrop-blur-sm" onClick={() => setDeleteItem(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-dark-brown-100">
            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-saffron-50 border border-saffron-100 mx-auto mb-4">
              <AlertTriangle className="h-7 w-7 text-saffron-600" />
            </div>
            <h3 className="text-base font-heading font-bold text-dark-brown-900 text-center">Delete Coupon?</h3>
            <p className="text-sm text-dark-brown-500 text-center mt-2 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-dark-brown-800">"{deleteItem.couponcode}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setDeleteItem(null)} className="flex-1 py-2.5 rounded-xl border border-dark-brown-200 text-dark-brown-700 text-sm font-medium hover:bg-dark-brown-50 transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-saffron-600 to-saffron-700 text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
