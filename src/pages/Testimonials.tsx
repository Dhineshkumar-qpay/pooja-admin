import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Star, X, AlertTriangle } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import type { Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { authService } from '../services/api';

interface Testimonial {
  testimonialid: string;
  fullname: string;
  location: string;
  title: string;
  rating: number;
  review: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center text-temple-gold-500">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? 'fill-current' : 'text-dark-brown-200'}`} />
    ))}
  </div>
);

export const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [viewItem, setViewItem] = useState<Testimonial | null>(null);
  const [deleteItem, setDeleteItem] = useState<Testimonial | null>(null);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      const res = await authService.getTestimonials("");
      if (res.data) {
        setTestimonials(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch testimonials", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const toggleStatus = async (item: Testimonial) => {
    try {
      const newStatus = item.status === "active" ? "inactive" : "active";
      await authService.updateTestimonialStatus(item.testimonialid, newStatus);
      setTestimonials(prev => prev.map(t => t.testimonialid === item.testimonialid ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status");
    }
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await authService.deleteTestimonial(deleteItem.testimonialid);
      setTestimonials(prev => prev.filter(t => t.testimonialid !== deleteItem.testimonialid));
    } catch (error) {
      console.error("Failed to delete testimonial", error);
      alert("Failed to delete testimonial");
    } finally {
      setDeleteItem(null);
    }
  };

  const filtered = testimonials.filter((t) => {
    const term = search.toLowerCase();
    const matchSearch =
      t.fullname.toLowerCase().includes(term) ||
      t.title.toLowerCase().includes(term) ||
      t.review.toLowerCase().includes(term);
    const matchRating =
      ratingFilter === "All" || t.rating === Number(ratingFilter);
    const matchStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" ? t.status === "active" : t.status === "inactive");
    return matchSearch && matchRating && matchStatus;
  });

  const columns: Column<Testimonial>[] = [
    { 
      key: 'fullname', 
      header: 'Customer', 
      render: (row) => (
        <div>
          <div className="font-medium text-dark-brown-900">{row.fullname}</div>
          <div className="text-xs text-dark-brown-500">{row.location}</div>
        </div>
      ) 
    },
    { key: 'rating', header: 'Rating', render: (row) => <StarRating rating={row.rating} /> },
    { 
      key: 'review', 
      header: 'Review', 
      render: (row) => (
        <div>
          <div className="text-sm font-semibold text-dark-brown-800">{row.title}</div>
          <div className="text-sm text-dark-brown-600 max-w-[250px] truncate" title={row.review}>{row.review}</div>
        </div>
      ) 
    },
    { 
      key: 'createdAt', 
      header: 'Date', 
      render: (row) => <span className="text-xs text-dark-brown-500">{new Date(row.createdAt).toLocaleDateString()}</span> 
    },
    {
      key: "status",
      header: "Visible",
      render: (row) => (
        <button
          onClick={() => toggleStatus(row)}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            row.status === "active"
              ? "bg-gradient-to-r from-saffron-500 to-temple-gold-500"
              : "bg-dark-brown-200"
          }`}
          role="switch"
          aria-checked={row.status === "active"}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${
              row.status === "active" ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      ),
    },
    { key: 'actions', header: 'Actions', render: (row) => (
      <div className="flex gap-3">
        <button onClick={() => setViewItem(row)} className="text-dark-brown-400 hover:text-temple-gold-600 transition-colors" title="View"><Eye className="h-4 w-4" /></button>
        <button onClick={() => setDeleteItem(row)} className="text-dark-brown-400 hover:text-saffron-700 transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold text-dark-brown-900">Testimonials</h1>
      </div>

      <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-[0_4px_20px_rgba(58,43,37,0.04)] transition-all duration-300 overflow-hidden">
        <div className="p-4 border-b border-dark-brown-100 flex flex-col sm:flex-row flex-wrap gap-4">
          <input 
            type="text" 
            placeholder="Search testimonials..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] border border-dark-brown-200 rounded-md px-3 py-2 text-sm text-dark-brown-900 placeholder-dark-brown-400 focus:outline-none focus:ring-1 focus:ring-temple-gold-500 focus:border-temple-gold-500" 
          />
          <select 
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="border border-dark-brown-200 rounded-md px-3 py-2 text-sm bg-white text-dark-brown-900 focus:outline-none focus:ring-1 focus:ring-temple-gold-500 focus:border-temple-gold-500"
          >
            <option value="All">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-dark-brown-200 rounded-md px-3 py-2 text-sm bg-white text-dark-brown-900 focus:outline-none focus:ring-1 focus:ring-temple-gold-500 focus:border-temple-gold-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Visible</option>
            <option value="Inactive">Hidden</option>
          </select>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center text-dark-brown-500">Loading testimonials...</div>
        ) : (
          <DataTable columns={columns} data={filtered} keyExtractor={(item) => item.testimonialid} />
        )}
      </div>

      {/* View Drawer */}
      {viewItem && (
        <>
          <div className="fixed inset-0 z-40 bg-dark-brown-900/30 backdrop-blur-sm" onClick={() => setViewItem(null)} />
          <div className="fixed top-0 right-0 h-full z-50 w-80 bg-white border-l border-dark-brown-100 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-dark-brown-100">
              <span className="text-sm font-semibold text-dark-brown-800">Testimonial Detail</span>
              <button onClick={() => setViewItem(null)} className="p-1.5 rounded-lg text-dark-brown-400 hover:bg-dark-brown-50 hover:text-dark-brown-700 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-saffron-400 to-temple-gold-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {viewItem.fullname.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base font-heading font-bold text-dark-brown-900">{viewItem.fullname}</h2>
                  <p className="text-xs text-dark-brown-400">{viewItem.location}</p>
                </div>
              </div>
              <div className="rounded-xl border border-dark-brown-100 overflow-hidden divide-y divide-dark-brown-50">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-dark-brown-400">Rating</span>
                  <StarRating rating={viewItem.rating} />
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-dark-brown-400">Date</span>
                  <span className="text-xs text-dark-brown-700">{new Date(viewItem.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-dark-brown-400">Status</span>
                  <StatusBadge status={viewItem.status === 'active' ? 'Active' : 'Inactive'} />
                </div>
              </div>
              <div className="rounded-xl border border-dark-brown-100 p-4">
                <p className="text-xs text-dark-brown-400 mb-1">Title</p>
                <p className="text-sm font-semibold text-dark-brown-900 mb-4">{viewItem.title}</p>
                <p className="text-xs text-dark-brown-400 mb-1">Review</p>
                <p className="text-sm text-dark-brown-700 leading-relaxed">{viewItem.review}</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Dialog */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-brown-900/40 backdrop-blur-sm" onClick={() => setDeleteItem(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-dark-brown-100">
            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-saffron-50 border border-saffron-100 mx-auto mb-4">
              <AlertTriangle className="h-7 w-7 text-saffron-600" />
            </div>
            <h3 className="text-base font-heading font-bold text-dark-brown-900 text-center">Delete Testimonial?</h3>
            <p className="text-sm text-dark-brown-500 text-center mt-2 leading-relaxed">
              Are you sure you want to delete the testimonial by <span className="font-semibold text-dark-brown-800">"{deleteItem.fullname}"</span>? This action cannot be undone.
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
