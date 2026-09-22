import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon, ArrowLeft, Save, Upload, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../components/DataTable';
import type { Column } from '../components/DataTable';
import { authService, IMAGE_BASE_URL } from '../services/api';

interface Banner {
  bannerid: string;
  bannerimage: string;
  title: string;
  createdAt: string;
}

export const Banners: React.FC = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [editItem, setEditItem] = useState<Banner | null>(null);
  const [deleteItem, setDeleteItem] = useState<Banner | null>(null);
  
  const [editTitle, setEditTitle] = useState('');
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchBanners = async () => {
    try {
      const res = await authService.getBanners();
      if (res.data) {
        setBanners(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch banners", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openEdit = (row: Banner) => {
    setEditItem(row);
    setEditTitle(row.title);
    setEditImageFile(null);
    setEditImagePreview(`${IMAGE_BASE_URL}${row.bannerimage}?t=${Date.now()}`);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const saveEdit = async () => {
    if (!editItem) return;
    try {
      const formData = new FormData();
      formData.append('title', editTitle);
      if (editImageFile) {
        formData.append('bannerimage', editImageFile);
      } else {
        // Just send back the old image string if they require it
        formData.append('bannerimage', editItem.bannerimage);
      }

      await authService.updateBanner(editItem.bannerid, formData);
      await fetchBanners();
      setEditItem(null);
    } catch (error) {
      console.error("Failed to update banner", error);
      alert("Failed to update banner");
    }
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await authService.deleteBanner(deleteItem.bannerid);
      setBanners(prev => prev.filter(b => b.bannerid !== deleteItem.bannerid));
    } catch (error) {
      console.error("Failed to delete banner", error);
      alert("Failed to delete banner");
    } finally {
      setDeleteItem(null);
    }
  };

  const inputCls = "w-full border border-dark-brown-200 rounded-md px-4 py-2 text-dark-brown-900 placeholder-dark-brown-400 focus:outline-none focus:ring-1 focus:ring-temple-gold-500 focus:border-temple-gold-500 bg-white";

  const columns: Column<Banner>[] = [
    {
      key: 'title', header: 'Banner',
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="h-16 w-32 rounded-md overflow-hidden border border-dark-brown-100 shadow-[0_4px_20px_rgba(58,43,37,0.04)] bg-ivory-50 flex items-center justify-center">
            {row.bannerimage ? (
              <img src={`${IMAGE_BASE_URL}${row.bannerimage}?t=${Date.now()}`} alt={row.title} className="h-full w-full object-cover" />
            ) : (
              <ImageIcon className="h-6 w-6 text-dark-brown-300" />
            )}
          </div>
          <div className="font-medium text-dark-brown-900">{row.title}</div>
        </div>
      )
    },
    { 
      key: 'createdAt', 
      header: 'Created At', 
      render: (row) => <span className="text-sm text-dark-brown-500">{new Date(row.createdAt).toLocaleDateString()}</span>
    },
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
          <h1 className="text-2xl font-heading font-bold text-dark-brown-900">Edit Banner</h1>
        </div>

        <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-[0_4px_20px_rgba(58,43,37,0.04)] p-6 md:p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-brown-700">Banner Image</label>
              <label className="border-2 border-dashed border-dark-brown-200 rounded-xl overflow-hidden bg-ivory-50 hover:bg-ivory-100 transition-colors cursor-pointer w-full flex flex-col items-center">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                {editImagePreview ? (
                  <img src={editImagePreview} alt="Preview" className="w-full h-40 object-cover" />
                ) : (
                  <div className="py-8 flex flex-col items-center">
                    <Upload className="h-8 w-8 text-saffron-500 mb-2" />
                    <span className="text-sm font-medium text-dark-brown-700">Click to upload image</span>
                  </div>
                )}
                {editImagePreview && (
                  <div className="flex items-center justify-center gap-2 py-3 text-sm text-dark-brown-500 bg-ivory-50 w-full">
                    <Upload className="h-4 w-4 text-saffron-500" /> Click to replace image
                  </div>
                )}
              </label>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-dark-brown-700">Banner Name</label>
              <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="e.g. Diwali Mega Sale 2026" className={inputCls} />
            </div>
            <div className="pt-4 border-t border-dark-brown-100 flex justify-end gap-3">
              <button type="button" onClick={() => setEditItem(null)} className="px-6 py-2 border border-dark-brown-200 text-dark-brown-700 rounded-md hover:bg-ivory-50 hover:border-dark-brown-300 transition-all font-medium">Cancel</button>
              <button type="button" onClick={saveEdit} className="bg-gradient-to-r from-saffron-600 to-saffron-500 hover:from-saffron-700 hover:to-saffron-600 text-white px-6 py-2 rounded-md font-medium flex items-center transition-all shadow-md hover:shadow-lg">
                <Save className="h-4 w-4 mr-2" /> Save Banner
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
        <h1 className="text-2xl font-heading font-bold text-dark-brown-900">Banners</h1>
        <button onClick={() => navigate('/admin/banners/add')} className="bg-gradient-to-r from-saffron-600 to-saffron-500 hover:from-saffron-700 hover:to-saffron-600 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center transition-all shadow-[0_4px_20px_rgba(58,43,37,0.08)] hover:shadow-lg">
          <Plus className="h-4 w-4 mr-2" /> Add Banner
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-[0_4px_20px_rgba(58,43,37,0.04)] transition-all duration-300 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-dark-brown-500">Loading banners...</div>
        ) : (
          <DataTable columns={columns} data={banners} keyExtractor={(item) => item.bannerid} />
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
            <h3 className="text-base font-heading font-bold text-dark-brown-900 text-center">Delete Banner?</h3>
            <p className="text-sm text-dark-brown-500 text-center mt-2 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-dark-brown-800">"{deleteItem.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 mt-4 p-3 bg-dark-brown-50 rounded-xl border border-dark-brown-100">
              <img src={`${IMAGE_BASE_URL}${deleteItem.bannerimage}`} alt="" className="h-10 w-16 rounded-lg object-cover shrink-0" />
              <p className="text-sm font-semibold text-dark-brown-900 truncate">{deleteItem.title}</p>
            </div>
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
