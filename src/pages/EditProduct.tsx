import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Upload, Image as ImageIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService, IMAGE_BASE_URL } from '../services/api';

export const EditProduct: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [existingProduct, setExistingProduct] = useState<any>(null);

  const [productname, setProductname] = useState('');
  const [categoryid, setCategoryid] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [sellingprice, setSellingprice] = useState('');
  const [stockquantity, setStockquantity] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [benefits, setBenefits] = useState('');
  const [countryoforigin, setCountryoforigin] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewarrival, setIsNewarrival] = useState(false);
  
  const [thumbnailimage, setThumbnailimage] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await authService.getCategories();
        if (catRes.data) setCategories(catRes.data);

        const prodRes = await authService.getProducts();
        if (prodRes.data) {
          const product = prodRes.data.find((p: any) => p.productid === id);
          if (product) {
            setExistingProduct(product);
            setProductname(product.productname || '');
            setCategoryid(product.categoryid || '');
            setBrand(product.brand || '');
            setDescription(product.description || '');
            setPrice(product.price || '');
            setSellingprice(product.sellingprice || '');
            setStockquantity(product.stockquantity?.toString() || '');
            setDimensions(product.dimensions || '');
            setBenefits(product.benefits || '');
            setCountryoforigin(product.countryoforigin || '');
            setIsFeatured(product.isFeatured || false);
            setIsNewarrival(product.isNewarrival || false);
          }
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleSave = async () => {
    if (!productname || !categoryid) {
      alert("Please fill required fields (Name, Category)");
      return;
    }
    
    setIsSaving(true);
    try {
      const selectedCategory = categories.find(c => c.categoryid === categoryid);
      
      const formData = new FormData();
      formData.append("productname", productname);
      formData.append("categoryname", selectedCategory?.categoryname || "");
      formData.append("categoryid", categoryid);
      formData.append("brand", brand);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("sellingprice", sellingprice);
      formData.append("stockquantity", stockquantity);
      formData.append("dimensions", dimensions);
      formData.append("benefits", benefits);
      formData.append("countryoforigin", countryoforigin);
      formData.append("isFeatured", String(isFeatured));
      formData.append("isNewarrival", String(isNewarrival));
      
      if (thumbnailimage) {
        formData.append("thumbnailimage", thumbnailimage);
      } else if (existingProduct?.thumbnailimage) {
        formData.append("thumbnailimage", existingProduct.thumbnailimage);
      }
      
      if (images.length > 0) {
        Array.from(images).forEach((file) => {
          formData.append("images", file);
        });
      } else if (existingProduct?.images?.length) {
        // If the backend expects existing images to be preserved, it typically ignores them unless new ones are sent, 
        // but we'll try appending strings if it's supported, or just ignore since file uploads override.
        existingProduct.images.forEach((img: string) => {
          formData.append("images", img);
        });
      }

      await authService.editProduct(id!, formData);
      navigate('/admin/products');
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update product");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles].slice(0, 4));
    }
  };

  const inputCls = "w-full border border-dark-brown-200 rounded-md px-4 py-2 text-dark-brown-900 placeholder-dark-brown-400 focus:outline-none focus:ring-1 focus:ring-temple-gold-500 focus:border-temple-gold-500";

  if (isLoading) return <div className="p-8 text-center text-dark-brown-500">Loading product data...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/admin/products')}
          className="p-2 text-dark-brown-500 hover:text-dark-brown-900 bg-white border border-dark-brown-200 rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-heading font-bold text-dark-brown-900">Edit Product</h1>
          <p className="text-sm text-dark-brown-400 mt-0.5">{existingProduct?.productname}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 border border-dark-brown-200 text-dark-brown-700 rounded-xl hover:bg-ivory-50 transition-all text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-gradient-to-r from-saffron-600 to-temple-gold-500 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-[0_4px_20px_rgba(58,43,37,0.04)] p-6 md:p-8">
            <h2 className="text-lg font-heading font-semibold text-dark-brown-900 mb-6 border-b border-dark-brown-100 pb-2">Basic Information</h2>
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-dark-brown-700">Product Name</label>
                <input type="text" value={productname} onChange={e => setProductname(e.target.value)} placeholder="e.g. Premium Brass Diya" className={inputCls} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-dark-brown-700">Category</label>
                  <select value={categoryid} onChange={e => setCategoryid(e.target.value)} className={inputCls}>
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c.categoryid} value={c.categoryid}>{c.categoryname}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-dark-brown-700">Stock Quantity</label>
                  <input type="number" value={stockquantity} onChange={e => setStockquantity(e.target.value)} placeholder="0" className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-dark-brown-700">Brand</label>
                  <input type="text" value={brand} onChange={e => setBrand(e.target.value)} placeholder="e.g. PoojaCraft" className={inputCls} />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-dark-brown-700">Country of Origin</label>
                  <input type="text" value={countryoforigin} onChange={e => setCountryoforigin(e.target.value)} placeholder="e.g. India" className={inputCls} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-dark-brown-700">Description</label>
                <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Write a brief description about the product..." className={inputCls} />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-dark-brown-700">Benefits</label>
                <textarea rows={2} value={benefits} onChange={e => setBenefits(e.target.value)} placeholder="Ideal for daily worship..." className={inputCls} />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-dark-brown-700">Dimensions</label>
                <input type="text" value={dimensions} onChange={e => setDimensions(e.target.value)} placeholder="e.g. 8 × 8 × 6 cm" className={inputCls} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-[0_4px_20px_rgba(58,43,37,0.04)] p-6 md:p-8">
            <h2 className="text-lg font-heading font-semibold text-dark-brown-900 mb-6 border-b border-dark-brown-100 pb-2">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-dark-brown-700">Original Price (₹)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" className={inputCls} />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-dark-brown-700">Selling Price (₹)</label>
                <input type="number" value={sellingprice} onChange={e => setSellingprice(e.target.value)} placeholder="0.00" className={inputCls} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-[0_4px_20px_rgba(58,43,37,0.04)] p-6 md:p-8">
            <h2 className="text-lg font-heading font-semibold text-dark-brown-900 mb-6 border-b border-dark-brown-100 pb-2">Media</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-dark-brown-700">Product Image (Main)</label>
                <div className="relative border-2 border-dashed border-dark-brown-200 rounded-xl p-8 flex flex-col items-center justify-center text-dark-brown-400 bg-ivory-50 hover:bg-ivory-100 transition-colors">
                  <input type="file" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) setThumbnailimage(e.target.files[0]) }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  {thumbnailimage ? (
                    <img src={URL.createObjectURL(thumbnailimage)} alt="Preview" className="h-32 object-cover rounded-lg pointer-events-none" />
                  ) : existingProduct?.thumbnailimage ? (
                    <img src={`${IMAGE_BASE_URL}${existingProduct.thumbnailimage}?t=${Date.now()}`} alt="Current" className="h-32 object-cover rounded-lg pointer-events-none" />
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mb-2 text-saffron-500" />
                      <p className="text-sm font-medium text-dark-brown-700">Click to upload main image</p>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-dark-brown-700">Additional Images (Limit 4)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
                  <input type="file" multiple accept="image/*" onChange={handleImagesChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" title="Upload additional images" />
                  {[0, 1, 2, 3].map((i) => {
                    const hasNew = images[i];
                    const hasExisting = !images.length && existingProduct?.images?.[i];
                    
                    return (
                      <div key={i} className="aspect-square border-2 border-dashed border-dark-brown-200 rounded-lg flex flex-col items-center justify-center text-dark-brown-400 bg-ivory-50 relative overflow-hidden">
                        {hasNew ? (
                          <img src={URL.createObjectURL(images[i])} alt="Additional" className="w-full h-full object-cover" />
                        ) : hasExisting ? (
                          <img src={`${IMAGE_BASE_URL}${existingProduct.images[i]}?t=${Date.now()}`} alt="Current" className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <ImageIcon className="h-6 w-6 mb-1 text-dark-brown-300" />
                            <span className="text-xs">Add Image</span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
                {images.length > 0 && (
                  <button type="button" onClick={() => setImages([])} className="text-xs text-saffron-600 hover:underline mt-2 inline-block">Clear new images and keep existing</button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-[0_4px_20px_rgba(58,43,37,0.04)] p-6">
            <h2 className="text-lg font-heading font-semibold text-dark-brown-900 mb-4 border-b border-dark-brown-100 pb-2">Visibility Options</h2>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-dark-brown-900">Featured Product</h3>
                  <p className="text-xs text-dark-brown-500">Show on homepage</p>
                </div>
                <button type="button" onClick={() => setIsFeatured(!isFeatured)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isFeatured ? 'bg-saffron-600' : 'bg-dark-brown-200'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isFeatured ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-dark-brown-900">New Arrival</h3>
                  <p className="text-xs text-dark-brown-500">Mark as new product</p>
                </div>
                <button type="button" onClick={() => setIsNewarrival(!isNewarrival)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isNewarrival ? 'bg-saffron-600' : 'bg-dark-brown-200'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isNewarrival ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
