import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../components/DataTable';
import type { Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { authService, IMAGE_BASE_URL } from '../services/api';

export interface Product {
  productid: string;
  productname: string;
  categoryname: string;
  categoryid: string;
  brand: string;
  description: string;
  price: string;
  sellingprice: string;
  stockquantity: number;
  dimensions: string;
  benefits: string;
  countryoforigin: string;
  isFeatured: boolean;
  isNewarrival: boolean;
  thumbnailimage: string;
  images: string[];
}

export const Products: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await authService.getProducts();
      if (res.data) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const confirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await authService.deleteProduct(deleteItem.productid);
      setDeleteItem(null);
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete product");
      console.error("Failed to delete product", err);
    }
  };

  const columns: Column<Product>[] = [
    { 
      key: 'productname', header: 'Product', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={`${IMAGE_BASE_URL}${row.thumbnailimage}?t=${Date.now()}`} alt={row.productname} className="h-10 w-10 rounded-md object-cover border border-dark-brown-100 shadow-sm" />
          <div>
            <div className="font-medium text-dark-brown-900">{row.productname}</div>
            <div className="flex gap-1 mt-1">
              {row.isFeatured && <span className="text-[10px] font-semibold bg-saffron-100 text-saffron-700 px-1.5 rounded-sm">Featured</span>}
              {row.isNewarrival && <span className="text-[10px] font-semibold bg-dark-brown-100 text-dark-brown-700 px-1.5 rounded-sm">New</span>}
            </div>
          </div>
        </div>
      ) 
    },
    { key: 'categoryname', header: 'Category', render: (row) => row.categoryname },
    { key: 'brand', header: 'Brand', render: (row) => row.brand },
    { 
      key: 'price', header: 'Price', 
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">₹{Number(row.sellingprice).toLocaleString()}</span>
          {Number(row.price) > Number(row.sellingprice) && (
            <span className="text-xs text-dark-brown-400 line-through">₹{Number(row.price).toLocaleString()}</span>
          )}
        </div>
      )
    },
    { key: 'stockquantity', header: 'Stock', render: (row) => row.stockquantity },
    { key: 'actions', header: 'Actions', render: (row) => (
      <div className="flex gap-3">
        <button onClick={() => navigate(`/admin/products/${row.productid}`)} className="text-dark-brown-400 hover:text-temple-gold-600 transition-colors"><Eye className="h-4 w-4" /></button>
        <button onClick={() => navigate(`/admin/products/${row.productid}/edit`)} className="text-dark-brown-400 hover:text-temple-gold-600 transition-colors"><Edit className="h-4 w-4" /></button>
        <button onClick={() => setDeleteItem(row)} className="text-dark-brown-400 hover:text-saffron-700 transition-colors"><Trash2 className="h-4 w-4" /></button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold text-dark-brown-900">Products</h1>
        <button 
          onClick={() => navigate('/admin/products/add')}
          className="bg-gradient-to-r from-saffron-600 to-saffron-500 hover:from-saffron-700 hover:to-saffron-600 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </button>
      </div>
      
      <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-sm hover:shadow-[0_8px_30px_rgba(58,43,37,0.08)] transition-all duration-300 overflow-hidden">
        <div className="p-4 border-b border-dark-brown-100 flex flex-col sm:flex-row flex-wrap gap-4">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="flex-1 min-w-[200px] border border-dark-brown-200 rounded-md px-3 py-2 text-sm text-dark-brown-900 placeholder-dark-brown-400 focus:outline-none focus:ring-1 focus:ring-temple-gold-500 focus:border-temple-gold-500"
          />
        </div>
        <DataTable columns={columns} data={products} keyExtractor={(item) => item.productid} />
      </div>

      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-brown-900/40 backdrop-blur-sm" onClick={() => setDeleteItem(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-dark-brown-100">
            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-saffron-50 border border-saffron-100 mx-auto mb-4">
              <AlertTriangle className="h-7 w-7 text-saffron-600" />
            </div>
            <h3 className="text-base font-heading font-bold text-dark-brown-900 text-center">Delete Product?</h3>
            <p className="text-sm text-dark-brown-500 text-center mt-2 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-dark-brown-800">"{deleteItem.productname}"</span>? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 mt-4 p-3 bg-dark-brown-50 rounded-xl border border-dark-brown-100">
              <img src={`${IMAGE_BASE_URL}${deleteItem.thumbnailimage}?t=${Date.now()}`} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-dark-brown-900 truncate">{deleteItem.productname}</p>
                <p className="text-xs text-dark-brown-400">{deleteItem.brand}</p>
              </div>
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
