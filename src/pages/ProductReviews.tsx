import React, { useState, useEffect } from "react";
import { Star, Trash2, MessageSquare, CheckCircle2, AlertTriangle } from "lucide-react";
import { DataTable } from "../components/DataTable";
import type { Column } from "../components/DataTable";
import { StatCard } from "../components/StatCard";
import { authService } from "../services/api";

interface ProductReview {
  reviewid: string;
  productid: string;
  productname: string;
  userid: string;
  rating: number;
  reviewtitle: string;
  reviewdescription: string;
  status: string;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-3.5 w-3.5 ${i < rating ? "fill-temple-gold-500 text-temple-gold-500" : "text-dark-brown-200"}`}
      />
    ))}
  </div>
);

export const ProductReviews: React.FC = () => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [overall, setOverall] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deleteItem, setDeleteItem] = useState<ProductReview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await authService.getProductReviews();
      if (res.data) {
        setReviews(res.data.reviews || []);
        setOverall(res.data.overall || null);
      }
    } catch (error) {
      console.error("Failed to fetch product reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleStatus = async (review: ProductReview) => {
    try {
      const newStatus = review.status === "active" ? "inactive" : "active";
      await authService.updateProductReviewStatus(review.reviewid, newStatus);
      // Optimistic update
      setReviews(prev => prev.map(r => r.reviewid === review.reviewid ? { ...r, status: newStatus } : r));
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await authService.deleteProductReview(deleteItem.reviewid);
      setReviews(prev => prev.filter(r => r.reviewid !== deleteItem.reviewid));
    } catch (error) {
      console.error("Failed to delete review", error);
      alert("Failed to delete review");
    } finally {
      setDeleteItem(null);
    }
  };

  const filtered = reviews.filter((r) => {
    const matchSearch =
      r.reviewtitle.toLowerCase().includes(search.toLowerCase()) ||
      r.productname.toLowerCase().includes(search.toLowerCase()) ||
      r.reviewdescription.toLowerCase().includes(search.toLowerCase());
    const matchRating =
      ratingFilter === "All" || r.rating === Number(ratingFilter);
    const matchStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" ? r.status === "active" : r.status === "inactive");
    return matchSearch && matchRating && matchStatus;
  });

  const columns: Column<ProductReview>[] = [
    {
      key: "reviewtitle",
      header: "Title & User",
      render: (row) => (
        <div>
          <div className="font-medium text-dark-brown-900 max-w-[180px] truncate">
            {row.reviewtitle}
          </div>
          <div className="text-xs text-dark-brown-400">User: {row.userid.substring(0, 8)}</div>
        </div>
      ),
    },
    {
      key: "productname",
      header: "Product",
      render: (row) => (
        <div>
          <div className="font-medium text-dark-brown-900 max-w-[180px] truncate">
            {row.productname}
          </div>
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      render: (row) => (
        <div className="flex items-center gap-2">
          <StarRating rating={row.rating} />
          <span className="text-xs font-semibold text-dark-brown-600">
            {row.rating}.0
          </span>
        </div>
      ),
    },
    {
      key: "reviewdescription",
      header: "Review Details",
      render: (row) => (
        <span className="text-sm text-dark-brown-600 max-w-[260px] truncate block" title={row.reviewdescription}>
          {row.reviewdescription}
        </span>
      ),
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
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <button
          onClick={() => setDeleteItem(row)}
          className="text-dark-brown-400 hover:text-saffron-700 transition-colors"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ),
    },
  ];

  if (isLoading) {
    return <div className="p-8 text-center text-dark-brown-500">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold text-dark-brown-900">
          Product Reviews
        </h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Reviews"
          value={overall?.totalreviews || reviews.length}
          icon={MessageSquare}
        />
        <StatCard
          title="Average Rating"
          value={`${overall?.avgrating || "0.0"} / 5`}
          icon={Star}
        />
        <StatCard
          title="Active Reviews"
          value={overall?.activestatus || reviews.filter(r => r.status === "active").length}
          icon={CheckCircle2}
        />
        <StatCard
          title="5 Star Reviews"
          value={reviews.filter((r) => r.rating === 5).length}
          icon={Star}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-[0_4px_20px_rgba(58,43,37,0.04)] transition-all duration-300 overflow-hidden">
        <div className="p-4 border-b border-dark-brown-100 flex flex-col sm:flex-row flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search reviews..."
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
            {[5, 4, 3, 2, 1].map((s) => (
              <option key={s} value={s}>
                {s} Star
              </option>
            ))}
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
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(item) => item.reviewid}
        />
      </div>

      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-brown-900/40 backdrop-blur-sm" onClick={() => setDeleteItem(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-dark-brown-100">
            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-saffron-50 border border-saffron-100 mx-auto mb-4">
              <AlertTriangle className="h-7 w-7 text-saffron-600" />
            </div>
            <h3 className="text-base font-heading font-bold text-dark-brown-900 text-center">Delete Review?</h3>
            <p className="text-sm text-dark-brown-500 text-center mt-2 leading-relaxed">
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 mt-4 p-3 bg-dark-brown-50 rounded-xl border border-dark-brown-100">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-dark-brown-900 truncate">{deleteItem.reviewtitle}</p>
                <p className="text-xs text-dark-brown-400">{deleteItem.productname}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setDeleteItem(null)} className="flex-1 py-2.5 rounded-xl border border-dark-brown-200 text-dark-brown-700 text-sm font-medium hover:bg-dark-brown-50 transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-saffron-600 to-saffron-700 text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
