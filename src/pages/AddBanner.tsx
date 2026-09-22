import React, { useState } from 'react';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

export const AddBanner: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!title || !imageFile) {
      alert("Please provide both a title and an image.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('bannerimage', imageFile);

      await authService.createBanner(formData);
      navigate('/admin/banners');
    } catch (error) {
      console.error("Failed to add banner", error);
      alert("Failed to add banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/admin/banners')}
          className="p-2 text-dark-brown-500 hover:text-dark-brown-900 bg-white border border-dark-brown-200 rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-heading font-bold text-dark-brown-900">Add New Banner</h1>
      </div>

      <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-[0_4px_20px_rgba(58,43,37,0.04)] p-6 md:p-8">
        <form className="space-y-6">
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-brown-700">Banner Image</label>
            <label className="border-2 border-dashed border-dark-brown-200 rounded-xl overflow-hidden flex flex-col items-center justify-center text-dark-brown-400 bg-ivory-50 hover:bg-ivory-100 transition-colors cursor-pointer w-full min-h-[160px]">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center p-8">
                  <Upload className="h-8 w-8 mb-2 text-saffron-500" />
                  <p className="text-sm font-medium text-dark-brown-700">Click to upload banner image</p>
                  <p className="text-xs mt-1 text-dark-brown-500">SVG, PNG, JPG or GIF</p>
                </div>
              )}
            </label>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-dark-brown-700">Banner Name (Title)</label>
            <input 
              type="text" 
              placeholder="e.g. Diwali Mega Sale 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-dark-brown-200 rounded-md px-4 py-2 text-dark-brown-900 placeholder-dark-brown-400 focus:outline-none focus:ring-1 focus:ring-temple-gold-500 focus:border-temple-gold-500"
            />
          </div>

          <div className="pt-4 border-t border-dark-brown-100 flex justify-end gap-3">
            <button 
              type="button"
              onClick={() => navigate('/admin/banners')}
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
              {isSubmitting ? 'Saving...' : 'Save Banner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
