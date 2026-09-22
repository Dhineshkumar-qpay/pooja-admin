import React, { useState, useEffect } from "react";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  X,
  Save,
  Upload,
  Tag,
  Package,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "../components/DataTable";
import type { Column } from "../components/DataTable";
import { authService, IMAGE_BASE_URL } from "../services/api";

interface Category {
  categoryid: string;
  categoryname: string;
  description: string;
  thumbnailimage: string;
  productcount: number;
}

const inputCls =
  "w-full border border-dark-brown-200 rounded-xl px-4 py-2.5 text-dark-brown-900 placeholder-dark-brown-400 focus:outline-none focus:ring-1 focus:ring-temple-gold-500 focus:border-temple-gold-500 text-sm bg-white";

export const Categories: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // view drawer
  const [viewItem, setViewItem] = useState<Category | null>(null);

  // edit form (full page style)
  const [editItem, setEditItem] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);

  // delete dialog
  const [deleteItem, setDeleteItem] = useState<Category | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await authService.getCategories();
      if (res.status === 200 && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openEdit = (row: Category) => {
    setEditItem(row);
    setEditName(row.categoryname);
    setEditDesc(row.description);
    setEditImage(null);
    setViewItem(null);
  };

  const saveEdit = async () => {
    if (!editItem) return;
    try {
      const formData = new FormData();
      formData.append("categoryname", editName);
      formData.append("description", editDesc);
      if (editImage) {
        formData.append("thumbnailimage", editImage);
      } else {
        formData.append("thumbnailimage", editItem.thumbnailimage);
      }

      await authService.editCategory(editItem.categoryid, formData);
      setEditItem(null);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update category");
      console.error("Failed to update category", err);
    }
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await authService.deleteCategory(deleteItem.categoryid);
      setDeleteItem(null);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete category");
      console.error("Failed to delete category", err);
    }
  };

  const columns: Column<Category>[] = [
    {
      key: "categoryname",
      header: "Category",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={`${IMAGE_BASE_URL}${row.thumbnailimage}?t=${Date.now()}`}
            alt={row.categoryname}
            className="h-10 w-10 rounded-md object-cover border border-dark-brown-100 shadow-sm"
          />
          <div>
            <div className="font-medium text-dark-brown-900">{row.categoryname}</div>
            <div className="text-xs text-dark-brown-500 max-w-[200px] truncate">
              {row.description}
            </div>
          </div>
        </div>
      ),
    },
    { key: "productcount", header: "Products", render: (row) => row.productcount },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex gap-3">
          <button
            onClick={() => {
              setViewItem(row);
              setEditItem(null);
            }}
            className="text-dark-brown-400 hover:text-temple-gold-600 transition-colors"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => openEdit(row)}
            className="text-dark-brown-400 hover:text-temple-gold-600 transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeleteItem(row)}
            className="text-dark-brown-400 hover:text-saffron-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (editItem) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setEditItem(null)}
            className="p-2 text-dark-brown-500 hover:text-dark-brown-900 bg-white border border-dark-brown-200 rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-heading font-bold text-dark-brown-900">
              Edit Category
            </h1>
            <p className="text-sm text-dark-brown-400 mt-0.5">
              {editItem.categoryname}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setEditItem(null)}
              className="px-4 py-2 border border-dark-brown-200 text-dark-brown-700 rounded-xl hover:bg-ivory-50 transition-all text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={saveEdit}
              className="flex items-center gap-2 bg-gradient-to-r from-saffron-600 to-temple-gold-500 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
            >
              <Save className="h-4 w-4" /> Save Changes
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-sm p-6 md:p-8">
          <h2 className="text-sm font-semibold text-dark-brown-800 mb-6 pb-2 border-b border-dark-brown-100">
            Category Information
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-brown-700">
                Category Image
              </label>
              <div className="border-2 border-dashed border-dark-brown-200 rounded-xl p-6 flex flex-col items-center justify-center bg-ivory-50 hover:bg-ivory-100 transition-colors relative w-full max-w-xs">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setEditImage(e.target.files[0]);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <img
                  src={editImage ? URL.createObjectURL(editImage) : `${IMAGE_BASE_URL}${editItem.thumbnailimage}?t=${Date.now()}`}
                  alt=""
                  className="h-20 w-20 rounded-xl object-cover mb-3 shadow-sm pointer-events-none"
                />
                <div className="flex items-center gap-1.5 text-sm text-dark-brown-500 pointer-events-none">
                  <Upload className="h-4 w-4 text-saffron-500" />
                  <span>Click to replace image</span>
                </div>
                <p className="text-xs text-dark-brown-400 mt-1 pointer-events-none">
                  SVG, PNG, JPG or GIF (max. 400×400px)
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-dark-brown-700">
                Category Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g. Pooja Items"
                className={inputCls}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-dark-brown-700">
                Description
              </label>
              <textarea
                rows={4}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Write a brief description about the category..."
                className={inputCls}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold text-dark-brown-900">
          Categories
        </h1>
        <button
          onClick={() => navigate("/admin/categories/add")}
          className="bg-gradient-to-r from-saffron-600 to-saffron-500 hover:from-saffron-700 hover:to-saffron-600 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </button>
      </div>

      <div className="flex gap-6 items-start">
        <div className="w-full bg-white rounded-2xl border border-dark-brown-100 shadow-sm hover:shadow-[0_8px_30px_rgba(58,43,37,0.08)] transition-all duration-300 overflow-hidden">
          <div className="p-4 border-b border-dark-brown-100 flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search categories..."
              className="flex-1 min-w-[200px] border border-dark-brown-200 rounded-md px-3 py-2 text-sm text-dark-brown-900 placeholder-dark-brown-400 focus:outline-none focus:ring-1 focus:ring-temple-gold-500 focus:border-temple-gold-500"
            />
          </div>
          <DataTable
            columns={columns}
            data={categories}
            keyExtractor={(item) => item.categoryid}
          />
        </div>

        {viewItem && (
          <>
            <div
              className="fixed inset-0 z-40 bg-dark-brown-900/30 backdrop-blur-sm"
              onClick={() => setViewItem(null)}
            />
            <div className="fixed top-0 right-0 h-full z-50 w-80 bg-white border-l border-dark-brown-100 shadow-2xl overflow-y-auto transition-transform duration-300 translate-x-0">
              <div className="flex items-center justify-between px-5 py-4 border-b border-dark-brown-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-temple-gold-50 rounded-lg">
                    <Tag className="h-4 w-4 text-temple-gold-600" />
                  </div>
                  <span className="text-sm font-semibold text-dark-brown-800">
                    Category Detail
                  </span>
                </div>
                <button
                  onClick={() => setViewItem(null)}
                  className="p-1.5 rounded-lg text-dark-brown-400 hover:bg-dark-brown-50 hover:text-dark-brown-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="relative">
                <img
                  src={`${IMAGE_BASE_URL}${viewItem.thumbnailimage}?t=${Date.now()}`}
                  alt={viewItem.categoryname}
                  className="w-full h-40 object-cover"
                />
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h2 className="text-base font-heading font-bold text-dark-brown-900">
                    {viewItem.categoryname}
                  </h2>
                  <p className="text-sm text-dark-brown-500 mt-1 leading-relaxed">
                    {viewItem.description}
                  </p>
                </div>

                <div className="rounded-xl border border-dark-brown-100 overflow-hidden divide-y divide-dark-brown-50">
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-xs text-dark-brown-400 flex items-center gap-1.5">
                      <Package className="h-3.5 w-3.5" /> Products
                    </span>
                    <span className="text-sm font-bold text-dark-brown-900">
                      {viewItem.productcount}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openEdit(viewItem)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-saffron-600 to-temple-gold-500 text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
                >
                  <Edit className="h-4 w-4" /> Edit Category
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-dark-brown-900/40 backdrop-blur-sm"
            onClick={() => setDeleteItem(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-dark-brown-100">
            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-saffron-50 border border-saffron-100 mx-auto mb-4">
              <AlertTriangle className="h-7 w-7 text-saffron-600" />
            </div>

            <h3 className="text-base font-heading font-bold text-dark-brown-900 text-center">
              Delete Category?
            </h3>
            <p className="text-sm text-dark-brown-500 text-center mt-2 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-dark-brown-800">
                "{deleteItem.categoryname}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex items-center gap-3 mt-4 p-3 bg-dark-brown-50 rounded-xl border border-dark-brown-100">
              <img
                src={`${IMAGE_BASE_URL}${deleteItem.thumbnailimage}?t=${Date.now()}`}
                alt=""
                className="h-10 w-10 rounded-lg object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-dark-brown-900 truncate">
                  {deleteItem.categoryname}
                </p>
                <p className="text-xs text-dark-brown-400">
                  {deleteItem.productcount} products
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setDeleteItem(null)}
                className="flex-1 py-2.5 rounded-xl border border-dark-brown-200 text-dark-brown-700 text-sm font-medium hover:bg-dark-brown-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-saffron-600 to-saffron-700 text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
