import React, { useState, useEffect } from "react";
import { Eye, X, ShoppingBag, IndianRupee, Calendar, Phone, Mail } from "lucide-react";
import { DataTable } from "../components/DataTable";
import type { Column } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { authService } from "../services/api";

interface Customer {
  userid: string;
  name: string | null;
  email: string;
  mobile: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  totalamount: number;
  totalorders: number;
}

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [viewItem, setViewItem] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await authService.getAllUsers();
        if (res.data) {
          setCustomers(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch customers", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    const term = search.toLowerCase();
    const matchName = c.name?.toLowerCase().includes(term) || false;
    const matchEmail = c.email?.toLowerCase().includes(term) || false;
    const matchMobile = c.mobile?.toLowerCase().includes(term) || false;
    return matchName || matchEmail || matchMobile;
  });

  const columns: Column<Customer>[] = [
    {
      key: "name",
      header: "Customer",
      render: (row) => (
        <div>
          <div className="font-medium text-dark-brown-900">{row.name || "Unknown"}</div>
          <div className="text-xs text-dark-brown-500">{row.email}</div>
        </div>
      ),
    },
    { 
      key: "mobile", 
      header: "Phone",
      render: (row) => <span className="text-sm text-dark-brown-700">{row.mobile || "-"}</span>
    },
    { 
      key: "totalorders", 
      header: "Orders",
      render: (row) => <span className="text-sm text-dark-brown-700">{row.totalorders || 0}</span>
    },
    {
      key: "totalamount",
      header: "Total Spent",
      render: (row) => `₹${(row.totalamount || 0).toLocaleString()}`,
    },
    { 
      key: "createdAt", 
      header: "Registered",
      render: (row) => <span className="text-sm text-dark-brown-700">{new Date(row.createdAt).toLocaleDateString()}</span>
    },
    {
      key: "status",
      header: "Status",
      render: () => <StatusBadge status="Active" />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex gap-3">
          <button onClick={() => setViewItem(row)} className="text-dark-brown-400 hover:text-temple-gold-600 transition-colors">
            <Eye className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold text-dark-brown-900">
          Customers
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-[0_4px_20px_rgba(58,43,37,0.04)] transition-all duration-300 overflow-hidden">
        <div className="p-4 border-b border-dark-brown-100 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] border border-dark-brown-200 rounded-md px-3 py-2 text-sm text-dark-brown-900 placeholder-dark-brown-400 focus:outline-none focus:ring-1 focus:ring-temple-gold-500 focus:border-temple-gold-500"
          />
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-dark-brown-500">Loading customers...</div>
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            keyExtractor={(item) => item.userid}
          />
        )}
      </div>

      {viewItem && (
        <>
          <div className="fixed inset-0 z-40 bg-dark-brown-900/30 backdrop-blur-sm" onClick={() => setViewItem(null)} />
          <div className="fixed top-0 right-0 h-full z-50 w-80 bg-white border-l border-dark-brown-100 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-dark-brown-100">
              <span className="text-sm font-semibold text-dark-brown-800">Customer Detail</span>
              <button onClick={() => setViewItem(null)} className="p-1.5 rounded-lg text-dark-brown-400 hover:bg-dark-brown-50 hover:text-dark-brown-700 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-saffron-400 to-temple-gold-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {viewItem.name ? viewItem.name.charAt(0).toUpperCase() : viewItem.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-base font-heading font-bold text-dark-brown-900">{viewItem.name || "Unknown"}</h2>
                  <p className="text-xs text-dark-brown-400 truncate w-48">{viewItem.userid}</p>
                </div>
              </div>
              <div className="rounded-xl border border-dark-brown-100 overflow-hidden divide-y divide-dark-brown-50">
                <div className="flex items-center gap-2 px-4 py-3">
                  <Mail className="h-3.5 w-3.5 text-dark-brown-400" />
                  <span className="text-xs text-dark-brown-600 truncate">{viewItem.email}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-3">
                  <Phone className="h-3.5 w-3.5 text-dark-brown-400" />
                  <span className="text-xs text-dark-brown-600">{viewItem.mobile || "-"}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-dark-brown-400 flex items-center gap-1.5"><ShoppingBag className="h-3.5 w-3.5" /> Orders</span>
                  <span className="text-sm font-bold text-dark-brown-900">{viewItem.totalorders || 0}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-dark-brown-400 flex items-center gap-1.5"><IndianRupee className="h-3.5 w-3.5" /> Total Spent</span>
                  <span className="text-sm font-bold text-dark-brown-900">₹{(viewItem.totalamount || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-dark-brown-400 flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Registered</span>
                  <span className="text-xs text-dark-brown-700">{new Date(viewItem.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-dark-brown-400">Status</span>
                  <StatusBadge status="Active" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
