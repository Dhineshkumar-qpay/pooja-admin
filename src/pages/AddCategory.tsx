import React, { useState } from 'react';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

export const AddCategory: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!name || !description || !image) {
      setError("Please fill in all fields and select an image.");
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append("categoryname", name);
      formData.append("description", description);
      formData.append("thumbnailimage", image);
      
      await authService.createCategory(formData);
      navigate('/admin/categories');
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong while creating category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/admin/categories')}
          className="p-2 text-dark-brown-500 hover:text-dark-brown-900 bg-white border border-dark-brown-200 rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-heading font-bold text-dark-brown-900">Add New Category</h1>
      </div>

      <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-[0_4px_20px_rgba(58,43,37,0.04)] p-6 md:p-8">
        {error && (
          <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 rounded-xl">
            {error}
          </div>
        )}
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-brown-700">Category Image</label>
            <div className="border-2 border-dashed border-dark-brown-200 rounded-xl p-8 flex flex-col items-center justify-center text-dark-brown-400 bg-ivory-50 hover:bg-ivory-100 transition-colors relative w-full max-w-sm">
              <input 
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImage(e.target.files[0]);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {image ? (
                <img 
                  src={URL.createObjectURL(image)} 
                  alt="Preview" 
                  className="h-24 w-24 object-cover rounded-xl mb-3 shadow-sm pointer-events-none" 
                />
              ) : (
                <Upload className="h-8 w-8 mb-2 text-saffron-500 pointer-events-none" />
              )}
              <p className="text-sm font-medium text-dark-brown-700 pointer-events-none">
                {image ? "Click to change image" : "Click to upload category image"}
              </p>
              <p className="text-xs mt-1 text-dark-brown-500 pointer-events-none">SVG, PNG, JPG or GIF (max. 400x400px)</p>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-dark-brown-700">Category Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Premium Pooja Thalis"
              className="w-full border border-dark-brown-200 rounded-md px-4 py-2 text-dark-brown-900 placeholder-dark-brown-400 focus:outline-none focus:ring-1 focus:ring-temple-gold-500 focus:border-temple-gold-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-dark-brown-700">Description</label>
            <textarea 
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a brief description about the category..."
              className="w-full border border-dark-brown-200 rounded-md px-4 py-2 text-dark-brown-900 placeholder-dark-brown-400 focus:outline-none focus:ring-1 focus:ring-temple-gold-500 focus:border-temple-gold-500"
            />
          </div>

          <div className="pt-4 border-t border-dark-brown-100 flex justify-end gap-3">
            <button 
              type="button"
              onClick={() => navigate('/admin/categories')}
              className="px-6 py-2 border border-dark-brown-200 text-dark-brown-700 rounded-md hover:bg-ivory-50 hover:border-dark-brown-300 transition-all font-medium"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleSave}
              disabled={isLoading}
              className="bg-gradient-to-r from-saffron-600 to-saffron-500 hover:from-saffron-700 hover:to-saffron-600 text-white px-6 py-2 rounded-md font-medium flex items-center transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
