import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Tag, Boxes, Hash, Star, Edit, ImageIcon } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { authService, IMAGE_BASE_URL } from '../services/api';

const discount = (orig: number, sell: number) => Math.round(((orig - sell) / orig) * 100);

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const res = await authService.getProductById(id);
        if (res.data) {
          setProduct(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (isLoading) {
    return <div className="p-8 text-center text-dark-brown-500">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-dark-brown-400">
        <div className="h-16 w-16 rounded-2xl bg-dark-brown-50 flex items-center justify-center mb-4">
          <Package className="h-8 w-8 opacity-40" />
        </div>
        <p className="text-base font-semibold text-dark-brown-700">Product not found</p>
        <p className="text-sm text-dark-brown-400 mt-1">The product you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/admin/products')}
          className="mt-5 px-4 py-2 rounded-xl bg-gradient-to-r from-saffron-600 to-temple-gold-500 text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity">
          Back to Products
        </button>
      </div>
    );
  }

  const originalPrice = parseFloat(product.price) || 0;
  const sellingPrice = parseFloat(product.sellingprice) || 0;
  const disc = discount(originalPrice, sellingPrice);

  const stock = Number(product.stockquantity) || 0;
  const status = stock === 0 ? 'Out of Stock' : stock <= 10 ? 'Low Stock' : 'Active';

  // Combine thumbnail and other images for the carousel
  const allImages = [product.thumbnailimage, ...(product.images || [])].filter(Boolean).map(img => `${IMAGE_BASE_URL}${img}?t=${Date.now()}`);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">

      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/products')}
          className="p-2 rounded-xl border border-dark-brown-200 text-dark-brown-500 hover:bg-dark-brown-50 hover:text-dark-brown-800 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-heading font-bold text-dark-brown-900 truncate">{product.productname}</h1>
          <p className="text-sm text-dark-brown-400 mt-0.5 flex items-center gap-1.5">
            <Hash className="h-3.5 w-3.5" />{product.productid?.substring(0, 8)}
          </p>
        </div>
        <button onClick={() => navigate(`/admin/products/${product.productid}/edit`)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-saffron-600 to-temple-gold-500 text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity shrink-0">
          <Edit className="h-4 w-4" /> Edit Product
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — image + thumbnails */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-[0_4px_20px_rgba(58,43,37,0.04)] overflow-hidden">
            {allImages.length > 0 ? (
              <img
                src={allImages[activeImg]}
                alt={product.productname}
                className="w-full aspect-square object-cover transition-all duration-300"
              />
            ) : (
              <div className="w-full aspect-square bg-dark-brown-50 flex items-center justify-center">
                <ImageIcon className="h-16 w-16 text-dark-brown-200" />
              </div>
            )}
          </div>
          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`rounded-xl overflow-hidden border-2 transition-all duration-200 aspect-square ${activeImg === i
                      ? 'border-saffron-500 shadow-md shadow-saffron-100'
                      : 'border-dark-brown-100 hover:border-temple-gold-400'
                    }`}
                >
                  <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Badges */}
          <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-[0_4px_20px_rgba(58,43,37,0.04)] p-5">
            <p className="text-xs font-semibold text-dark-brown-400 uppercase tracking-wider mb-3">Product Badges</p>
            <div className="space-y-2.5">
              {[
                { label: 'Featured Product', active: product.isFeatured, color: 'saffron' },
                { label: 'New Arrival', active: product.isNewarrival, color: 'dark-brown' },
              ].map(b => (
                <div key={b.label} className="flex items-center justify-between">
                  <span className="text-sm text-dark-brown-600">{b.label}</span>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${b.active
                      ? b.color === 'saffron' ? 'bg-saffron-100 text-saffron-700'
                        : b.color === 'temple-gold' ? 'bg-temple-gold-100 text-temple-gold-700'
                          : 'bg-dark-brown-100 text-dark-brown-700'
                      : 'bg-dark-brown-50 text-dark-brown-300'
                    }`}>
                    {b.active ? 'Yes' : 'No'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — details */}
        <div className="lg:col-span-2 space-y-6">

          {/* Overview */}
          <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-[0_4px_20px_rgba(58,43,37,0.04)] p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-1.5 bg-temple-gold-50 rounded-lg">
                <Package className="h-4 w-4 text-temple-gold-600" />
              </div>
              <h2 className="text-sm font-semibold text-dark-brown-800">Product Overview</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
              {[
                { label: 'Category', value: product.categoryname, icon: Tag },
                { label: 'Stock', value: `${stock} units`, icon: Boxes },
                { label: 'Status', value: null, icon: Star, badge: status },
              ].map(({ label, value, icon: Icon, badge }) => (
                <div key={label} className="bg-ivory-50 rounded-xl p-4 border border-dark-brown-100">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Icon className="h-3.5 w-3.5 text-dark-brown-400" />
                    <span className="text-xs text-dark-brown-400">{label}</span>
                  </div>
                  {badge ? <StatusBadge status={badge} /> : (
                    <p className="text-sm font-semibold text-dark-brown-900 truncate" title={value}>{value || '-'}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div className="bg-ivory-50 rounded-xl p-4 border border-dark-brown-100">
                <p className="text-xs text-dark-brown-400 mb-1">Brand</p>
                <p className="text-sm font-semibold text-dark-brown-900">{product.brand || '-'}</p>
              </div>
              <div className="bg-ivory-50 rounded-xl p-4 border border-dark-brown-100">
                <p className="text-xs text-dark-brown-400 mb-1">Dimensions</p>
                <p className="text-sm font-semibold text-dark-brown-900">{product.dimensions || '-'}</p>
              </div>
              <div className="bg-ivory-50 rounded-xl p-4 border border-dark-brown-100">
                <p className="text-xs text-dark-brown-400 mb-1">Origin</p>
                <p className="text-sm font-semibold text-dark-brown-900">{product.countryoforigin || '-'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-dark-brown-400 uppercase tracking-wider mb-2">Description</p>
                <p className="text-sm text-dark-brown-600 leading-relaxed whitespace-pre-wrap">{product.description || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-dark-brown-400 uppercase tracking-wider mb-2">Benefits</p>
                <p className="text-sm text-dark-brown-600 leading-relaxed whitespace-pre-wrap">{product.benefits || '-'}</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-[0_4px_20px_rgba(58,43,37,0.04)] p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-1.5 bg-temple-gold-50 rounded-lg">
                <Tag className="h-4 w-4 text-temple-gold-600" />
              </div>
              <h2 className="text-sm font-semibold text-dark-brown-800">Pricing</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-ivory-50 rounded-xl p-4 border border-dark-brown-100">
                <p className="text-xs text-dark-brown-400 mb-1">Original Price</p>
                <p className="text-lg font-bold text-dark-brown-500 line-through">₹{originalPrice.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-saffron-50 to-temple-gold-50 rounded-xl p-4 border border-temple-gold-200">
                <p className="text-xs text-dark-brown-400 mb-1">Selling Price</p>
                <p className="text-lg font-bold text-saffron-600">₹{sellingPrice.toLocaleString()}</p>
              </div>
              <div className="bg-ivory-50 rounded-xl p-4 border border-dark-brown-100">
                <p className="text-xs text-dark-brown-400 mb-1">Discount</p>
                <p className="text-lg font-bold text-temple-gold-600">{disc}% OFF</p>
              </div>
            </div>

            {/* Savings callout */}
            {originalPrice > sellingPrice && (
              <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-temple-gold-50 rounded-xl border border-temple-gold-100">
                <Star className="h-4 w-4 text-temple-gold-600 shrink-0" />
                <p className="text-sm text-temple-gold-700 font-medium">
                  Customer saves <span className="font-bold">₹{(originalPrice - sellingPrice).toLocaleString()}</span> on this product
                </p>
              </div>
            )}
          </div>

          {/* Stock info */}
          <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-[0_4px_20px_rgba(58,43,37,0.04)] p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-1.5 bg-temple-gold-50 rounded-lg">
                <Boxes className="h-4 w-4 text-temple-gold-600" />
              </div>
              <h2 className="text-sm font-semibold text-dark-brown-800">Inventory</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-3 bg-dark-brown-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${stock === 0 ? 'bg-dark-brown-300'
                      : stock <= 10 ? 'bg-gradient-to-r from-saffron-500 to-saffron-400'
                        : 'bg-gradient-to-r from-saffron-500 to-temple-gold-400'
                    }`}
                  style={{ width: `${Math.min((stock / 150) * 100, 100)}%` }}
                />
              </div>
              <span className="text-sm font-bold text-dark-brown-900 shrink-0">{stock} units</span>
            </div>
            <p className={`text-xs mt-2 font-medium ${stock === 0 ? 'text-dark-brown-500'
                : stock <= 10 ? 'text-saffron-600'
                  : 'text-temple-gold-600'
              }`}>
              {stock === 0 ? 'Out of stock — restock needed'
                : stock <= 10 ? 'Low stock — consider restocking soon'
                  : 'Stock level is healthy'}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
